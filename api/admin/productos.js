import getPool from '../db.js';
import { verifyAdmin } from './_verify.js';

export default async function handler(req, res) {
  if (!verifyAdmin(req, res)) return;

  const pool = getPool();

  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT p.*, json_agg(json_build_object('id', s.id, 'talle', s.talle, 'cantidad', s.cantidad)) as talles
        FROM productos p
        LEFT JOIN stock s ON s.producto_id = p.id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `);
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  if (req.method === 'POST') {
    const { nombre, marca, precio, descripcion, imagen_url, modalidad, tiempo_espera_dias, talles } = req.body;

    if (!nombre || !marca || !precio || !imagen_url) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const prodRes = await client.query(
        `INSERT INTO productos (nombre, marca, precio, descripcion, imagen_url, modalidad, tiempo_espera_dias)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          nombre,
          marca,
          precio,
          descripcion || '',
          imagen_url,
          modalidad || 'STOCK',
          modalidad === 'ENCARGO' ? (tiempo_espera_dias || 15) : 0,
        ]
      );

      const producto = prodRes.rows[0];

      if (talles?.length) {
        for (const t of talles) {
          await client.query(
            'INSERT INTO stock (producto_id, talle, cantidad) VALUES ($1, $2, $3)',
            [producto.id, t.talle, t.cantidad || 0]
          );
        }
      }

      await client.query('COMMIT');
      return res.status(201).json(producto);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Error al crear producto' });
    } finally {
      client.release();
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
