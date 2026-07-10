ALTER TABLE productos ADD COLUMN IF NOT EXISTS destacado BOOLEAN DEFAULT FALSE;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS orden_destacado INT DEFAULT 0;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS precio_oferta INT;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS oferta_hasta TIMESTAMP;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS etiqueta_oferta VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado) WHERE destacado = TRUE;
