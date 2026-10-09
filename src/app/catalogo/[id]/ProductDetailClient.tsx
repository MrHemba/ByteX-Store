"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart, MessageCircle, CheckCircle, Package, X,
  ChevronLeft, ChevronRight, Home, Share2, Copy, Check,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

const CONDITION_MAP: Record<string, { label: string; cls: string; dot: string }> = {
  nuevo:           { label: "Nuevo",           cls: "badge badge-nuevo",           dot: "#12B76A" },
  segunda:         { label: "Segunda Vida",    cls: "badge badge-segunda",         dot: "var(--text-4)" },
  reacondicionado: { label: "Reacondicionado", cls: "badge badge-reacondicionado", dot: "#F79009" },
};

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450'%3E%3Crect fill='%23F2F4F7' width='600' height='450'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter' font-size='16' fill='%2398A2B3'%3ESin imagen%3C/text%3E%3C/svg%3E`;

type Tab = "descripcion" | "especificaciones";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded]           = useState(false);
  const [copied, setCopied]         = useState(false);
  const [activeImg, setActiveImg]   = useState(0);
  const [lightbox, setLightbox]     = useState(false);
  const [activeTab, setActiveTab]   = useState<Tab>("descripcion");
  const [slideDir, setSlideDir]     = useState<"left" | "right" | null>(null);
  const [imgKey, setImgKey]         = useState(0);

  const images    = product.fotos_tienda?.length > 0 ? product.fotos_tienda : [PLACEHOLDER];
  const condition = CONDITION_MAP[product.condicion] ?? CONDITION_MAP.segunda;
  const isAvail    = product.es_servicio || product.stock > 0;
  const dropiStock = product.stock === 99; // centinela — Dropi no reporta cantidad real
  const specs     = Object.entries(product.especificaciones || {});

  const handleAdd = () => {
    if (!isAvail) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openLightbox  = () => { if (!images[activeImg].startsWith("data:")) setLightbox(true); };
  const closeLightbox = useCallback(() => setLightbox(false), []);

  const prevImg = useCallback(() => {
    setSlideDir("right"); setImgKey(k => k + 1);
    setActiveImg(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImg = useCallback(() => {
    setSlideDir("left"); setImgKey(k => k + 1);
    setActiveImg(i => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     closeLightbox();
      if (e.key === "ArrowLeft")  prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightbox, closeLightbox, prevImg, nextImg]);

  const waMsg = encodeURIComponent(
    `Hola ByteX Store! 👋\nMe interesa este equipo:\n*${product.nombre}*\nPrecio: $${product.precio}\n\n¿Está disponible?`
  );
  const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${waMsg}`;

  const hasDesc  = !!product.descripcion_publica;
  const hasSpecs = specs.length > 0;

  return (
    <div className="pd-root">

      {/* ── BREADCRUMB ── */}
      <div className="pd-breadcrumb">
        <Link href="/" className="pd-bc-link"><Home size={13} /></Link>
        <span className="pd-bc-sep">/</span>
        <Link href="/catalogo" className="pd-bc-link">Catálogo</Link>
        <span className="pd-bc-sep">/</span>
        {product.categoria && (
          <>
            <Link href={`/catalogo?cat=${encodeURIComponent(product.categoria)}`} className="pd-bc-link">
              {product.categoria}
            </Link>
            <span className="pd-bc-sep">/</span>
          </>
        )}
        <span className="pd-bc-current">{product.nombre}</span>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="pd-grid">

        {/* ── LEFT: GALLERY ── */}
        <div className="pd-gallery">

          {/* Main image */}
          <div className="pd-main-img-wrap" onClick={openLightbox}
            style={{ cursor: images[activeImg].startsWith("data:") ? "default" : "zoom-in" }}>
            <Image
              src={images[activeImg]} alt={product.nombre} fill priority
              sizes="(max-width:768px) 100vw, 50vw"
              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              unoptimized={images[activeImg].startsWith("data:")}
            />
            {/* Condition badge */}
            <div className="pd-img-badge">
              <span className={condition.cls}>{condition.label}</span>
            </div>
            {/* Nav arrows (appear on hover) */}
            {images.length > 1 && (
              <>
                <button className="pd-img-arrow pd-img-arrow-l" onClick={e => { e.stopPropagation(); prevImg(); }}>
                  <ChevronLeft size={18} />
                </button>
                <button className="pd-img-arrow pd-img-arrow-r" onClick={e => { e.stopPropagation(); nextImg(); }}>
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            {/* Counter */}
            {images.length > 1 && (
              <div className="pd-img-counter">{activeImg + 1} / {images.length}</div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`pd-thumb${activeImg === i ? " active" : ""}`}>
                  <Image src={img} alt={`foto ${i + 1}`} fill
                    style={{ objectFit: "cover" }}
                    unoptimized={img.startsWith("data:")} sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: INFO ── */}
        <div className="pd-info">

          {/* Reference */}
          {product.codigo && (
            <div className="pd-ref">ID: {product.codigo}</div>
          )}

          {/* Name */}
          <h1 className="pd-name">{product.nombre}</h1>

          {/* Category + condition pills */}
          <div className="pd-pills">
            {product.categoria && (
              <Link href={`/catalogo?cat=${encodeURIComponent(product.categoria)}`}
                className="pd-pill pd-pill-cat">{product.categoria}</Link>
            )}
            <span className={condition.cls}>{condition.label}</span>
          </div>

          {/* Divider */}
          <div className="pd-divider" />

          {/* Price block */}
          <div className="pd-price-block">
            <div className="pd-price-col">
              <span className="pd-price-label">Precio</span>
              {product.precio > 0 ? (
                <span className="price-tag pd-price-val">
                  ${product.precio.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                </span>
              ) : (
                <span className="pd-price-consult">Consultar</span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="pd-stock-col">
              <span className="pd-price-label">Disponibilidad</span>
              {isAvail ? (
                <div className="pd-stock-avail">
                  <span className="pd-stock-dot on" />
                  {product.es_servicio
                    ? "Disponible"
                    : dropiStock
                      ? "Disponible"
                      : product.stock <= 3
                        ? `¡Solo ${product.stock} unidad${product.stock > 1 ? "es" : ""}!`
                        : "En stock"}
                </div>
              ) : (
                <div className="pd-stock-avail">
                  <span className="pd-stock-dot off" />
                  Agotado
                </div>
              )}
            </div>
          </div>

          {!isAvail && (
            <p className="pd-agotado-note">
              <Package size={12} /> Consúltanos y te avisamos cuando esté disponible
            </p>
          )}
          {!product.es_servicio && isAvail && product.stock <= 3 && !dropiStock && (
            <p className="pd-low-stock">
              <Package size={12} /> ¡Quedan pocas unidades — asegura la tuya!
            </p>
          )}

          {/* Divider */}
          <div className="pd-divider" />

          {/* CTA buttons */}
          <div className="pd-ctas">
            <button onClick={handleAdd} disabled={!isAvail}
              className={`btn-primary pd-btn-main${added ? " btn-added" : ""}`}>
              {added
                ? <><CheckCircle size={16} /> Agregado a cotización</>
                : <><ShoppingCart size={16} /> {isAvail ? "Agregar a cotización" : "Agotado"}</>
              }
            </button>

            <div className="pd-ctas-row2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="pd-wa-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>

              <button onClick={handleCopy} className="pd-share-btn" title="Copiar enlace">
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
              <button className="pd-share-btn" title="Compartir"
                onClick={() => navigator.share?.({ title: product.nombre, url: window.location.href })}>
                <Share2 size={15} />
              </button>
            </div>
          </div>

          {/* Trust row */}
          <div className="pd-trust">
            <div className="pd-trust-item">
              <span className="pd-trust-icon">✅</span>
              <span>Revisado y probado</span>
            </div>
            <div className="pd-trust-item">
              <span className="pd-trust-icon">📦</span>
              <span>Envío coordinado</span>
            </div>
            <div className="pd-trust-item">
              <span className="pd-trust-icon">💬</span>
              <span>Soporte post-venta</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS SECTION ── */}
      {(hasDesc || hasSpecs) && (
        <div className="pd-tabs-section">

          {/* Tab headers */}
          <div className="pd-tabs-header">
            {hasDesc && (
              <button
                onClick={() => setActiveTab("descripcion")}
                className={`pd-tab${activeTab === "descripcion" ? " active" : ""}`}
              >
                Descripción
              </button>
            )}
            {hasSpecs && (
              <button
                onClick={() => setActiveTab("especificaciones")}
                className={`pd-tab${activeTab === "especificaciones" ? " active" : ""}`}
              >
                Especificaciones
              </button>
            )}
          </div>

          {/* Tab content */}
          <div className="pd-tab-content">

            {activeTab === "descripcion" && hasDesc && (
              <div className="pd-desc-body">
                {product.descripcion_publica!.split(/\n+/).filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {activeTab === "especificaciones" && hasSpecs && (
              <div className="pd-specs-table">
                {specs.map(([key, val], i) => (
                  <div key={key} className={`pd-spec-row${i % 2 === 0 ? " even" : ""}`}>
                    <span className="pd-spec-key">{key}</span>
                    <span className="pd-spec-val">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lb-backdrop" onClick={closeLightbox}>

          <div key={imgKey} onClick={e => e.stopPropagation()}
            className={`lb-img-wrap ${slideDir === "left" ? "slide-from-right" : slideDir === "right" ? "slide-from-left" : "lb-enter"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[activeImg]} alt={product.nombre} className="lb-img" />
          </div>

          <button className="lb-btn lb-close" onClick={closeLightbox}><X size={17} /></button>

          {images.length > 1 && (
            <>
              <button className="lb-btn lb-nav lb-nav-l" onClick={e => { e.stopPropagation(); prevImg(); }}>
                <ChevronLeft size={24} />
              </button>
              <button className="lb-btn lb-nav lb-nav-r" onClick={e => { e.stopPropagation(); nextImg(); }}>
                <ChevronRight size={24} />
              </button>
              <div className="lb-dots">
                {images.map((_, i) => (
                  <button key={i} className={`lb-dot${i === activeImg ? " active" : ""}`}
                    onClick={e => { e.stopPropagation(); setSlideDir(i > activeImg ? "left" : "right"); setImgKey(k => k + 1); setActiveImg(i); }} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        /* ── ROOT ── */
        .pd-root {
          max-width: 1200px;
          margin: 0 auto;
          padding: 36px 24px 80px;
        }

        /* ── BREADCRUMB ── */
        .pd-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-2);
          margin-bottom: 28px;
          flex-wrap: wrap;
          font-family: var(--font-ui);
        }
        .pd-bc-link {
          color: var(--text-2);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 3px;
          transition: color 0.15s;
          font-weight: 500;
        }
        .pd-bc-link:hover { color: var(--accent); }
        .pd-bc-sep { color: var(--text-3); }
        .pd-bc-current {
          color: var(--text);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 240px;
        }

        /* ── GRID ── */
        .pd-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
          margin-bottom: 48px;
        }

        /* ── GALLERY ── */
        .pd-gallery {}
        .pd-main-img-wrap {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 6px;
          overflow: hidden;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          margin-bottom: 12px;
        }
        .pd-img-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
        }
        .pd-img-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 20px;
          font-family: var(--font-mono);
        }
        .pd-img-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s, background 0.15s;
        }
        .pd-main-img-wrap:hover .pd-img-arrow { opacity: 1; }
        .pd-img-arrow:hover { background: rgba(0,0,0,0.7) !important; }
        .pd-img-arrow-l { left: 10px; }
        .pd-img-arrow-r { right: 10px; }

        .pd-thumbs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pd-thumb {
          position: relative;
          width: 76px;
          height: 58px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--bg-alt);
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
          transition: border-color 0.15s, transform 0.15s;
        }
        .pd-thumb:hover { transform: translateY(-2px); }
        .pd-thumb.active {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent-dim);
        }

        /* ── INFO ── */
        .pd-info { display: flex; flex-direction: column; gap: 0; }
        .pd-ref {
          font-size: 12px;
          font-family: var(--font-mono);
          color: var(--accent);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
          padding: 4px 10px;
          background: var(--accent-dim);
          border: 1px solid var(--accent);
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }
        .pd-name {
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 700;
          font-family: var(--font-display);
          line-height: 1.2;
          color: var(--text);
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        .pd-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .pd-pill-cat {
          font-size: 13px;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: 20px;
          background: var(--bg-alt);
          border: 1px solid var(--border-strong);
          color: var(--text-2);
          text-decoration: none;
          transition: all 0.15s;
          font-family: var(--font-ui);
        }
        .pd-pill-cat:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }

        .pd-divider { height: 1px; background: var(--border); margin: 20px 0; }

        /* ── PRICE BLOCK ── */
        .pd-price-block {
          display: flex;
          gap: 0;
          align-items: stretch;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .pd-price-col, .pd-stock-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 20px;
        }
        .pd-price-col { background: var(--surface); }
        .pd-stock-col {
          background: var(--bg-alt);
          border-left: 1px solid var(--border);
        }
        .pd-price-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-2);
          font-family: var(--font-ui);
        }
        .pd-price-val { font-size: 34px !important; }
        .pd-price-consult {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-2);
          font-style: italic;
          font-family: var(--font-ui);
        }
        .pd-stock-avail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          font-family: var(--font-ui);
          margin-top: 2px;
        }
        .pd-stock-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .pd-stock-dot.on  { background: var(--success); box-shadow: 0 0 6px var(--success); }
        .pd-stock-dot.off { background: var(--error); }

        .pd-agotado-note, .pd-low-stock {
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 4px;
          font-family: var(--font-ui);
          font-weight: 500;
        }
        .pd-agotado-note { color: var(--text-2); background: var(--bg-alt); border: 1px solid var(--border); }
        .pd-low-stock    { color: var(--warning); background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.25); }

        /* ── CTAs ── */
        .pd-ctas { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .pd-btn-main {
          width: 100%;
          padding: 14px 20px !important;
          font-size: 15px !important;
          border-radius: 8px !important;
          transition: all 0.2s !important;
        }
        .pd-btn-main.btn-added {
          background: rgba(22,163,74,0.10) !important;
          color: var(--success) !important;
          border: 1.5px solid rgba(22,163,74,0.35) !important;
          box-shadow: none !important;
        }

        .pd-ctas-row2 {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }
        .pd-wa-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(37,211,102,0.10);
          border: 1.5px solid rgba(37,211,102,0.4);
          color: #16a34a;
          font-family: var(--font-ui);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        [data-theme="dark"] .pd-wa-btn { color: #25D366; }
        .pd-wa-btn:hover {
          background: rgba(37,211,102,0.18);
          border-color: #25D366;
        }
        .pd-share-btn {
          width: 46px;
          height: 46px;
          border-radius: 8px;
          background: var(--bg-alt);
          border: 1px solid var(--border-strong);
          color: var(--text-2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .pd-share-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }

        /* ── TRUST ── */
        .pd-trust {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
        .pd-trust-item {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          background: var(--bg-alt);
          border: 1px solid var(--border-strong);
          border-radius: 20px;
          font-size: 13px;
          color: var(--text-2);
          font-weight: 500;
          font-family: var(--font-ui);
        }
        .pd-trust-icon { font-size: 14px; }

        /* ── TABS ── */
        .pd-tabs-section {
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          background: var(--surface);
        }
        .pd-tabs-header {
          display: flex;
          border-bottom: 1px solid var(--border);
          background: var(--bg-alt);
        }
        .pd-tab {
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-ui);
          background: none;
          border: none;
          color: var(--text-2);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
          position: relative;
          bottom: -1px;
        }
        .pd-tab:hover { color: var(--text); }
        .pd-tab.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
          background: var(--surface);
        }
        .pd-tab-content { padding: 32px; }

        .pd-desc-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pd-desc-body p {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text);
          margin: 0;
          font-family: var(--font-ui);
        }

        .pd-specs-table { display: flex; flex-direction: column; gap: 0; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
        .pd-spec-row {
          display: flex;
          align-items: center;
          padding: 13px 18px;
          gap: 16px;
          border-bottom: 1px solid var(--border);
        }
        .pd-spec-row:last-child { border-bottom: none; }
        .pd-spec-row.even { background: var(--bg-alt); }
        .pd-spec-key {
          font-size: 14px;
          color: var(--text-2);
          font-family: var(--font-ui);
          font-weight: 600;
          min-width: 150px;
          flex-shrink: 0;
        }
        .pd-spec-val {
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          font-family: var(--font-ui);
        }

        /* ── LIGHTBOX ── */
        .lb-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(5,7,18,0.94);
          backdrop-filter: blur(14px);
          display: flex; align-items: center; justify-content: center;
          animation: lb-backdrop-in 0.22s ease;
        }
        .lb-img-wrap {
          position: relative;
          max-width: 90vw; max-height: 88vh;
          display: flex; align-items: center; justify-content: center;
        }
        .lb-img {
          display: block;
          max-width: 90vw; max-height: 88vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.7);
        }
        .lb-btn {
          position: fixed;
          width: 42px; height: 42px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          transition: all 0.18s;
        }
        .lb-btn:hover { background: rgba(255,255,255,0.18) !important; border-color: rgba(255,255,255,0.35) !important; transform: scale(1.08); }
        .lb-close { top: 18px; right: 18px; }
        .lb-nav-l { left: 16px; top: 50%; transform: translateY(-50%); }
        .lb-nav-r { right: 16px; top: 50%; transform: translateY(-50%); }
        .lb-nav-l:hover, .lb-nav-r:hover { transform: translateY(-50%) scale(1.08) !important; }
        .lb-dots {
          position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 7px; align-items: center;
        }
        .lb-dot {
          width: 8px; height: 8px; border-radius: 4px;
          background: rgba(255,255,255,0.25);
          border: none; cursor: pointer; padding: 0;
          transition: all 0.25s cubic-bezier(.4,0,.2,1);
        }
        .lb-dot.active { width: 22px; background: var(--accent); box-shadow: 0 0 8px var(--accent); }

        /* ── ANIMATIONS ── */
        @keyframes lb-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lb-scale-in { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
        @keyframes slide-from-right { from { opacity: 0; transform: translateX(60px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes slide-from-left  { from { opacity: 0; transform: translateX(-60px) scale(0.96); } to { opacity: 1; transform: none; } }
        .lb-enter          { animation: lb-scale-in      0.28s cubic-bezier(.2,.8,.3,1) both; }
        .slide-from-right  { animation: slide-from-right 0.28s cubic-bezier(.2,.8,.3,1) both; }
        .slide-from-left   { animation: slide-from-left  0.28s cubic-bezier(.2,.8,.3,1) both; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .pd-root { padding: 20px 16px 60px; }
          .pd-grid { grid-template-columns: 1fr; gap: 28px; }
          .pd-bc-current { max-width: 160px; }
          .pd-price-val { font-size: 28px !important; }
          .pd-tab { padding: 13px 20px; font-size: 14px; }
          .pd-tab-content { padding: 20px 16px; }
          .pd-spec-key { min-width: 120px; }
          .pd-ctas-row2 { flex-wrap: wrap; }
          .pd-wa-btn { min-width: 0; }
        }

        @media (max-width: 480px) {
          .pd-price-block { flex-direction: column; }
          .pd-stock-col { border-left: none; border-top: 1px solid var(--border); }
          .pd-trust { gap: 6px; }
          .pd-trust-item { font-size: 12px; padding: 6px 10px; }
        }
      `}</style>
    </div>
  );
}
