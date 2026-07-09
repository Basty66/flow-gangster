import getPool from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { producto_id, talle, operacion } = req.body;

  if (!producto_id || !talle || !operacion) {
    return res.status(400).json({ error: 'producto_id, talle y operacion requeridos' });
  }

  if (!['SUMAR', 'RESTAR'].includes(operacion)) {
    return res.status(400).json({ error: 'operacion debe ser SUMAR o RESTAR' });
  }

  try {
    const pool = getPool();
    const signo = operacion === 'SUMAR' ? '+' : '-';

    const result = await pool.query(
      `UPDATE stock SET cantidad = GREATEST(0, cantidad ${signo} 1)
       WHERE producto_id = $1 AND talle = $2
       RETURNING *`,
      [producto_id, talle]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock no encontrado para ese talle' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating stock:', error);
    return res.status(500).json({ error: 'Error al actualizar stock' });
  }
}
