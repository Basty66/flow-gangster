const { Client } = require('pg');

const url = 'postgresql://neondb_owner:npg_41hUzHelRYKO@ep-icy-bonus-at168pq3-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const cleanUrl = url.replace('&channel_binding=require', '');
const c = new Client({ connectionString: cleanUrl, ssl: { rejectUnauthorized: false } });

const productos = [
  {
    nombre: 'Air Jordan 1 Retro High OG',
    marca: 'Jordan',
    precio: 189000,
    descripcion: 'Clásico e icónico. El modelo que empezó todo. Silueta atemporal con amortiguación Nike Air.',
    imagen_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
    modalidad: 'STOCK',
    talles: [
      { talle: '38', cantidad: 2 },
      { talle: '39', cantidad: 5 },
      { talle: '40', cantidad: 8 },
      { talle: '41', cantidad: 12 },
      { talle: '42', cantidad: 6 },
      { talle: '43', cantidad: 3 },
      { talle: '44', cantidad: 1 },
    ],
  },
  {
    nombre: 'Nike Dunk Low Retro',
    marca: 'Nike',
    precio: 129000,
    descripcion: 'Las Dunk Low volvieron con todo. Estilo universitario que trasciende generaciones.',
    imagen_url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=600',
    modalidad: 'STOCK',
    talles: [
      { talle: '39', cantidad: 4 },
      { talle: '40', cantidad: 10 },
      { talle: '41', cantidad: 15 },
      { talle: '42', cantidad: 7 },
      { talle: '43', cantidad: 2 },
    ],
  },
  {
    nombre: 'Yeezy 350 V2 Carbon Beluga',
    marca: 'Adidas',
    precio: 249000,
    descripcion: 'Diseño visionario de Kanye West. Primeknit transpirable y suela BOOST. Modelo exclusivo bajo pedido.',
    imagen_url: 'https://images.unsplash.com/photo-1587563871167-1db9b3bf0ba9?w=600',
    modalidad: 'ENCARGO',
    tiempo_espera_dias: 20,
    talles: [
      { talle: '40', cantidad: 999 },
      { talle: '41', cantidad: 999 },
      { talle: '42', cantidad: 999 },
      { talle: '43', cantidad: 999 },
      { talle: '44', cantidad: 999 },
    ],
  },
  {
    nombre: 'New Balance 550',
    marca: 'New Balance',
    precio: 109000,
    descripcion: 'El revival del básquetbol de los 80. Comodidad y estilo retro que vuelve a dominar las calles.',
    imagen_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2c1cf?w=600',
    modalidad: 'STOCK',
    talles: [
      { talle: '38', cantidad: 3 },
      { talle: '39', cantidad: 6 },
      { talle: '40', cantidad: 9 },
      { talle: '41', cantidad: 11 },
      { talle: '42', cantidad: 4 },
    ],
  },
];

async function seed() {
  try {
    await c.connect();
    const existing = await c.query('SELECT count(*) as c FROM productos');
    if (parseInt(existing.rows[0].c) > 0) {
      console.log('Ya hay productos en la DB, saltando seed.');
      process.exit(0);
    }

    for (const p of productos) {
      const prod = await c.query(
        `INSERT INTO productos (nombre, marca, precio, descripcion, imagen_url, modalidad, tiempo_espera_dias)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [p.nombre, p.marca, p.precio, p.descripcion, p.imagen_url, p.modalidad, p.tiempo_espera_dias || 0]
      );
      const prodId = prod.rows[0].id;

      for (const t of p.talles) {
        await c.query(
          'INSERT INTO stock (producto_id, talle, cantidad) VALUES ($1, $2, $3)',
          [prodId, t.talle, t.cantidad]
        );
      }
      console.log('✓ ' + p.nombre);
    }

    console.log('\nProductos de ejemplo insertados correctamente.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

seed();
