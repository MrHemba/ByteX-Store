-- Migration: función de sync Shopify → productos_dropi
-- Ejecutar en el proyecto Supabase: mixtsrczbovsyumrofso (ANTES de 02_seguridad_rls)
--
-- /api/shopify/sync la llama con la anon key. La autorización es SHOPIFY_SYNC_SECRET:
-- aquí solo se guarda su SHA-256. Si se cambia el secreto en Vercel, actualizar el hash:
--   update private.app_config set value = encode(sha256(convert_to('<nuevo>', 'UTF8')), 'hex')
--   where key = 'shopify_sync_secret_sha256';

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.app_config (
  key   text primary key,
  value text not null
);

insert into private.app_config (key, value)
values ('shopify_sync_secret_sha256', 'f91ffd3e405ab62d281ad160bfd1187c9f5ac0a2dda6e57e1aa9ce03bb076e84')
on conflict (key) do update set value = excluded.value;

create or replace function public.sync_productos_dropi(p_secret text, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hash      text;
  v_synced    int;
  v_blocked   int;
  v_retirados int;
begin
  select value into v_hash from private.app_config where key = 'shopify_sync_secret_sha256';
  if v_hash is null or encode(sha256(convert_to(coalesce(p_secret, ''), 'UTF8')), 'hex') <> v_hash then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  create temp table _items on commit drop as
  select * from jsonb_to_recordset(p_items) as x(
    id text, shopify_id bigint, shopify_handle text, nombre text, descripcion_publica text,
    precio numeric, fotos_tienda text[], disponible boolean, condicion text,
    especificaciones jsonb, categoria text, codigo text, vendor text
  );

  select count(*) into v_blocked
  from _items i where exists (select 1 from public.dropi_blocklist b where b.shopify_id = i.shopify_id);

  -- En productos existentes se conservan los campos que administra el ERP:
  -- visible_tienda, categoria y condicion
  insert into public.productos_dropi (
    id, shopify_id, shopify_handle, nombre, descripcion_publica, precio, fotos_tienda,
    disponible, condicion, especificaciones, categoria, codigo, vendor, synced_at
  )
  select id, shopify_id, shopify_handle, nombre, descripcion_publica, precio, fotos_tienda,
         disponible, condicion, especificaciones, categoria, codigo, vendor, now()
  from _items i
  where not exists (select 1 from public.dropi_blocklist b where b.shopify_id = i.shopify_id)
  on conflict (id) do update set
    shopify_handle      = excluded.shopify_handle,
    nombre              = excluded.nombre,
    descripcion_publica = excluded.descripcion_publica,
    precio              = excluded.precio,
    fotos_tienda        = excluded.fotos_tienda,
    disponible          = excluded.disponible,
    especificaciones    = excluded.especificaciones,
    codigo              = excluded.codigo,
    vendor              = excluded.vendor,
    synced_at           = excluded.synced_at;
  get diagnostics v_synced = row_count;

  -- Productos que ya no están en Shopify → no disponibles (la tienda los oculta)
  update public.productos_dropi p
  set disponible = false, synced_at = now()
  where p.disponible and not exists (select 1 from _items i where i.shopify_id = p.shopify_id);
  get diagnostics v_retirados = row_count;

  return jsonb_build_object('synced', v_synced, 'blocked', v_blocked, 'retirados', v_retirados);
end;
$$;

revoke all on function public.sync_productos_dropi(text, jsonb) from public;
grant execute on function public.sync_productos_dropi(text, jsonb) to anon, authenticated;
