import getPool from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { codigo, total_actual, total } = req.body;
  const monto = total_actual || total || 0;

  if (!codigo) {
    return res.status(400).json({ error: 'Código de cupón requerido' });
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT id, tipo, valor, limite_usos, usados, activo, fecha_expiracion
       FROM cupones WHERE codigo = $1`,
      [codigo.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    const cupon = result.rows[0];

    if (!cupon.activo) {
      return res.status(400).json({ error: 'Cupón desactivado' });
    }

    if (new Date(cupon.fecha_expiracion) < new Date()) {
      return res.status(400).json({ error: 'Cupón expirado' });
    }

    if (cupon.usados >= cupon.limite_usos) {
      return res.status(400).json({ error: 'Cupón agotado' });
    }

    let descuento = 0;
    if (cupon.tipo === 'PERCENT') {
      descuento = Math.round((monto * cupon.valor) / 100);
    } else {
      descuento = cupon.valor;
    }
    if (descuento > monto) descuento = monto;

    return res.status(200).json({
      valido: true,
      tipo: cupon.tipo,
      valor: cupon.valor,
      descuento,
      codigo: cupon.codigo,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({ error: 'Error al validar cupón' });
  }
}
