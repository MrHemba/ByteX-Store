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
}

export interface CartItem {
  product: Product;
  quantity: number;
}
