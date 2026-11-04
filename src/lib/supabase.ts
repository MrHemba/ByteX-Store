import { createClient } from '@supabase/supabase-js';
import type { Product } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Orden de presentación: jsonb reordena las claves, así que se fija aquí */
const SPEC_ORDER = [
  'Procesador', 'Generación', 'Memoria RAM', 'Disco SSD', 'Tamaño', 'Pantalla', 'Resolución', 'Frecuencia', 'Panel',
  'Tipo', 'Sistema de Tinta', 'Impresión', 'Velocidad',
  'Gráficos', 'Placa Madre', 'Sistema Operativo', 'Color', 'Teclado', 'Conectividad', 'Puertos', 'Incluye',
  'Extras', 'Garantía', 'Modelo', 'Observación',
];

function sortSpecs(obj: Record<string, string>): Record<string, string> {
  const rank = (k: string) => { const i = SPEC_ORDER.indexOf(k); return i === -1 ? SPEC_ORDER.length : i; };
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => rank(a) - rank(b)));
}

/** Valores como texto: acepta también arrays y objetos */
function specValue(v: unknown): string {
  if (Array.isArray(v)) return v.map(String).join(', ');
  if (v === null || v === undefined) return '';
  return typeof v === 'object' ? JSON.stringify(v) : String(v);
}

/** Parsea especificaciones sin importar si llega como objeto o como string JSON */
function parseEspecificaciones(raw: unknown): Record<string, string> {
  let obj: unknown = raw;
  if (typeof raw === 'string') {
    try { obj = JSON.parse(raw); } catch { return {}; }
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  const entries = Object.entries(obj as Record<string, unknown>)
    .map(([k, v]) => [k, specValue(v)] as const)
    .filter(([, v]) => v !== '');
  return sortSpecs(Object.fromEntries(entries));
}

// ── Mapeo de cada fuente al tipo Product ──────────────────────────────────────

const PRODUCTO_COLS = `id, nombre, descripcion_publica, precio_unitario, fotos_tienda, condicion,
  especificaciones, categoria, codigo_principal, stock, es_servicio,
  precio_anterior, precio_anterior_fecha`;

/** Una baja se muestra solo si es de al menos este % y tiene menos de BAJA_VIGENCIA_DIAS días. */
const BAJA_MIN_PCT = 3;
const BAJA_VIGENCIA_DIAS = 30;

function calcularBaja(precio: number, anterior: number | null, fecha: string | null): number | null {
  if (!anterior || !fecha || !(precio > 0) || anterior <= precio) return null;
  const dias = (Date.now() - new Date(fecha).getTime()) / 86_400_000;
  if (dias > BAJA_VIGENCIA_DIAS) return null;
  const pct = Math.round(((anterior - precio) / anterior) * 100);
  return pct >= BAJA_MIN_PCT ? pct : null;
}
const EQUIPO_COLS   = `id, tipo, marca, modelo, descripcion_publica, precio_tienda, fotos_tienda, condicion, categoria`;

function mapProducto(p: any): Product {
  const precio = Number(p.precio_unitario ?? 0);
  const anterior = p.precio_anterior != null ? Number(p.precio_anterior) : null;
  const baja = calcularBaja(precio, anterior, p.precio_anterior_fecha ?? null);
  return {
    id:                  String(p.id),
    nombre:              p.nombre,
    descripcion_publica: p.descripcion_publica,
    precio:              p.precio_unitario           ?? 0,
    fotos_tienda:        p.fotos_tienda              || [],
    condicion:           p.condicion                 || 'nuevo',
    especificaciones:    parseEspecificaciones(p.especificaciones),
    categoria:           p.categoria                 || '',
    codigo:              p.codigo_principal,
    stock:               p.stock                     ?? 0,
    es_servicio:         p.es_servicio               ?? false,
    precio_anterior:     baja ? anterior : null,
    baja_pct:            baja,
  };
}

function mapEquipo(e: any): Product {
  return {
    id:                  `eq_${e.id}`,
    nombre:              [e.tipo, e.marca, e.modelo].filter(Boolean).join(' '),
    descripcion_publica: e.descripcion_publica,
    precio:              e.precio_tienda ?? 0,
    fotos_tienda:        e.fotos_tienda  || [],
    condicion:           e.condicion     || 'segunda',
    especificaciones:    {},
    categoria:           e.categoria     || '',
    codigo:              null,
    stock:               1,
    es_servicio:         false,
  };
}

export async function getProducts(): Promise<Product[]> {
  const [{ data: prods, error: e1 }, { data: equips, error: e2 }] = await Promise.all([
    supabase.from('productos').select(PRODUCTO_COLS)
      .eq('visible_tienda', true).eq('active', true)
      .order('created_at', { ascending: false }),
    supabase.from('equipos_compraventa').select(EQUIPO_COLS)
      .eq('visible_tienda', true).neq('estado', 'vendido'),
  ]);

  if (e1) console.error('[ByteX] Error productos:', e1.message);
  if (e2) console.error('[ByteX] Error equipos:', e2.message);

  return [
    ...(prods  || []).map(mapProducto),
    ...(equips || []).map(mapEquipo),
  ];
}

export async function getProductBySlug(id: string): Promise<Product | null> {
  // Equipos compraventa tienen ID con prefijo "eq_"
  if (id.startsWith('eq_')) {
    const equipoId = Number(id.slice(3));
    if (!Number.isInteger(equipoId)) return null;
    const { data, error } = await supabase
      .from('equipos_compraventa').select(EQUIPO_COLS)
      .eq('id', equipoId).eq('visible_tienda', true).neq('estado', 'vendido')
      .maybeSingle();
    if (error) throw new Error(`[ByteX] Error cargando equipo: ${error.message}`);
    return data ? mapEquipo(data) : null;
  }

  // Producto normal
  const productoId = Number(id);
  if (!Number.isInteger(productoId)) return null;
  const { data, error } = await supabase
    .from('productos').select(PRODUCTO_COLS)
    .eq('id', productoId).eq('visible_tienda', true).eq('active', true)
    .maybeSingle();
  if (error) throw new Error(`[ByteX] Error cargando producto: ${error.message}`);
  return data ? mapProducto(data) : null;
}

/**
 * Versión actual de los productos del carrito.
 * null = ya no está publicado; los ids que fallaron por red no aparecen en el resultado.
 */
export async function getProductsByIds(ids: string[]): Promise<Record<string, Product | null>> {
  const results = await Promise.allSettled(ids.map((id) => getProductBySlug(id)));
  const out: Record<string, Product | null> = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') out[ids[i]] = r.value;
  });
  return out;
}

export async function createCotizacion(payload: {
  cliente_nombre: string;
  cliente_whatsapp: string;
  cliente_email?: string;
  notas_cliente?: string;
  subtotal: number;
  total: number;
  items: Array<{
    producto_id: string;
    nombre_producto: string;
    codigo_producto: string | null;
    precio_unitario: number;
    precio_final: number;
    cantidad: number;
    subtotal: number;
  }>;
}): Promise<boolean> {
  // El id se genera aquí: la tienda no tiene permiso de lectura sobre cotizaciones_web
  const cotizacionId = crypto.randomUUID();

  const { error } = await supabase
    .from('cotizaciones_web')
    .insert({
      id:               cotizacionId,
      cliente_nombre:   payload.cliente_nombre,
      cliente_whatsapp: payload.cliente_whatsapp,
      cliente_email:    payload.cliente_email || null,
      notas_cliente:    payload.notas_cliente || null,
      subtotal:         payload.subtotal,
      total:            payload.total,
      origen:           'tienda_web',
    });

  if (error) {
    console.error('[ByteX] Error insertando cotizacion_web:', error.message, error.code, error.details);
    return false;
  }

  const detalles = payload.items.map((item) => ({
    cotizacion_id:   cotizacionId,
    // Los equipos (eq_N) no tienen FK en producto_id
    producto_id:     /^\d+$/.test(item.producto_id) ? Number(item.producto_id) : null,
    nombre_producto: item.nombre_producto,
    codigo_producto: item.codigo_producto,
    precio_original: item.precio_unitario,
    precio_final:    item.precio_final,
    cantidad:        item.cantidad,
    subtotal:        item.subtotal,
  }));

  const { error: detError } = await supabase.from('cotizaciones_web_detalle').insert(detalles);
  if (detError) {
    console.error('[ByteX] Error insertando cotizaciones_web_detalle:', detError.message, detError.code);
    return false;
  }
  return true;
}
