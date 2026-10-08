-- Migration: productos_dropi
-- Tabla para productos sincronizados desde Shopify (puente Dropi)
-- Ejecutar en el proyecto Supabase: mixtsrczbovsyumrofso

CREATE TABLE IF NOT EXISTS productos_dropi (
  id                  TEXT PRIMARY KEY,                  -- formato: dropi_{shopify_id}
  shopify_id          BIGINT UNIQUE NOT NULL,
  shopify_handle      TEXT NOT NULL,
  nombre              TEXT NOT NULL,
  descripcion_publica TEXT,
  precio              NUMERIC NOT NULL DEFAULT 0,
  fotos_tienda        TEXT[] DEFAULT '{}',
  disponible          BOOLEAN NOT NULL DEFAULT false,
  condicion           TEXT DEFAULT 'segunda',
  especificaciones    JSONB DEFAULT '{}',
  categoria           TEXT,
  codigo              TEXT,
  vendor              TEXT,
  synced_at           TIMESTAMPTZ DEFAULT NOW(),
  visible_tienda      BOOLEAN DEFAULT true
);

-- Índices útiles para las consultas de la tienda
CREATE INDEX IF NOT EXISTS idx_productos_dropi_visible
  ON productos_dropi (visible_tienda)
  WHERE visible_tienda = true;

CREATE INDEX IF NOT EXISTS idx_productos_dropi_disponible
  ON productos_dropi (disponible);

CREATE INDEX IF NOT EXISTS idx_productos_dropi_categoria
  ON productos_dropi (categoria);

-- Comentario de tabla
COMMENT ON TABLE productos_dropi IS
  'Productos sincronizados desde Shopify beevenombs.myshopify.com (puente Dropi). Se actualiza vía API route /api/shopify/sync.';
