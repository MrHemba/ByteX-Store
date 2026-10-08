import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SHOPIFY_PRODUCTS_URL =
  'https://beevenombs.myshopify.com/products.json?limit=250';

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
  option1: string | null;
  option2: string | null;
  option3: string | null;
}

interface ShopifyProduct {
  id: number;
  handle: string;
  title: string;
  body_html: string | null;
  vendor: string | null;
  product_type: string | null;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  options: ShopifyOption[];
}

interface ShopifyResponse {
  products: ShopifyProduct[];
}

// ── Helpers de transformación ──────────────────────────────────────────────────

function stripHtml(html: string | null): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, '').trim() || null;
}

/**
 * Construye el objeto especificaciones a partir de las opciones del producto.
 * Ejemplo: { "Combos": ["1 Pote", "Combo 2 Potes"], "Talla": ["S", "M", "L"] }
 */
function buildEspecificaciones(
  options: ShopifyOption[]
): Record<string, string[]> {
  const specs: Record<string, string[]> = {};
  for (const opt of options) {
    if (opt.name.toLowerCase() === 'title' && opt.values[0] === 'Default Title') {
      continue; // Opción genérica de Shopify — ignorar
    }
    specs[opt.name] = opt.values;
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
 */
function transformProduct(p: ShopifyProduct) {
  const disponible = p.variants.some((v) => v.available);

  return {
    id:                  `dropi_${p.id}`,
    shopify_id:          p.id,
    shopify_handle:      p.handle,
    nombre:              p.title,
    descripcion_publica: stripHtml(p.body_html),
    precio:              calcPrecio(p.variants),
    fotos_tienda:        p.images.map((img) => img.src),
    disponible,
    condicion:           'segunda' as const,
    especificaciones:    buildEspecificaciones(p.options),
    categoria:           p.product_type || null,
    codigo:              null,
    vendor:              p.vendor || null,
    synced_at:           new Date().toISOString(),
    visible_tienda:      true,
  };
}

// ── Handler GET ────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Verificar autorización
  const authHeader = req.headers.get('authorization') ?? '';
  const expectedToken = `Bearer ${process.env.SHOPIFY_SYNC_SECRET}`;

  if (!process.env.SHOPIFY_SYNC_SECRET || authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch productos desde Shopify (API pública, sin auth)
  let shopifyData: ShopifyResponse;
  try {
    const res = await fetch(SHOPIFY_PRODUCTS_URL, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 }, // no cachear en Next.js
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Shopify respondió ${res.status}` },
        { status: 502 }
      );
    }

    shopifyData = (await res.json()) as ShopifyResponse;
  } catch (err) {
    console.error('[ByteX/sync] Error fetching Shopify:', err);
    return NextResponse.json(
      { error: 'Error al conectar con Shopify' },
      { status: 502 }
    );
  }

  const products = shopifyData.products ?? [];

  if (products.length === 0) {
    return NextResponse.json({ synced: 0, errors: [] });
  }

  // Transformar y hacer upsert por lotes de 50
  const errors: string[] = [];
  let synced = 0;
  const BATCH_SIZE = 50;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE).map(transformProduct);

    const { error } = await supabase
      .from('productos_dropi')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error('[ByteX/sync] Upsert error:', error.message);
      errors.push(error.message);
    } else {
      synced += batch.length;
    }
  }

  return NextResponse.json({ synced, errors });
}
