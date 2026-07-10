import getPool from './db.js';

function parseId(query) {
  if (!query || !query.id) return null;
  if (Array.isArray(query.id)) return query.id[0];
  if (typeof query.id === 'string' && query.id.trim()) return query.id.trim();
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();
    const id = parseId(req.query);

    if (id) {
      const result = await pool.query(`
        SELECT p.*,
               COALESCE(SUM(s.cantidad), 0)::int as stock,
               json_agg(json_build_object('talle', s.talle, 'cantidad', s.cantidad)) FILTER (WHERE s.talle IS NOT NULL) as talles
        FROM productos p
        LEFT JOIN stock s ON s.producto_id = p.id
        WHERE p.id = $1 AND p.activo = true
        GROUP BY p.id
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      return res.status(200).json(result.rows[0]);
    }

    const result = await pool.query(`
      SELECT p.*,
             COALESCE(SUM(s.cantidad), 0)::int as stock,
             json_agg(json_build_object('talle', s.talle, 'cantidad', s.cantidad)) FILTER (WHERE s.talle IS NOT NULL) as talles
      FROM productos p
      LEFT JOIN stock s ON s.producto_id = p.id
      WHERE p.activo = true
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Error al obtener productos' });
  }
}
