const { Client } = require('pg');

const url = 'postgresql://neondb_owner:npg_41hUzHelRYKO@ep-icy-bonus-at168pq3-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const cleanUrl = url.replace('&channel_binding=require', '');
const c = new Client({ connectionString: cleanUrl, ssl: { rejectUnauthorized: false } });

const productos = [
  {
    nombre: 'Air Jordan 1 Retro High OG "Chicago"',
    marca: 'Jordan',
    precio: 259000,
    descripcion: 'El santo grial de las zapatillas. El colorway original que definió generaciones. Cuero premium, base blanca, overlays rojo Chicago y Swoosh negro. Un ícono cultural que trasciende el básquetbol.',
    imagen_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    modalidad: 'STOCK',
    talles: [
      { talle: '38', cantidad: 2 }, { talle: '39', cantidad: 5 },
      { talle: '40', cantidad: 8 }, { talle: '41', cantidad: 12 },
      { talle: '42', cantidad: 6 }, { talle: '43', cantidad: 3 },
      { talle: '44', cantidad: 1 },
    ],
  },
  {
    nombre: 'Nike Dunk Low "Panda"',
    marca: 'Nike',
    precio: 135000,
    descripcion: 'El hype sin límites. Blanco y negro, clean y versátil. La silueta que domina las calles en 2024-2025. Comodidad duradera y estilo innegociable.',
    imagen_url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=800&q=80',
    modalidad: 'STOCK',
    talles: [
      { talle: '38', cantidad: 4 }, { talle: '39', cantidad: 7 },
      { talle: '40', cantidad: 15 }, { talle: '41', cantidad: 20 },
      { talle: '42', cantidad: 10 }, { talle: '43', cantidad: 5 },
      { talle: '44', cantidad: 2 },
    ],
  },
  {
    nombre: 'Adidas Yeezy 350 V2 "Onyx"',
    marca: 'Adidas',
    precio: 279000,
    descripcion: 'El diseño de Kanye que rompió el molde. Primeknit negro total con estriado lateral. Boost ultraliviano. Exclusivo bajo pedido — importación directa.',
    imagen_url: 'https://images.unsplash.com/photo-1587563871167-1db9b3bf0ba9?w=800&q=80',
    modalidad: 'ENCARGO',
    tiempo_espera_dias: 20,
    talles: [
      { talle: '39', cantidad: 999 }, { talle: '40', cantidad: 999 },
      { talle: '41', cantidad: 999 }, { talle: '42', cantidad: 999 },
      { talle: '43', cantidad: 999 }, { talle: '44', cantidad: 999 },
    ],
  },
  {
    nombre: 'New Balance 990v6 "Grey"',
    marca: 'New Balance',
    precio: 189000,
    descripcion: 'Hechas en USA. La evolución del modelo más icónico de NB. Mesh con paneles de gamuza. FuelCell de la suela para comodidad suprema. El favorito de los que saben.',
    imagen_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2c1cf?w=800&q=80',
    modalidad: 'STOCK',
    talles: [
      { talle: '38', cantidad: 3 }, { talle: '39', cantidad: 6 },
      { talle: '40', cantidad: 9 }, { talle: '41', cantidad: 11 },
      { talle: '42', cantidad: 4 }, { talle: '43', cantidad: 2 },
    ],
  },
  {
    nombre: 'Air Jordan 4 Retro "Military Black"',
    marca: 'Jordan',
    precio: 219000,
    descripcion: 'El hype de las 4 con el colorway más clean. Cuero blanco con detalles negro militar y cemento. Amortiguación Air visible. Un must-have en cualquier colección.',
    imagen_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80',
    modalidad: 'STOCK',
    talles: [
      { talle: '40', cantidad: 4 }, { talle: '41', cantidad: 8 },
      { talle: '42', cantidad: 10 }, { talle: '43', cantidad: 5 },
      { talle: '44', cantidad: 2 },
    ],
  },
  {
    nombre: 'Nike Air Force 1 Low "Triple White"',
    marca: 'Nike',
    precio: 99000,
    descripcion: 'El clásico absoluto. Blanco total, impecable. La zapatilla que todos deberían tener. Clean, atemporal y siempre vigente.',
    imagen_url: 'https://images.unsplash.com/photo-1600185365778-7875a359a2f6?w=800&q=80',
    modalidad: 'STOCK',
    talles: [
      { talle: '38', cantidad: 8 }, { talle: '39', cantidad: 12 },
      { talle: '40', cantidad: 20 }, { talle: '41', cantidad: 25 },
      { talle: '42', cantidad: 15 }, { talle: '43', cantidad: 7 },
      { talle: '44', cantidad: 4 },
    ],
  },
  {
    nombre: 'Adidas Samba OG "Black/White"',
    marca: 'Adidas',
    precio: 85000,
    descripcion: 'El resurgir de un clásico. La silueta del año. Diseño limpio, suela de goma y la icónica T-toe. Perfecta para el día a día con estilo europeo.',
    imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    modalidad: 'STOCK',
    talles: [
      { talle: '38', cantidad: 6 }, { talle: '39', cantidad: 10 },
      { talle: '40', cantidad: 14 }, { talle: '41', cantidad: 18 },
      { talle: '42', cantidad: 10 }, { talle: '43', cantidad: 4 },
    ],
  },
  {
    nombre: 'ASICS Gel-Kayano 14 "Cream/Pure Silver"',
    marca: 'ASICS',
    precio: 165000,
    descripcion: 'El revival tech-runner. Malla plateada con overlays crema. Gel cushioning y aesthetic Y2K puro. Para los que buscan diferenciarse.',
    imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    modalidad: 'ENCARGO',
    tiempo_espera_dias: 15,
    talles: [
      { talle: '39', cantidad: 999 }, { talle: '40', cantidad: 999 },
      { talle: '41', cantidad: 999 }, { talle: '42', cantidad: 999 },
      { talle: '43', cantidad: 999 }, { talle: '44', cantidad: 999 },
    ],
  },
];

async function seed() {
  try {
    await c.connect();
    const existing = await c.query('SELECT count(*) as c FROM productos');
    if (parseInt(existing.rows[0].c) > 0) {
      console.log('Limpiando productos existentes...');
      await c.query('DELETE FROM detalle_pedidos');
      await c.query('DELETE FROM pedidos');
      await c.query('DELETE FROM stock');
      await c.query('DELETE FROM productos');
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
      const badge = p.modalidad === 'STOCK' ? '📦' : '🔥';
      console.log(badge + ' ' + p.nombre + ' — $' + p.precio.toLocaleString('es-CL'));
    }

    console.log('\n✅ ' + productos.length + ' productos cargados.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

seed();
