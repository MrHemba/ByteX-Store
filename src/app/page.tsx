// Se regenera cada minuto: los cambios del ERP tardan como máximo 60 s en verse
export const revalidate = 60;

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getProducts } from "@/lib/supabase";
import { CATEGORIES, matchesCategory } from "@/lib/categories";
import type { Product } from "@/lib/types";
import { ArrowRight, ChevronRight, ShieldCheck, BadgeCheck, Truck, MessageCircle } from "lucide-react";

const TRUST = [
  { icon: ShieldCheck,   label: "Equipos con garantía" },
  { icon: BadgeCheck,    label: "Revisados y probados" },
  { icon: Truck,         label: "Envíos a nivel nacional" },
  { icon: MessageCircle, label: "Soporte post-venta" },
];

const HERO_CATS = ["laptop", "pc", "impresora", "monitor", "Zona Tech"];

const hasPhoto = (p: Product) => p.fotos_tienda.length > 0 && (p.es_servicio || p.stock > 0);

/** Un producto con foto por categoría, para el hero */
function pickHero(products: Product[]): Product[] {
  return HERO_CATS
    .map(cat => products.find(p => hasPhoto(p) && matchesCategory(p.categoria, cat)))
    .filter((p): p is Product => !!p)
    .slice(0, 4);
}

/** Destacados alternando categorías, para que la portada no muestre 8 equipos casi iguales */
function pickFeatured(products: Product[], count: number): Product[] {
  const buckets = CATEGORIES.map(c => products.filter(p => hasPhoto(p) && matchesCategory(p.categoria, c.id)));
  const picked: Product[] = [];
  for (let round = 0; picked.length < count && buckets.some(b => b.length > round); round++) {
    for (const b of buckets) if (b[round] && picked.length < count) picked.push(b[round]);
  }
  for (const p of products) {
    if (picked.length >= count) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked;
}

const money = (n: number) => `$${n.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

export default async function Home() {
  let products: Product[] = [];
  try { products = await getProducts(); } catch {}
  const heroPicks = pickHero(products);
  const display   = pickFeatured(products, 8);
  const catCounts = CATEGORIES.map(c => products.filter(p => matchesCategory(p.categoria, c.id)).length);

  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent("Hola, quiero consultar sobre los equipos disponibles")}`;

  return (
    <>
      <main style={{ paddingTop: 64 }}>

        {/* ── HERO ── */}
        <section className="hero-section">
          <div className={`hero-container${heroPicks.length ? "" : " hero-container--solo"}`}>
            <div className="hero-copy">
              <h1 className="hero-h1">Tecnología revisada e importada directo para ti.</h1>
              <p className="hero-sub">
                Laptops, PCs e impresoras de segunda mano con garantía — y productos nuevos importados en nuestra <strong>Zona Tech</strong>.
              </p>
              <div className="hero-ctas">
                <Link href="/catalogo" className="btn-primary hero-cta-primary">
                  Ver catálogo <ArrowRight size={16} />
                </Link>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hero-cta-ghost">
                  <WhatsAppIcon size={15} />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

            {heroPicks.length > 0 && (
              <div className="hero-tiles">
                {heroPicks.map((p, i) => (
                  <Link key={p.id} href={`/catalogo/${p.id}`} className="hero-tile" style={{ animationDelay: `${120 + i * 70}ms` }}>
                    <div className="hero-tile-img">
                      <Image src={p.fotos_tienda[0]} alt={p.nombre} fill
                        sizes="(max-width: 900px) 45vw, 260px" style={{ objectFit: "contain" }}
                        priority={i < 2} />
                    </div>
                    <div className="hero-tile-meta">
                      <span className="hero-tile-name">{p.nombre}</span>
                      {p.precio > 0 && <span className="hero-tile-price">{money(p.precio)}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CONFIANZA ── */}
        <section className="trust-bar" aria-label="Por qué comprar en ByteX Store">
          <ul className="trust-list">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="trust-item">
                <Icon size={18} strokeWidth={1.75} className="trust-icon" />
                {label}
              </li>
            ))}
          </ul>
        </section>

        {/* ── CATEGORÍAS ── */}
        <section className="section-cats">
          <div className="section-container">
            <h2 className="section-title">Navega por categoría</h2>
            <div className="cat-grid">
              {CATEGORIES.map(({ id, label, desc, icon: Icon }, i) => (
                <Link key={id} href={`/catalogo?cat=${encodeURIComponent(id)}`} className="cat-card">
                  <span className="cat-icon"><Icon size={20} strokeWidth={1.75} /></span>
                  <span className="cat-text">
                    <span className="cat-label">{label}</span>
                    <span className="cat-desc">
                      {catCounts[i] > 0 ? `${catCounts[i]} ${id === "servicio" ? "servicio" : "equipo"}${catCounts[i] !== 1 ? "s" : ""}` : desc}
                    </span>
                  </span>
                  <ChevronRight size={16} className="cat-chevron" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTOS DESTACADOS ── */}
        <section className="section-products">
          <div className="section-container">
            <div className="section-header">
              <div>
                <h2 className="section-title" style={{ marginBottom: 2 }}>Equipos disponibles</h2>
                <p className="section-count">{products.length} equipo{products.length !== 1 ? "s" : ""} en catálogo</p>
              </div>
              <Link href="/catalogo" className="section-link">
                Ver todo <ArrowRight size={14} />
              </Link>
            </div>
            {display.length > 0 ? (
              <div className="products-grid">
                {display.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <p className="section-count" style={{ padding: "32px 0", textAlign: "center" }}>
                Estamos actualizando el catálogo. Escríbenos por WhatsApp y te ayudamos a encontrar tu equipo.
              </p>
            )}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="cta-section">
          <div className="cta-inner">
            <div>
              <h2 className="cta-title">¿No encuentras lo que necesitas?</h2>
              <p className="cta-sub">Escríbenos y conseguimos el equipo ideal para ti.</p>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="cta-wa-btn">
              <WhatsAppIcon size={16} />
              Consultar por WhatsApp
            </a>
          </div>
        </section>

      </main>

      <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer"
        className="whatsapp-fab" aria-label="Escríbenos por WhatsApp">
        <WhatsAppIcon size={24} color="white" />
      </a>

      <Footer />

      <style>{`
        /* ── HERO — siempre oscuro como navbar/footer ── */
        .hero-section {
          background: rgba(15, 15, 18, 0.98);
          padding: clamp(56px, 7vw, 88px) 24px clamp(56px, 7vw, 84px);
          overflow: hidden;
        }
        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
          gap: clamp(32px, 5vw, 72px);
          align-items: center;
        }
        .hero-container--solo { grid-template-columns: minmax(0, 720px); justify-content: center; }
        .hero-h1 {
          font-size: clamp(34px, 4.6vw, 56px);
          font-weight: 700;
          font-family: var(--font-display);
          letter-spacing: -0.03em;
          line-height: 1.08;
          color: #ffffff;
          margin-bottom: 20px;
          text-wrap: balance;
          max-width: 14ch;
        }
        .hero-sub {
          font-size: 17px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.66);
          line-height: 1.65;
          max-width: 46ch;
          margin-bottom: 36px;
          text-wrap: pretty;
        }
        .hero-sub strong { color: rgba(255,255,255,0.92); font-weight: 600; }
        .hero-ctas {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .hero-cta-primary {
          font-size: 15px !important;
          padding: 12px 22px !important;
          border-radius: 8px !important;
        }
        .hero-cta-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 500;
          font-family: var(--font-ui);
          padding: 11px 20px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.16);
          color: rgba(255,255,255,0.86);
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 160ms var(--ease-out), border-color 160ms var(--ease-out), transform 160ms var(--ease-out);
        }
        .hero-cta-ghost:active { transform: scale(0.97); }
        @media (hover: hover) and (pointer: fine) {
          .hero-cta-ghost:hover { background: rgba(255,255,255,0.11); border-color: rgba(255,255,255,0.28); color: #fff; }
        }

        /* Fotos reales del catálogo */
        .hero-tiles {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .hero-tile {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 32px rgba(0,0,0,0.35);
          animation: heroTileIn 520ms var(--ease-out) both;
          transition: transform 220ms var(--ease-out), box-shadow 220ms var(--ease-out);
        }
        .hero-tile:nth-child(even) { transform: translateY(18px); }
        @keyframes heroTileIn {
          from { opacity: 0; translate: 0 14px; filter: blur(4px); }
          to   { opacity: 1; translate: 0 0;    filter: blur(0); }
        }
        @media (hover: hover) and (pointer: fine) {
          .hero-tile:hover { box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px rgba(0,0,0,0.45); translate: 0 -3px; }
        }
        .hero-tile-img {
          position: relative;
          aspect-ratio: 4 / 3;
          margin: 14px 14px 0;
        }
        .hero-tile-meta {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 14px 12px;
        }
        .hero-tile-name {
          font-size: 12.5px;
          font-family: var(--font-ui);
          font-weight: 500;
          color: #3F3F46;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hero-tile-price {
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-display);
          color: #18181B;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }

        /* ── CONFIANZA ── */
        .trust-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .trust-list {
          list-style: none;
          max-width: 1280px;
          margin: 0 auto;
          padding: 18px 24px;
          display: grid;
          grid-template-columns: repeat(4, auto);
          justify-content: space-between;
          gap: 12px 24px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-ui);
          color: var(--text-2);
        }
        .trust-icon { color: var(--accent); flex-shrink: 0; }

        /* ── SECCIONES COMUNES ── */
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
          margin-bottom: 20px;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 22px;
          gap: 16px;
        }
        .section-count {
          font-size: 14px;
          font-family: var(--font-ui);
          color: var(--text-2);
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
          padding: 6px 0;
        }
        .section-link svg { transition: transform 200ms var(--ease-out); }
        @media (hover: hover) and (pointer: fine) {
          .section-link:hover svg { transform: translateX(3px); }
        }

        /* ── CATEGORÍAS ── */
        .section-cats {
          padding: clamp(48px, 6vw, 72px) 0;
          background: var(--bg);
        }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .cat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px 16px 16px 14px;
          text-decoration: none;
          transition: border-color 200ms var(--ease-out), box-shadow 200ms var(--ease-out), transform 160ms var(--ease-out);
        }
        .cat-card:active { transform: scale(0.98); }
        .cat-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: var(--accent-dim);
          color: var(--accent);
          flex-shrink: 0;
        }
        .cat-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
        .cat-label {
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-display);
          color: var(--text);
        }
        .cat-desc {
          font-size: 13px;
          font-family: var(--font-ui);
          color: var(--text-2);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cat-chevron { color: var(--text-3); flex-shrink: 0; transition: transform 200ms var(--ease-out), color 200ms var(--ease-out); }
        @media (hover: hover) and (pointer: fine) {
          .cat-card:hover { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
          .cat-card:hover .cat-chevron { transform: translateX(3px); color: var(--accent); }
        }

        /* ── PRODUCTOS ── */
        .section-products {
          padding: clamp(48px, 6vw, 72px) 0;
          background: var(--bg-alt);
          border-top: 1px solid var(--border);
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        /* ── CTA — siempre oscuro como footer ── */
        .cta-section {
          background: rgba(15, 15, 18, 0.98);
          padding: clamp(44px, 5vw, 60px) 24px;
        }
        .cta-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px 32px;
          flex-wrap: wrap;
        }
        .cta-title {
          font-size: clamp(22px, 2.5vw, 28px);
          font-weight: 600;
          font-family: var(--font-display);
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .cta-sub {
          font-size: 15px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.62);
        }
        .cta-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: #25D366;
          border-radius: 8px;
          color: #0B3D1F;
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-ui);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background-color 160ms var(--ease-out), transform 160ms var(--ease-out);
        }
        .cta-wa-btn:active { transform: scale(0.97); }
        @media (hover: hover) and (pointer: fine) {
          .cta-wa-btn:hover { background: #2EE372; }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .products-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 900px) {
          .hero-container { grid-template-columns: minmax(0, 1fr); }
          .hero-h1 { max-width: 16ch; }
          /* Tira deslizable de fotos bajo el texto */
          .hero-tiles {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-padding-inline: 16px;
            margin: 0 -16px;
            padding: 4px 16px 8px;
            scrollbar-width: none;
          }
          .hero-tiles::-webkit-scrollbar { display: none; }
          .hero-tile { flex: 0 0 min(46%, 220px); scroll-snap-align: start; }
          .hero-tile:nth-child(even) { transform: none; }
          .trust-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          .hero-section { padding-left: 16px; padding-right: 16px; }
          .hero-sub { font-size: 16px; margin-bottom: 28px; }
          .hero-tile-meta { flex-direction: column; align-items: flex-start; gap: 2px; padding: 8px 12px 12px; }
          .hero-tile-name { max-width: 100%; }
          .hero-tile-img { margin: 10px 10px 0; }
          /* La sección ya trae 16px laterales (globals.css) */
          .section-container { padding: 0; }
          .trust-list { padding: 14px 0; }
          .trust-item { font-size: 13px; gap: 8px; }
          .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .cta-inner { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .hero-ctas > * { flex: 1 1 100%; justify-content: center; }
          .cat-grid { gap: 8px; }
          .cat-card { flex-direction: column; align-items: flex-start; gap: 10px; padding: 14px; }
          .cat-icon { width: 36px; height: 36px; }
          .cat-chevron { display: none; }
          .section-title { font-size: 22px; }
        }
      `}</style>
    </>
  );
}
