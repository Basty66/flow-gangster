import getPool from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { codigo, tipo, valor, fecha_expiracion, limite_usos } = req.body;

  if (!codigo || !tipo || !valor || !fecha_expiracion || !limite_usos) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (!['PERCENT', 'FIXED'].includes(tipo)) {
    return res.status(400).json({ error: 'tipo debe ser PERCENT o FIXED' });
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO cupones (codigo, tipo, valor, fecha_expiracion, limite_usos)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [codigo.toUpperCase(), tipo, valor, fecha_expiracion, limite_usos]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El código ya existe' });
    }
    console.error('Error creating coupon:', error);
    return res.status(500).json({ error: 'Error al crear cupón' });
  }
}
