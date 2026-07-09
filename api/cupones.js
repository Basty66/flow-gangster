import getPool from './db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = () => process.env.JWT_SECRET || 'fallback-secret-change-me';

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    jwt.verify(auth.split(' ')[1], JWT_SECRET());
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

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
