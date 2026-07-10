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

  if (req.method === 'PUT') {
    const { id, destacado, orden_destacado, precio_oferta, oferta_hasta, etiqueta_oferta, nombre, marca, precio, descripcion } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'id requerido' });
    }

    try {
      const sets = [];
      const values = [];
      let idx = 1;

      if (destacado !== undefined) { sets.push(`destacado = $${idx++}`); values.push(destacado); }
      if (orden_destacado !== undefined) { sets.push(`orden_destacado = $${idx++}`); values.push(orden_destacado); }
      if (precio_oferta !== undefined) { sets.push(`precio_oferta = $${idx++}`); values.push(precio_oferta || null); }
      if (oferta_hasta !== undefined) { sets.push(`oferta_hasta = $${idx++}`); values.push(oferta_hasta || null); }
      if (etiqueta_oferta !== undefined) { sets.push(`etiqueta_oferta = $${idx++}`); values.push(etiqueta_oferta || null); }
      if (nombre !== undefined) { sets.push(`nombre = $${idx++}`); values.push(nombre); }
      if (marca !== undefined) { sets.push(`marca = $${idx++}`); values.push(marca); }
      if (precio !== undefined) { sets.push(`precio = $${idx++}`); values.push(precio); }
      if (descripcion !== undefined) { sets.push(`descripcion = $${idx++}`); values.push(descripcion); }

      if (sets.length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar' });
      }

      values.push(id);
      const result = await pool.query(
        `UPDATE productos SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  return res.status(405).json({ error: 'Method not allowed' });
}
