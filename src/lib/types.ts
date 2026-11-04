export interface Product {
  id: string;
  nombre: string;
  descripcion_publica: string | null;
  precio: number;
  fotos_tienda: string[];
  condicion: 'nuevo' | 'segunda' | 'reacondicionado';
  especificaciones: Record<string, string>;
  categoria: string;
  stock: number;
  codigo: string | null;
  es_servicio: boolean;
  /** Precio previo a la última baja y % de baja vigente (solo productos del ERP). null = sin baja. */
  precio_anterior?: number | null;
  baja_pct?: number | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
