-- FLOW GANGSTER - Esquema de Base de Datos (Neon DB)
-- Ejecutar en la consola SQL de Neon

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Productos
CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    precio INT NOT NULL,
    descripcion TEXT,
    imagen_url TEXT NOT NULL,
    modalidad VARCHAR(20) DEFAULT 'STOCK',
    tiempo_espera_dias INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock por talle
CREATE TABLE stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    talle VARCHAR(10) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_stock_producto_talle ON stock(producto_id, talle);

-- Cupones
CREATE TABLE cupones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    valor INT NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    limite_usos INT NOT NULL,
    usados INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

-- Pedidos
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_whatsapp VARCHAR(50) NOT NULL,
    tipo_entrega VARCHAR(50) NOT NULL,
    datos_envio JSONB,
    metodo_pago VARCHAR(50) NOT NULL,
    cupon_id UUID REFERENCES cupones(id),
    subtotal INT NOT NULL,
    descuento INT DEFAULT 0,
    total INT NOT NULL,
    estado_pedido VARCHAR(50) DEFAULT 'PENDIENTE_PAGO',
    codigo_seguimiento VARCHAR(100),
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detalle de pedidos
CREATE TABLE detalle_pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES productos(id),
    talle VARCHAR(10) NOT NULL,
    cantidad INT NOT NULL
);
