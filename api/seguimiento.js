import getPool from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pedido_id } = req.query;

  if (!pedido_id) {
    return res.status(400).json({ error: 'pedido_id es requerido' });
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT id, cliente_nombre, estado_pedido, codigo_seguimiento, 
              tipo_entrega, total, created_at
       FROM pedidos WHERE id = $1`,
      [pedido_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = result.rows[0];
    const seguimiento_url =
      pedido.estado_pedido === 'ENVIADO' && pedido.codigo_seguimiento
        ? `https://www.starken.cl/seguimiento?codigo=${pedido.codigo_seguimiento}`
        : null;

    return res.status(200).json({ ...pedido, seguimiento_url });
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return res.status(500).json({ error: 'Error al consultar pedido' });
  }
}
