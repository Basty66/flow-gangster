import jwt from 'jsonwebtoken';
import getPool from '../db.js';

const JWT_SECRET = () => process.env.JWT_SECRET || 'fallback-secret-change-me';
const ADMIN_USER = () => process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = () => process.env.ADMIN_PASS || 'flowgangster';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  const validUser = ADMIN_USER();
  const validPass = ADMIN_PASS();

  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { role: 'admin', username: validUser },
    JWT_SECRET(),
    { expiresIn: '24h' }
  );

  return res.status(200).json({ token });
}
