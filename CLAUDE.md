# ByteX Store — Contexto para Claude

## Qué es este proyecto

Tienda e-commerce Next.js 15 (App Router, TypeScript) conectada a la misma Supabase del ERP FacturGamer. Vende laptops, PCs, impresoras y accesorios de segunda mano bajo la marca **ByteX Store — una tienda de H&G Solutions**. La administración se hace desde el módulo "Tienda Online" del ERP.

Supabase project ref: `mixtsrczbovsyumrofso`

## Estructura

```
src/
  app/
    page.tsx                      # Homepage
    catalogo/page.tsx             # Catálogo con filtros
    catalogo/[id]/page.tsx        # SSR — fetch por ID
    catalogo/[id]/ProductDetailClient.tsx  # Cliente — galería, carrito
    carrito/page.tsx              # Flujo cotización 3 pasos
    layout.tsx                    # Metadata global (favicon, OG)
    not-found.tsx                 # 404 con logo
  components/
    Navbar.tsx                    # Logo mix-blend-mode:screen
    ProductCard.tsx               # Card con badge condición + add to cart
    CartDrawer.tsx                # Drawer lateral del carrito
  lib/
    supabase.ts                   # getProducts, getProductBySlug, createCotizacion
    types.ts                      # Product, CartItem
    cart-store.ts                 # Zustand (persistido en localStorage)
public/
  logo.png                        # Logo principal (PNG transparente) — favicon
  logo-principal.jpg              # Para OG/Twitter cards
```

## Columnas reales de `productos` (usar SIEMPRE estos nombres)

| Nombre real         | Alias en tipo Product |
|---------------------|-----------------------|
| `precio_unitario`   | `precio`              |
| `codigo_principal`  | `codigo`              |
| `active`            | —                     |
| `es_servicio`       | `es_servicio`         |
| `visible_tienda`    | —                     |
| `descripcion_publica` | `descripcion_publica` |
| `fotos_tienda`      | `fotos_tienda`        |
| `condicion`         | `condicion`           |
| `especificaciones`  | `especificaciones`    |
| `stock`             | `stock`               |

## Fuentes de productos (dos tablas)

1. `productos` donde `visible_tienda = true AND active = true` → IDs normales (ej: `"123"`)
2. `equipos_compraventa` donde `visible_tienda = true AND estado != 'vendido'` → IDs con prefijo `eq_` (ej: `"eq_45"`)

Ambas mapeadas al tipo `Product`. Los equipos siempre tienen `es_servicio: false` y `stock: 1`.

## Servicios (`es_servicio = true`)

- Disponibilidad: `product.es_servicio || product.stock > 0`
- No mostrar badge "Agotado" ni alerta de stock bajo para servicios
- No mostrar "¡Último disponible!" para servicios

## Logo — técnica

`mix-blend-mode: screen` en elementos `<Image>` sobre fondo oscuro elimina el fondo del JPG y deja solo los elementos brillantes. Usar en Navbar y cualquier lugar con fondo `#0D0F1A` o similar.

## Flujo cotización

1. Cliente agrega al carrito → Zustand + localStorage
2. `/carrito` — 3 pasos: resumen → datos de contacto → confirmación
3. Al confirmar: `createCotizacion()` en `supabase.ts` → INSERT en `cotizaciones_web` + `cotizaciones_web_detalle`
4. Trigger automático en Supabase crea notificación en ERP
5. Equipos compraventa: `producto_id = null` en detalle (solo guardan `nombre_producto`)

## Tabla `cotizaciones_web`

- `estado` CHECK constraint: `('pendiente', 'en_proceso', 'atendida', 'cancelada')`
- `proforma_id` INTEGER — nunca pasar null con COALESCE en postgres.js
- `id` es UUID

## Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://mixtsrczbovsyumrofso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_WHATSAPP_NUMBER=593XXXXXXXXX
```

## Estilos

CSS custom properties definidas en `globals.css`. Paleta "dark luxury tech":
- `--bg`: fondo principal oscuro
- `--bg-card`: fondo de tarjetas
- `--bg-elevated`: fondo elevado
- `--accent`: color principal (verde/cyan)
- `--accent-dim`: versión translúcida del accent
- `--text`, `--text-2`, `--text-3`: jerarquía de texto
- Fuentes: `var(--font-ui)`, `var(--font-mono)`
