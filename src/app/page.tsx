export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";

const MOCK_PRODUCTS = [
  { id:"1", nombre:"Laptop HP ProBook 450 G8", descripcion_publica:"Intel Core i5 11va gen", precio:520, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{RAM:"8GB",CPU:"i5-11",Disco:"SSD 256GB"}, categoria:"Laptops", stock:2, codigo:"LAP-001", es_servicio: false },
  { id:"2", nombre:"Dell Latitude 5510 Core i7", descripcion_publica:"Empresarial Full HD", precio:680, fotos_tienda:[], condicion:"reacondicionado" as const, especificaciones:{RAM:"16GB",CPU:"i7-10",Disco:"SSD 512GB"}, categoria:"Laptops", stock:1, codigo:"LAP-002", es_servicio: false },
  { id:"3", nombre:"PC Lenovo ThinkCentre M720", descripcion_publica:"Escritorio empresarial", precio:380, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{RAM:"8GB",CPU:"i5-8",Disco:"HDD 500GB"}, categoria:"PCs", stock:3, codigo:"PC-001", es_servicio: false },
  { id:"4", nombre:"Impresora Epson L3150 WiFi", descripcion_publica:"Sistema tanque, multifunción", precio:195, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{Tipo:"Multifunción",WiFi:"Sí"}, categoria:"Impresoras", stock:2, codigo:"IMP-001", es_servicio: false },
  { id:"5", nombre:"Laptop Asus VivoBook 15", descripcion_publica:"Ryzen 5, ideal estudiantes", precio:440, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{RAM:"8GB",CPU:"Ryzen 5",Disco:"SSD 256GB"}, categoria:"Laptops", stock:1, codigo:"LAP-003", es_servicio: false },
  { id:"6", nombre:'Monitor Samsung 24" Full HD', descripcion_publica:"Panel IPS, bordes delgados", precio:155, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{Tamaño:'24"',Panel:"IPS"}, categoria:"Monitores", stock:4, codigo:"MON-001", es_servicio: false },
  { id:"7", nombre:"HP EliteBook 840 G6", descripcion_publica:"Ultrabook empresarial Core i7", precio:750, fotos_tienda:[], condicion:"reacondicionado" as const, especificaciones:{RAM:"16GB",CPU:"i7-8",Disco:"SSD 512GB"}, categoria:"Laptops", stock:1, codigo:"LAP-004", es_servicio: false },
  { id:"8", nombre:"Impresora HP LaserJet M15a", descripcion_publica:"Láser monocromática compacta", precio:145, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{Tipo:"Láser",Color:"Mono"}, categoria:"Impresoras", stock:3, codigo:"IMP-002", es_servicio: false },
];

const CAT_CARDS = [
  { id:"laptop",    label:"Laptops",         desc:"Portátiles empresariales",   icon:"💻" },
  { id:"pc",        label:"PCs Escritorio",  desc:"Equipos de escritorio",      icon:"🖥️" },
  { id:"impresora", label:"Impresoras",      desc:"Láser, tinta y multifunción",icon:"🖨️" },
  { id:"monitor",   label:"Monitores",       desc:"Full HD e IPS de calidad",   icon:"🖵"  },
  { id:"Zona Tech", label:"Zona Tech",       desc:"Importados y novedades",     icon:"📦" },
  { id:"servicio",  label:"Servicios",       desc:"Software y soporte técnico", icon:"⚡" },
];

export default async function Home() {
  let products: any[] = [];
  try { products = await getProducts(); } catch {}
  const display = products.length > 0 ? products.slice(0, 8) : MOCK_PRODUCTS;

  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent("Hola, quiero consultar sobre los equipos disponibles")}`;

  return (
    <>
      <main style={{ paddingTop: 64 }}>

        {/* ── SECCIÓN 1: HERO EDITORIAL ── */}
        <section className="hero-section">
          <div className="hero-container">
            <p className="hero-eyebrow">ByteX Store · Ecuador</p>
            <h1 className="hero-h1">
              Tecnología revisada<br />e importada directo para ti.
            </h1>
            <p className="hero-sub">
              Laptops, PCs e impresoras de segunda mano con garantía — y productos nuevos importados en nuestra <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>Zona Tech</strong>.
            </p>
            <div className="hero-ctas">
              <Link href="/catalogo" className="btn-primary hero-cta-primary">
                Ver catálogo <ArrowRight size={15} />
              </Link>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost hero-cta-ghost">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 2: CATEGORÍAS ── */}
        <section className="section-cats">
          <div className="section-container">
            <h2 className="section-title">Navega por categoría</h2>
            <div className="cat-grid">
              {CAT_CARDS.map(cat => (
                <Link key={cat.id} href={`/catalogo?cat=${cat.id}`} className="cat-card">
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                  <span className="cat-desc">{cat.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 4: PRODUCTOS DESTACADOS ── */}
        <section className="section-products">
          <div className="section-container">
            <div className="section-header">
              <div>
                <h2 className="section-title" style={{ marginBottom: 2 }}>Equipos disponibles</h2>
                <p className="section-count">{display.length} equipos en catálogo</p>
              </div>
              <Link href="/catalogo" className="section-link">
                Ver todo <ArrowRight size={14} />
              </Link>
            </div>
            <div className="products-grid">
              {display.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 5: CTA FINAL ── */}
        <section className="cta-section">
          <div className="cta-inner">
            <div>
              <h2 className="cta-title">¿No encuentras lo que necesitas?</h2>
              <p className="cta-sub">Escríbenos y conseguimos el equipo ideal para ti.</p>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost cta-wa-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </section>

      </main>

      {/* WhatsApp FAB */}
      <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer" className="whatsapp-fab">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <Footer />

      <style>{`
        /* ── HERO — siempre oscuro como navbar/footer ── */
        .hero-section {
          background: rgba(15, 15, 18, 0.98);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 90px 24px 80px;
        }
        .hero-container {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }
        .hero-eyebrow {
          font-size: 12px;
          font-weight: 600;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 24px;
        }
        .hero-h1 {
          font-size: clamp(36px, 5.5vw, 58px);
          font-weight: 700;
          font-family: var(--font-display);
          letter-spacing: -0.03em;
          line-height: 1.12;
          color: #ffffff;
          margin-bottom: 22px;
        }
        .hero-sub {
          font-size: 18px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.55);
          line-height: 1.65;
          max-width: 520px;
          margin: 0 auto 40px;
        }
        .hero-ctas {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-cta-primary {
          font-size: 15px !important;
          padding: 11px 24px !important;
        }
        .hero-cta-ghost {
          font-size: 14px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(255,255,255,0.18) !important;
          color: rgba(255,255,255,0.8) !important;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          text-decoration: none;
          font-family: var(--font-ui);
          font-weight: 500;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .hero-cta-ghost:hover {
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(255,255,255,0.28) !important;
          color: #ffffff !important;
        }

        /* ── SECTIONS COMUNES ── */
        .section-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .section-title {
          font-size: 26px;
          font-weight: 600;
          font-family: var(--font-display);
          color: var(--text);
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
        }
        .section-count {
          font-size: 14px;
          font-family: var(--font-ui);
          color: var(--text-3);
          margin-top: 4px;
        }
        .section-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-ui);
          color: var(--accent);
          text-decoration: none;
          white-space: nowrap;
          transition: gap 0.15s;
        }
        .section-link:hover { gap: 8px; }

        /* ── CATEGORÍAS — usa variables de tema ── */
        .section-cats {
          padding: clamp(52px, 6vw, 76px) 0;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .cat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cat-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        .cat-icon {
          font-size: 34px;
          line-height: 1;
          margin-bottom: 6px;
        }
        .cat-label {
          font-size: 16px;
          font-weight: 600;
          font-family: var(--font-display);
          color: var(--text);
        }
        .cat-desc {
          font-size: 13px;
          font-family: var(--font-ui);
          color: var(--text-3);
          line-height: 1.45;
        }

        /* ── PRODUCTOS ── */
        .section-products {
          padding: clamp(52px, 6vw, 76px) 0;
          background: var(--bg-alt);
          border-bottom: 1px solid var(--border);
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        /* ── CTA — siempre oscuro como footer ── */
        .cta-section {
          background: rgba(15, 15, 18, 0.98);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: clamp(44px, 5vw, 60px) 24px;
        }
        .cta-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .cta-title {
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 600;
          font-family: var(--font-display);
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .cta-sub {
          font-size: 15px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.5);
        }
        .cta-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          background: rgba(37,211,102,0.12);
          border: 1px solid rgba(37,211,102,0.30);
          border-radius: 6px;
          color: #25D366;
          font-size: 15px;
          font-weight: 500;
          font-family: var(--font-ui);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .cta-wa-btn:hover { background: rgba(37,211,102,0.20); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .hero-section { padding: 64px 16px 60px; }
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .cta-inner { flex-direction: column; align-items: flex-start; }
          .section-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
