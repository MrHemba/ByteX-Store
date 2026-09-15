import { createClient } from '@supabase/supabase-js';
import type { Product } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProducts(categoria?: string) {
  let query = supabase
    .from('productos')
    .select(`
      id, nombre, descripcion_publica,
      precio_unitario, fotos_tienda, condicion,
      especificaciones, categoria, codigo_principal,
      stock
    `)
    .eq('visible_tienda', true)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (categoria && categoria !== 'todos') {
    query = query.ilike('categoria', `%${categoria}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[ByteX] Error cargando productos:', error.message, error.details);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    precio: p.precio_unitario,
    codigo: p.codigo_principal,
    fotos_tienda: p.fotos_tienda || [],
    especificaciones: p.especificaciones || {},
    stock: p.stock ?? 0,
  })) as Product[];
}

export async function getProductBySlug(id: string) {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, nombre, descripcion_publica,
      precio_unitario, fotos_tienda, condicion,
      especificaciones, categoria, codigo_principal,
      stock
    `)
    .eq('id', id)
    .eq('visible_tienda', true)
    .single();

  if (error || !data) {
    console.error('[ByteX] Error cargando producto:', error?.message);
    return null;
  }

  return {
    ...data,
    precio: data.precio_unitario,
    codigo: data.codigo_principal,
    fotos_tienda: data.fotos_tienda || [],
    especificaciones: data.especificaciones || {},
    stock: data.stock ?? 0,
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

  if (error || !cotizacion) return null;

  const detalles = payload.items.map((item) => ({
    cotizacion_id: cotizacion.id,
    producto_id: item.producto_id,
    nombre_producto: item.nombre_producto,
    precio_original: item.precio_unitario,
    precio_final: item.precio_final,
    cantidad: item.cantidad,
    subtotal: item.subtotal,
  }));

  await supabase.from('cotizaciones_web_detalle').insert(detalles);
  return cotizacion;
}
