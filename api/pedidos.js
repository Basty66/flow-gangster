import getPool from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    items,
    cliente_nombre,
    cliente_email,
    cliente_whatsapp,
    tipo_entrega,
    datos_envio,
    metodo_pago,
    cupon_codigo,
  } = req.body;

  if (!items?.length || !cliente_nombre || !cliente_whatsapp || !tipo_entrega || !metodo_pago) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (tipo_entrega === 'ENVIO_STARKEN' && !datos_envio?.direccion) {
    return res.status(400).json({ error: 'Dirección requerida para envío Starken' });
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Calcular subtotal y validar stock
    let subtotal = 0;

    for (const item of items) {
      const prodRes = await client.query(
        'SELECT id, precio, nombre, modalidad FROM productos WHERE id = $1 AND activo = true',
        [item.producto_id]
      );

      if (prodRes.rows.length === 0) {
        throw { status: 400, message: `Producto ${item.producto_id} no encontrado` };
      }

      const producto = prodRes.rows[0];
      const precioUnitario = producto.precio;

      if (producto.modalidad === 'STOCK') {
        const stockRes = await client.query(
          'SELECT cantidad FROM stock WHERE producto_id = $1 AND talle = $2 FOR UPDATE',
          [item.producto_id, item.talle]
        );

        if (stockRes.rows.length === 0 || stockRes.rows[0].cantidad < item.cantidad) {
          throw {
            status: 400,
            message: `Stock insuficiente para ${producto.nombre} talle ${item.talle}`,
          };
        }

        await client.query(
          'UPDATE stock SET cantidad = cantidad - $1 WHERE producto_id = $2 AND talle = $3',
          [item.cantidad, item.producto_id, item.talle]
        );
      }

      subtotal += precioUnitario * item.cantidad;
    }

    // 2. Validar cupón si existe
    let descuento = 0;
    let cuponId = null;

    if (cupon_codigo) {
      const cuponRes = await client.query(
        `SELECT id, tipo, valor, limite_usos, usados, activo, fecha_expiracion
         FROM cupones WHERE codigo = $1`,
        [cupon_codigo]
      );

      if (cuponRes.rows.length === 0) {
        throw { status: 400, message: 'Cupón no encontrado' };
      }

      const cupon = cuponRes.rows[0];

      if (!cupon.activo) {
        throw { status: 400, message: 'Cupón desactivado' };
      }

      if (new Date(cupon.fecha_expiracion) < new Date()) {
        throw { status: 400, message: 'Cupón expirado' };
      }

      if (cupon.usados >= cupon.limite_usos) {
        throw { status: 400, message: 'Cupón agotado' };
      }

      cuponId = cupon.id;

      if (cupon.tipo === 'PERCENT') {
        descuento = Math.round((subtotal * cupon.valor) / 100);
      } else {
        descuento = cupon.valor;
      }

      if (descuento > subtotal) descuento = subtotal;

      await client.query('UPDATE cupones SET usados = usados + 1 WHERE id = $1', [cupon.id]);
    }

    const total = subtotal - descuento;

    // 3. Crear pedido
    const pedidoRes = await client.query(
      `INSERT INTO pedidos
       (cliente_nombre, cliente_email, cliente_whatsapp, tipo_entrega, datos_envio, metodo_pago,
        cupon_id, subtotal, descuento, total, estado_pedido)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDIENTE_PAGO')
       RETURNING id`,
      [
        cliente_nombre,
        cliente_email || null,
        cliente_whatsapp,
        tipo_entrega,
        tipo_entrega === 'ENVIO_STARKEN' ? JSON.stringify(datos_envio) : null,
        metodo_pago,
        cuponId,
        subtotal,
        descuento,
        total,
      ]
    );

    const pedidoId = pedidoRes.rows[0].id;

    // 4. Insertar detalle del pedido
    for (const item of items) {
      await client.query(
        `INSERT INTO detalle_pedidos (pedido_id, producto_id, talle, cantidad)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.producto_id, item.talle, item.cantidad]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      id: pedidoId,
      subtotal,
      descuento,
      total,
      whatsapp_url: `https://wa.me/${process.env.WHATSAPP_NUMBER || '56900000000'}?text=${encodeURIComponent(`¡Hola! Adjunto comprobante del pedido #${pedidoId}. Total: $${total.toLocaleString('es-CL')}.`)}`,
    });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }

    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Error al crear pedido' });
  } finally {
    client.release();
  }
}
