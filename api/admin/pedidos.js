import getPool from '../db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { estado } = req.query;
    try {
      const pool = getPool();
      let query = `
        SELECT p.*, json_agg(dp.*) as detalle
        FROM pedidos p
        LEFT JOIN detalle_pedidos dp ON dp.pedido_id = p.id
      `;
      const params = [];
      if (estado) {
        query += ' WHERE p.estado_pedido = $1';
        params.push(estado);
      }
      query += ' GROUP BY p.id ORDER BY p.fecha_pedido DESC';
      const result = await pool.query(query, params);
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  }

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, estado_pedido, codigo_seguimiento } = req.body;

  if (!id || !estado_pedido) {
    return res.status(400).json({ error: 'id y estado_pedido requeridos' });
  }

  if (!['PAGADO', 'ENVIADO', 'CANCELADO'].includes(estado_pedido)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  if (estado_pedido === 'ENVIADO' && !codigo_seguimiento) {
    return res.status(400).json({ error: 'Código de seguimiento requerido para ENVIADO' });
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const pedidoRes = await client.query(
      'SELECT estado_pedido FROM pedidos WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (pedidoRes.rows.length === 0) {
      throw { status: 404, message: 'Pedido no encontrado' };
    }

    // Si se cancela, devolver stock si era modalidad STOCK
    if (estado_pedido === 'CANCELADO') {
      const detalles = await client.query(
        `SELECT dp.producto_id, dp.talle, dp.cantidad, p.modalidad
         FROM detalle_pedidos dp
         JOIN productos p ON p.id = dp.producto_id
         WHERE dp.pedido_id = $1`,
        [id]
      );

      for (const detalle of detalles.rows) {
        if (detalle.modalidad === 'STOCK') {
          await client.query(
            'UPDATE stock SET cantidad = cantidad + $1 WHERE producto_id = $2 AND talle = $3',
            [detalle.cantidad, detalle.producto_id, detalle.talle]
          );
        }
      }
    }

    const updateFields = ['estado_pedido = $2'];
    const values = [id, estado_pedido];

    if (codigo_seguimiento) {
      updateFields.push('codigo_seguimiento = $3');
      values.push(codigo_seguimiento);
    }

    await client.query(
      `UPDATE pedidos SET ${updateFields.join(', ')} WHERE id = $1`,
      values
    );

    await client.query('COMMIT');

    return res.status(200).json({ message: 'Pedido actualizado', id, estado_pedido });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }

    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Error al actualizar pedido' });
  } finally {
    client.release();
  }
}
