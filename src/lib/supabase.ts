import { createClient } from '@supabase/supabase-js';
import type { Product } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Parsea especificaciones sin importar si llega como objeto o como string JSON */
function parseEspecificaciones(raw: unknown): Record<string, string> {
  if (!raw) return {};
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw as Record<string, string>;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return {};
}

export async function getProducts(categoria?: string): Promise<Product[]> {
  // ── Productos normales ────────────────────────────────────────────────────
  let prodQuery = supabase
    .from('productos')
    .select(`
      id, nombre, descripcion_publica,
      precio_unitario, fotos_tienda, condicion,
      especificaciones, categoria, codigo_principal, stock, es_servicio
    `)
    .eq('visible_tienda', true)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (categoria && categoria !== 'todos') {
    prodQuery = prodQuery.ilike('categoria', `%${categoria}%`);
  }

  // ── Equipos compraventa ───────────────────────────────────────────────────
  let equipQuery = supabase
    .from('equipos_compraventa')
    .select(`id, tipo, marca, modelo, descripcion_publica, precio_tienda, fotos_tienda, condicion, categoria`)
    .eq('visible_tienda', true)
    .neq('estado', 'vendido');

  if (categoria && categoria !== 'todos') {
    equipQuery = equipQuery.ilike('categoria', `%${categoria}%`);
  }

  const [{ data: prods, error: e1 }, { data: equips, error: e2 }] = await Promise.all([
    prodQuery,
    equipQuery,
  ]);

  if (e1) console.error('[ByteX] Error productos:', e1.message);
  if (e2) console.error('[ByteX] Error equipos:', e2.message);

  const prodMapped: Product[] = (prods || []).map((p: any) => ({
    id:                  String(p.id),
    nombre:              p.nombre,
    descripcion_publica: p.descripcion_publica,
    precio:              p.precio_unitario,
    fotos_tienda:        p.fotos_tienda              || [],
    condicion:           p.condicion                 || 'nuevo',
    especificaciones:    parseEspecificaciones(p.especificaciones),
    categoria:           p.categoria                 || '',
    codigo:              p.codigo_principal,
    stock:               p.stock                     ?? 0,
    es_servicio:         p.es_servicio               ?? false,
  }));

  const equipMapped: Product[] = (equips || []).map((e: any) => ({
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
  }));

  return [...prodMapped, ...equipMapped];
}

export async function getProductBySlug(id: string): Promise<Product | null> {
  // Equipos compraventa tienen ID con prefijo "eq_"
  if (id.startsWith('eq_')) {
    const equipoId = id.replace('eq_', '');
    const { data, error } = await supabase
      .from('equipos_compraventa')
      .select(`id, tipo, marca, modelo, descripcion_publica, precio_tienda, fotos_tienda, condicion, categoria`)
      .eq('id', equipoId)
      .eq('visible_tienda', true)
      .neq('estado', 'vendido')
      .single();

    if (error || !data) {
      console.error('[ByteX] Error cargando equipo:', error?.message);
      return null;
    }

    return {
      id:                  `eq_${data.id}`,
      nombre:              [data.tipo, data.marca, data.modelo].filter(Boolean).join(' '),
      descripcion_publica: data.descripcion_publica,
      precio:              data.precio_tienda,
      fotos_tienda:        data.fotos_tienda        || [],
      condicion:           data.condicion           || 'segunda',
      especificaciones:    {},
      categoria:           data.categoria           || '',
      codigo:              null,
      stock:               1,
    } as Product;
  }

  // Producto normal
  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, nombre, descripcion_publica,
      precio_unitario, fotos_tienda, condicion,
      especificaciones, categoria, codigo_principal, stock, es_servicio
    `)
    .eq('id', id)
    .eq('visible_tienda', true)
    .single();

  if (error || !data) {
    console.error('[ByteX] Error cargando producto:', error?.message);
    return null;
  }

  return {
    id:                  String(data.id),
    nombre:              data.nombre,
    descripcion_publica: data.descripcion_publica,
    precio:              data.precio_unitario,
    fotos_tienda:        data.fotos_tienda              || [],
    condicion:           data.condicion                 || 'nuevo',
    especificaciones:    parseEspecificaciones(data.especificaciones),
    categoria:           data.categoria                 || '',
    codigo:              data.codigo_principal,
    stock:               data.stock                     ?? 0,
    es_servicio:         data.es_servicio               ?? false,
  } as Product;
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
    precio_unitario: number;
    precio_final: number;
    cantidad: number;
    subtotal: number;
  }>;
}) {
  const { data: cotizacion, error } = await supabase
    .from('cotizaciones_web')
    .insert({
      cliente_nombre: payload.cliente_nombre,
      cliente_whatsapp: payload.cliente_whatsapp,
      cliente_email: payload.cliente_email,
      notas_cliente: payload.notas_cliente,
      subtotal: payload.subtotal,
      total: payload.total,
      origen: 'tienda_web',
    })
    .select()
    .single();

  if (error || !cotizacion) {
    console.error('[ByteX] Error insertando cotizacion_web:', error?.message, error?.code, error?.details);
    return null;
  }

  const detalles = payload.items.map((item) => ({
    cotizacion_id:   cotizacion.id,
    // Los equipos usan id "eq_N" — se almacena null en producto_id
    producto_id:     String(item.producto_id).startsWith('eq_') ? null : Number(item.producto_id),
    nombre_producto: item.nombre_producto,
    precio_original: item.precio_unitario,
    precio_final:    item.precio_final,
    cantidad:        item.cantidad,
    subtotal:        item.subtotal,
  }));

  await supabase.from('cotizaciones_web_detalle').insert(detalles);
  return cotizacion;
}
