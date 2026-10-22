import { Laptop, Monitor, Printer, Cpu, Package, Wrench, type LucideIcon } from 'lucide-react';

/**
 * Categorías de la tienda. `id` es lo que va en ?cat= y se compara con
 * `categoria` del producto (includes, sin mayúsculas): "pc" ⊂ "PC", "laptop" ⊂ "Laptop".
 */
export const CATEGORIES: { id: string; label: string; desc: string; icon: LucideIcon }[] = [
  { id: 'laptop',    label: 'Laptops',        desc: 'Portátiles empresariales',    icon: Laptop },
  { id: 'pc',        label: 'PCs Escritorio', desc: 'Equipos de escritorio',       icon: Cpu },
  { id: 'impresora', label: 'Impresoras',     desc: 'Láser, tinta y multifunción', icon: Printer },
  { id: 'monitor',   label: 'Monitores',      desc: 'Full HD e IPS de calidad',    icon: Monitor },
  { id: 'Zona Tech', label: 'Zona Tech',      desc: 'Importados y novedades',      icon: Package },
  { id: 'servicio',  label: 'Servicios',      desc: 'Software y soporte técnico',  icon: Wrench },
];

export function matchesCategory(categoria: string | null | undefined, id: string): boolean {
  return !!categoria && categoria.toLowerCase().includes(id.toLowerCase());
}
