-- Migration: cerrar accesos públicos
-- Ejecutar en el proyecto Supabase: mixtsrczbovsyumrofso (DESPUÉS de 01 y del deploy de la tienda)
--
-- El ERP no se ve afectado: su Edge Function usa conexión directa (postgres) y service role,
-- que no pasan por RLS.

-- 1. Cotizaciones: la tienda solo inserta. Con esta política cualquiera con la anon key
--    podía leer nombre, WhatsApp y email de todos los clientes.
drop policy if exists anon_select_cotizacion on public.cotizaciones_web;
