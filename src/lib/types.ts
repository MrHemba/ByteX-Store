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
}

export interface CartItem {
  product: Product;
  quantity: number;
}
