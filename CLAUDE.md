# ByteX Store — Contexto para Claude

## Qué es este proyecto

Tienda e-commerce Next.js 16 (App Router, TypeScript) conectada a la misma Supabase del ERP FacturGamer. Vende laptops, PCs, impresoras y accesorios de segunda mano bajo la marca **ByteX Store — una tienda de H&G Solutions**. La administración se hace desde el módulo "Tienda Online" del ERP.

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
    supabase.ts                   # getProducts, getProductBySlug, getProductsByIds, createCotizacion
    types.ts                      # Product, CartItem
    cart-store.ts                 # Zustand (persistido en localStorage) + maxQuantity
    migrations/                   # SQL para ejecutar en Supabase
  app/api/shopify/sync/route.ts   # Sync Shopify → productos_dropi (lo llama el ERP)
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

## Fuentes de productos (tres tablas)

1. `productos` donde `visible_tienda = true AND active = true` → IDs normales (ej: `"123"`)
2. `equipos_compraventa` donde `visible_tienda = true AND estado != 'vendido'` → IDs con prefijo `eq_` (ej: `"eq_45"`)
3. `productos_dropi` donde `visible_tienda = true AND disponible = true` → IDs con prefijo `dropi_`

Todas mapeadas al tipo `Product`. Los equipos siempre tienen `es_servicio: false` y `stock: 1`.
Dropi usa `stock: 99` (`DROPI_STOCK`) como centinela de "disponible": Shopify no da cantidades reales.

## Carrito

- El carrito guarda el producto completo en localStorage. `/carrito` lo refresca al entrar
  (`getProductsByIds` + `refreshProducts`): precios nuevos, quita lo que ya no está publicado.
- La cantidad está limitada por `maxQuantity()` (stock; 99 para servicios).

## Seguridad (RLS)

- La anon key es pública. `cotizaciones_web` / `_detalle`: la tienda solo INSERTA (sin SELECT);
  por eso el UUID de la cotización se genera en el cliente con `crypto.randomUUID()`.
- `productos_dropi`: lectura pública de lo visible; la escritura solo vía la función
  `sync_productos_dropi(secret, items)` (SECURITY DEFINER, valida el SHA-256 de `SHOPIFY_SYNC_SECRET`
  guardado en `private.app_config`). Si cambia el secreto en Vercel, actualizar ese hash.
- El sync no sobrescribe `visible_tienda`, `categoria` ni `condicion` (los administra el ERP).

## Servicios (`es_servicio = true`)

- Disponibilidad: `product.es_servicio || product.stock > 0`
- No mostrar badge "Agotado" ni alerta de stock bajo para servicios
- No mostrar "¡Último disponible!" para servicios

## Logo — técnica

`mix-blend-mode: screen` en elementos `<Image>` sobre fondo oscuro elimina el fondo del JPG y deja solo los elementos brillantes. Usar en Navbar y cualquier lugar con fondo `#0D0F1A` o similar.

## Flujo cotización

1. Cliente agrega al carrito → Zustand + localStorage
2. `/carrito` — 3 pasos: resumen → datos de contacto → confirmación
3. Al confirmar: `createCotizacion()` en `supabase.ts` → INSERT en `cotizaciones_web` + `cotizaciones_web_detalle`.
   Solo si se guardó se abre WhatsApp y se vacía el carrito; si falla se muestra el error.
4. Trigger automático en Supabase crea notificación en ERP
5. Equipos compraventa y Dropi: `producto_id = null` en detalle (solo guardan `nombre_producto`)

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
