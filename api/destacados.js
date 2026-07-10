import getPool from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT p.*,
             COALESCE(SUM(s.cantidad), 0)::int as stock,
             json_agg(json_build_object('talle', s.talle, 'cantidad', s.cantidad)) FILTER (WHERE s.talle IS NOT NULL) as talles
      FROM productos p
      LEFT JOIN stock s ON s.producto_id = p.id
      WHERE p.activo = true AND p.destacado = true
      GROUP BY p.id
      ORDER BY p.orden_destacado ASC, p.created_at DESC
    `);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching destacados:', error);
    return res.status(500).json({ error: 'Error al obtener destacados' });
  }
}
