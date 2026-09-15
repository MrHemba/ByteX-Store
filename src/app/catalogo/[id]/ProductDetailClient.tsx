"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, ArrowLeft, MessageCircle, CheckCircle, Package, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

const CONDITION_LABELS: Record<string, { label: string; className: string }> = {
  nuevo:           { label: "Nuevo",           className: "badge badge-nuevo" },
  segunda:         { label: "Segunda Vida",    className: "badge badge-segunda" },
  reacondicionado: { label: "Reacondicionado", className: "badge badge-reacondicionado" },
};

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450'%3E%3Crect fill='%231A2035' width='600' height='450'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='16' fill='%23ffffff20'%3ESin imagen%3C/text%3E%3C/svg%3E`;

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded]       = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox]  = useState(false);

  const images    = product.fotos_tienda?.length > 0 ? product.fotos_tienda : [PLACEHOLDER];
  const condition = CONDITION_LABELS[product.condicion] ?? CONDITION_LABELS.segunda;
  const isAvailable = product.stock > 0;
  const specs     = Object.entries(product.especificaciones || {});

  const handleAdd = () => {
    if (!isAvailable) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [imgKey,   setImgKey]   = useState(0);

  const openLightbox  = () => { if (!images[activeImg].startsWith("data:")) setLightbox(true); };
  const closeLightbox = useCallback(() => setLightbox(false), []);

  const prevImg = useCallback(() => {
    setSlideDir("right");
    setImgKey(k => k + 1);
    setActiveImg(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImg = useCallback(() => {
    setSlideDir("left");
    setImgKey(k => k + 1);
    setActiveImg(i => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     closeLightbox();
      if (e.key === "ArrowLeft")  prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, prevImg, nextImg]);

  const waMsg = encodeURIComponent(
    `Hola ByteX Store! 👋\nMe interesa este equipo:\n*${product.nombre}*\nPrecio: $${product.precio}\n\n¿Está disponible?`
  );
  const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${waMsg}`;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32,
        fontSize: 13, color: "var(--text-3)" }}>
        <Link href="/catalogo" style={{ textDecoration: "none", color: "var(--text-3)",
          display: "flex", alignItems: "center", gap: 4,
          transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
        >
          <ArrowLeft size={14} /> Catálogo
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>{product.nombre}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "start" }}
        className="product-detail-grid">

        {/* ── Images ── */}
        <div>
          <div
            onClick={openLightbox}
            style={{
              position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden",
              background: "var(--bg-elevated)", border: "1px solid var(--border-solid)", marginBottom: 10,
              cursor: images[activeImg].startsWith("data:") ? "default" : "zoom-in",
            }}
          >
            <Image src={images[activeImg]} alt={product.nombre} fill priority
              style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
              unoptimized={images[activeImg].startsWith("data:")}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div style={{ position: "absolute", top: 14, left: 14 }}>
              <span className={condition.className}>{condition.label}</span>
            </div>
          </div>

          {images.length > 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  width: 72, height: 54, borderRadius: 8, overflow: "hidden",
                  border: activeImg === i ? "2px solid var(--accent)" : "1px solid var(--border-solid)",
                  padding: 0, cursor: "pointer", position: "relative",
                  background: "var(--bg-elevated)",
                }}>
                  <Image src={img} alt={`foto ${i + 1}`} fill
                    style={{ objectFit: "cover" }} unoptimized={img.startsWith("data:")} sizes="72px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div>
          {product.codigo && (
            <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)",
              marginBottom: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              REF: {product.codigo}
            </div>
          )}

          <h1 style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
            {product.nombre}
          </h1>

          {product.categoria && (
            <span style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase",
              letterSpacing: "0.08em", fontWeight: 600 }}>{product.categoria}</span>
          )}

          {/* Price */}
          <div style={{ margin: "20px 0" }}>
            {product.precio > 0 ? (
              <span className="price-tag" style={{ fontSize: 38 }}>
                ${product.precio.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span style={{ fontSize: 24, fontWeight: 700, color: "var(--text-3)", fontStyle: "italic" }}>
                Consultar precio
              </span>
            )}
            {isAvailable && product.stock <= 3 && (
              <div style={{ fontSize: 12, color: "var(--warning)", display: "flex",
                alignItems: "center", gap: 5, marginTop: 6 }}>
                <Package size={12} />
                ¡Solo {product.stock} unidad{product.stock > 1 ? "es" : ""} disponible{product.stock > 1 ? "s" : ""}!
              </div>
            )}
            {!isAvailable && (
              <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 6 }}>
                Agotado — Consúltanos por disponibilidad
              </div>
            )}
          </div>

          {/* Description */}
          {product.descripcion_publica && (
            <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.8, marginBottom: 24 }}>
              {product.descripcion_publica}
            </p>
          )}

          {/* Specs */}
          {specs.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)",
                letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                Especificaciones
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {specs.map(([key, val]) => (
                  <div key={key} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 14px", background: "var(--bg-elevated)", borderRadius: 8,
                    border: "1px solid var(--border-solid)",
                  }}>
                    <span style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>{key}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={handleAdd} disabled={!isAvailable} className="btn-primary"
              style={{ width: "100%", background: added ? "rgba(0,214,143,0.15)" : undefined,
                color: added ? "#00D68F" : undefined,
                border: added ? "1px solid rgba(0,214,143,0.4)" : undefined }}>
              {added ? (
                <><CheckCircle size={16} /> Agregado a cotización</>
              ) : (
                <><ShoppingCart size={16} /> {isAvailable ? "Agregar a cotización" : "Sin stock"}</>
              )}
            </button>

            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn-ghost" style={{ width: "100%", display: "flex",
                alignItems: "center", justifyContent: "center", gap: 8 }}>
                <MessageCircle size={15} style={{ color: "#25D366" }} />
                Consultar por WhatsApp
              </button>
            </a>
          </div>

          {/* Trust */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-solid)",
            display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["✅ Revisado y probado", "📦 Envío coordinado", "💬 Soporte post-venta"].map(t => (
              <span key={t} style={{ fontSize: 12, color: "var(--text-3)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          onClick={closeLightbox}
          className="lb-backdrop"
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(5,7,18,0.93)",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Imagen con slide direccional */}
          <div
            key={imgKey}
            onClick={e => e.stopPropagation()}
            className={`lb-img-wrap ${slideDir === "left" ? "slide-from-right" : slideDir === "right" ? "slide-from-left" : "lb-enter"}`}
            style={{
              position: "relative", maxWidth: "90vw", maxHeight: "88vh",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeImg]}
              alt={product.nombre}
              style={{
                display: "block", maxWidth: "90vw", maxHeight: "88vh",
                objectFit: "contain", borderRadius: 12,
                boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
              }}
            />
          </div>

          {/* Cerrar */}
          <button
            onClick={closeLightbox}
            className="lb-btn lb-close"
            style={{
              position: "fixed", top: 18, right: 18,
              width: 40, height: 40, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <X size={17} />
          </button>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prevImg(); }}
                className="lb-btn lb-nav"
                style={{
                  position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)",
                  width: 48, height: 48, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); nextImg(); }}
                className="lb-btn lb-nav"
                style={{
                  position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)",
                  width: 48, height: 48, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ChevronRight size={24} />
              </button>

              {/* Dots */}
              <div style={{
                position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: 7, alignItems: "center",
              }}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => {
                      e.stopPropagation();
                      setSlideDir(i > activeImg ? "left" : "right");
                      setImgKey(k => k + 1);
                      setActiveImg(i);
                    }}
                    style={{
                      width: i === activeImg ? 22 : 8, height: 8, borderRadius: 4,
                      background: i === activeImg ? "var(--accent)" : "rgba(255,255,255,0.25)",
                      border: "none", cursor: "pointer", padding: 0,
                      transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                      boxShadow: i === activeImg ? "0 0 8px var(--accent)" : "none",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }

        /* ── Lightbox animations ── */
        @keyframes lb-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lb-scale-in {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-from-right {
          from { opacity: 0; transform: translateX(60px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes slide-from-left {
          from { opacity: 0; transform: translateX(-60px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)     scale(1); }
        }

        .lb-backdrop { animation: lb-backdrop-in 0.22s ease; }
        .lb-enter    { animation: lb-scale-in      0.28s cubic-bezier(.2,.8,.3,1) both; }
        .slide-from-right { animation: slide-from-right 0.28s cubic-bezier(.2,.8,.3,1) both; }
        .slide-from-left  { animation: slide-from-left  0.28s cubic-bezier(.2,.8,.3,1) both; }

        .lb-btn {
          transition: background 0.18s, border-color 0.18s, transform 0.18s;
        }
        .lb-btn:hover {
          background: rgba(255,255,255,0.18) !important;
          border-color: rgba(255,255,255,0.35) !important;
          transform: scale(1.08);
        }
        .lb-nav:hover { transform: translateY(-50%) scale(1.08) !important; }
      `}</style>
    </div>
  );
}
