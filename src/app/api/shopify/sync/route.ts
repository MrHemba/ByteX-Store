import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SHOPIFY_PRODUCTS_URL = `https://${process.env.SHOPIFY_STORE || 'beevenombs.myshopify.com'}/products.json`;
const PAGE_SIZE = 250;   // máximo que permite Shopify
const MAX_PAGES = 40;    // tope de seguridad: 10.000 productos

// ── Tipos Shopify ──────────────────────────────────────────────────────────────

interface ShopifyImage {
  src: string;
}

interface ShopifyOption {
  name: string;
  values: string[];
}

interface ShopifyVariant {
  id: number;
  price: string;
  available: boolean;
}

interface ShopifyProduct {
  id: number;
  handle: string;
  title: string;
  body_html: string | null;
  vendor: string | null;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  options: ShopifyOption[];
}

// ── Helpers de transformación ──────────────────────────────────────────────────

function stripHtml(html: string | null): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, '').trim() || null;
}

/**
 * Construye el objeto especificaciones a partir de las opciones del producto.
 * Ejemplo: { "Combos": "1 Pote, Combo 2 Potes", "Talla": "S, M, L" }
 */
function buildEspecificaciones(options: ShopifyOption[]): Record<string, string> {
  const specs: Record<string, string> = {};
  for (const opt of options) {
    if (opt.name.toLowerCase() === 'title' && opt.values[0] === 'Default Title') {
      continue; // Opción genérica de Shopify — ignorar
    }
    specs[opt.name] = opt.values.join(', ');
  }
  return specs;
}

/**
 * Precio más bajo entre variantes disponibles.
 * Si ninguna está disponible, devuelve el precio de la primera variante.
 */
function calcPrecio(variants: ShopifyVariant[]): number {
  const availableVariants = variants.filter((v) => v.available);
  const source = availableVariants.length > 0 ? availableVariants : variants;
  const prices = source.map((v) => parseFloat(v.price)).filter((p) => !isNaN(p));
  if (prices.length === 0) return 0;
  return Math.min(...prices);
}

/**
 * Transforma un producto Shopify al formato de la tabla productos_dropi.
 * categoria y condicion solo se aplican al crear: en productos existentes manda el ERP.
 */
function transformProduct(p: ShopifyProduct) {
  // La API pública de Shopify no refleja el stock real de Dropi.
  // Dropi es la fuente de verdad: si el producto está en el catálogo, está disponible.
  const disponible = p.variants.length > 0;

  return {
    id:                  `dropi_${p.id}`,
    shopify_id:          p.id,
    shopify_handle:      p.handle,
    nombre:              p.title,
    descripcion_publica: stripHtml(p.body_html),
    precio:              calcPrecio(p.variants),
    fotos_tienda:        p.images.map((img) => img.src),
    disponible,
    condicion:           'nuevo',
    especificaciones:    buildEspecificaciones(p.options),
    categoria:           'Zona Tech',
    codigo:              null,
    vendor:              p.vendor || null,
  };
}

/** Todas las páginas de /products.json */
async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  const all: ShopifyProduct[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(`${SHOPIFY_PRODUCTS_URL}?limit=${PAGE_SIZE}&page=${page}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Shopify respondió ${res.status}`);
    const { products = [] } = (await res.json()) as { products?: ShopifyProduct[] };
    all.push(...products);
    if (products.length < PAGE_SIZE) return all;
  }
  throw new Error(`Más de ${MAX_PAGES * PAGE_SIZE} productos en Shopify — subir MAX_PAGES`);
}

// ── CORS headers ──────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ── Handler GET ────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Verificar autorización
  const secret = process.env.SHOPIFY_SYNC_SECRET;
  const authHeader = req.headers.get('authorization') ?? '';

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  let products: ShopifyProduct[];
  try {
    products = await fetchAllProducts();
  } catch (err) {
    console.error('[ByteX/sync] Error fetching Shopify:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al conectar con Shopify' },
      { status: 502, headers: CORS_HEADERS }
    );
  }

  // Lista vacía = probablemente un fallo de Shopify: no marcar todo como retirado
  if (products.length === 0) {
    return NextResponse.json({ total_shopify: 0, synced: 0, errors: [] }, { headers: CORS_HEADERS });
  }

  // La escritura la hace sync_productos_dropi (SECURITY DEFINER): productos_dropi
  // y dropi_blocklist no son escribibles con la anon key. El secreto es la autorización.
  const { data, error } = await supabase.rpc('sync_productos_dropi', {
    p_secret: secret,
    p_items:  products.map(transformProduct),
  });

  if (error) {
    console.error('[ByteX/sync] RPC error:', error.message);
    return NextResponse.json(
      { total_shopify: products.length, synced: 0, errors: [error.message] },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json({
    total_shopify: products.length,
    blocked:       data.blocked,
    synced:        data.synced,
    retirados:     data.retirados,
    errors:        [],
  }, { headers: CORS_HEADERS });
}
