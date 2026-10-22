-- Migration: cerrar accesos públicos
-- Ejecutar en el proyecto Supabase: mixtsrczbovsyumrofso (DESPUÉS de 01 y del deploy de la tienda)
--
-- El ERP no se ve afectado: su Edge Function usa conexión directa (postgres) y service role,
-- que no pasan por RLS.

-- 1. Cotizaciones: la tienda solo inserta. Con esta política cualquiera con la anon key
--    podía leer nombre, WhatsApp y email de todos los clientes.
drop policy if exists anon_select_cotizacion on public.cotizaciones_web;

-- 2. productos_dropi: lectura pública solo de lo visible; escritura solo vía sync_productos_dropi
alter table public.productos_dropi enable row level security;
drop policy if exists tienda_ver_productos_dropi on public.productos_dropi;
create policy tienda_ver_productos_dropi on public.productos_dropi
  for select to anon, authenticated
  using (visible_tienda = true);

-- 3. dropi_blocklist: sin acceso público (la consulta sync_productos_dropi)
alter table public.dropi_blocklist enable row level security;
