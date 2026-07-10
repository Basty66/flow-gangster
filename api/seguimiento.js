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
      `SELECT id, cliente_nombre, cliente_email, estado_pedido, codigo_seguimiento,
              tipo_entrega, metodo_pago, datos_envio, subtotal, descuento, total,
              created_at
       FROM pedidos WHERE id = $1`,
      [pedido_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = result.rows[0];

    const detalleResult = await pool.query(
      `SELECT dp.talle, dp.cantidad, p.nombre, p.marca, p.modalidad
       FROM detalle_pedidos dp
       JOIN productos p ON p.id = dp.producto_id
       WHERE dp.pedido_id = $1`,
      [pedido_id]
    );

    const seguimiento_url =
      pedido.estado_pedido === 'ENVIADO' && pedido.codigo_seguimiento
        ? `https://www.starken.cl/seguimiento?codigo=${pedido.codigo_seguimiento}`
        : null;

    const datosEnvio = pedido.datos_envio || {};

    return res.status(200).json({
      id: pedido.id,
      cliente_nombre: pedido.cliente_nombre,
      estado_pedido: pedido.estado_pedido,
      codigo_seguimiento: pedido.codigo_seguimiento,
      seguimiento_url,
      tipo_entrega: pedido.tipo_entrega,
      metodo_pago: pedido.metodo_pago,
      total: pedido.total,
      subtotal: pedido.subtotal,
      descuento: pedido.descuento,
      created_at: pedido.created_at,
      items: detalleResult.rows,
      direccion: datosEnvio.direccion || null,
      comuna: datosEnvio.comuna || null,
      region: datosEnvio.region || null,
    });
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return res.status(500).json({ error: 'Error al consultar pedido' });
  }
}
