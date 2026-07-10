import getPool from '../db.js';
import { verifyAdmin } from './_verify.js';

const SEED_PRODUCTS = [
  { nombre: 'Air Max Pulse', marca: 'Nike', precio: 89990, descripcion: 'Las Nike Air Max Pulse representan la nueva generacion de la linea Air Max. Diseño futurista con amortiguacion visible.', modalidad: 'STOCK', imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', talles: ['38','39','40','41','42','43','44'] },
  { nombre: 'Air Jordan 1 Mid', marca: 'Jordan', precio: 129990, descripcion: 'El icono que empezo todo. Las Air Jordan 1 Mid mantienen el legado con un diseño atemporal que trasciende generaciones.', modalidad: 'STOCK', imagen: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', talles: ['39','40','41','42','43','44','45'] },
  { nombre: 'Dunk Low Retro', marca: 'Nike', precio: 99990, descripcion: 'Las Nike Dunk Low Retro vuelven con colores clasicos y una silueta que domina las calles.', modalidad: 'STOCK', imagen: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800', talles: ['38','39','40','41','42','43'] },
  { nombre: 'Air Force 1 \'07', marca: 'Nike', precio: 109990, descripcion: 'Un icono del basket convertido en leyenda urbana. Las Air Force 1 \'07 son el lienzo perfecto para cualquier estilo.', modalidad: 'STOCK', imagen: 'https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=800', talles: ['39','40','41','42','43','44','45'] },
  { nombre: 'Cortez Basic', marca: 'Nike', precio: 69990, descripcion: 'El clasico de todos los tiempos. Nike Cortez: simple, iconico, inconfundible.', modalidad: 'ENCARGO', imagen: 'https://images.unsplash.com/photo-1612282131511-6c8f6dc3f1e7?w=800', talles: ['38','39','40','41','42','43','44'] },
  { nombre: 'Air Zoom Vomero 16', marca: 'Nike', precio: 139990, descripcion: 'Running de alto rendimiento con la maxima amortiguacion ZoomX. Para los que no se detienen.', modalidad: 'STOCK', imagen: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', talles: ['39','40','41','42','43','44','45'] },
  { nombre: 'Blazer Low \'77', marca: 'Nike', precio: 79990, descripcion: 'Un clasico del basket reimaginado para la calle. Nike Blazer Low \'77 con acabado vintage.', modalidad: 'ENCARGO', imagen: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800', talles: ['38','39','40','41','42','43'] },
  { nombre: 'Air Jordan 4 Retro', marca: 'Jordan', precio: 189990, descripcion: 'Las Air Jordan 4 son un pilar del sneaker culture. Edicion retro con todos los detalles originales.', modalidad: 'STOCK', imagen: 'https://images.unsplash.com/photo-1552346154-2923dde08f6e?w=800', talles: ['40','41','42','43','44','45'] },
];

export default async function handler(req, res) {
  if (!verifyAdmin(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT COUNT(*) as count FROM productos');
    if (parseInt(existing.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Ya existen productos. Eliminalos primero si quieres reseedear.' });
    }

    for (const p of SEED_PRODUCTS) {
      const prod = await client.query(
        `INSERT INTO productos (nombre, marca, precio, descripcion, imagen_url, modalidad)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [p.nombre, p.marca, p.precio, p.descripcion, p.imagen, p.modalidad]
      );
      const prodId = prod.rows[0].id;
      for (const talle of p.talles) {
        await client.query(
          'INSERT INTO stock (producto_id, talle, cantidad) VALUES ($1, $2, $3)',
          [prodId, talle, p.modalidad === 'ENCARGO' ? 999 : Math.floor(Math.random() * 8) + 1]
        );
      }
    }

    await client.query('COMMIT');
    return res.status(200).json({ ok: true, count: SEED_PRODUCTS.length, message: 'Productos demo creados' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding:', error);
    return res.status(500).json({ error: 'Error al crear datos demo' });
  } finally {
    client.release();
  }
}
