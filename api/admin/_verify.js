import jwt from 'jsonwebtoken';

const JWT_SECRET = () => process.env.JWT_SECRET || 'fallback-secret-change-me';

export function verifyAdmin(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token requerido' });
    return false;
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET());
    req.admin = decoded;
    return true;
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return false;
  }
}
