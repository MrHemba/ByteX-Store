"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

const CONDITIONS: Record<string, { label: string; cls: string }> = {
  nuevo:           { label: "Nuevo",           cls: "badge badge-nuevo" },
  segunda:         { label: "Segunda vida",     cls: "badge badge-segunda" },
  reacondicionado: { label: "Reacondicionado",  cls: "badge badge-reacondicionado" },
};

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='90'%3E%3Crect fill='%23F2F4F7' width='120' height='90'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter' font-size='11' fill='%2398A2B3'%3ESin imagen%3C/text%3E%3C/svg%3E`;

export default function ProductRow({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const cond = CONDITIONS[product.condicion] ?? CONDITIONS.segunda;
  const imgSrc = product.fotos_tienda?.[0] || PLACEHOLDER;
  const available  = product.es_servicio || product.stock > 0;
  const dropiStock = product.stock === 99; // centinela Dropi — sin cantidad real
  const specs = Object.entries(product.especificaciones || {}).slice(0, 4);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!available) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Link href={`/catalogo/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="product-row card">
        {/* Image */}
        <div className="row-img-wrap">
          <Image
            src={imgSrc}
            alt={product.nombre}
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
            unoptimized={imgSrc.startsWith("data:")}
          />
          {!available && (
            <div className="row-sold-overlay">Agotado</div>
          )}
        </div>

        {/* Content */}
        <div className="row-content">
          <div className="row-meta">
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {product.categoria || "Equipo"}
            </span>
            <span className={cond.cls}>{cond.label}</span>
          </div>

          <h3 className="row-name">{product.nombre}</h3>

          {product.descripcion_publica && (
            <p className="row-desc">{product.descripcion_publica}</p>
          )}

          {specs.length > 0 && (
            <div className="row-specs">
              {specs.map(([key, val]) => (
                <span key={key} className="row-spec">{key}: {String(val)}</span>
              ))}
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="row-actions">
          <div className="row-price-area">
            {!product.es_servicio && available && product.stock <= 2 && !dropiStock && (
              <span style={{ fontSize: 10, color: "var(--warning)", fontWeight: 500 }}>¡Último disponible!</span>
            )}
            {product.precio > 0 ? (
              <span className="price-tag" style={{ fontSize: 22 }}>
                ${product.precio.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span style={{ fontSize: 13, color: "var(--text-3)", fontStyle: "italic" }}>Consultar precio</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!available}
            className={`row-add-btn${added ? " added" : ""}${!available ? " disabled" : ""}`}
          >
            {added
              ? <><Check size={13} /> Agregado</>
              : <><ShoppingCart size={13} /> Añadir</>
            }
          </button>
        </div>
      </div>

      <style>{`
        .product-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .row-img-wrap {
          position: relative;
          width: 110px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--bg-elevated);
          flex-shrink: 0;
        }
        .row-sold-overlay {
          position: absolute;
          inset: 0;
          background: rgba(248,250,252,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: var(--text-3);
        }
        .row-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .row-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .row-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.4;
          font-family: var(--font-ui);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .row-desc {
          font-size: 12px;
          color: var(--text-3);
          line-height: 1.4;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .row-specs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .row-spec {
          font-size: 9px;
          font-family: var(--font-mono);
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--bg-elevated);
          color: var(--text-3);
          border: 1px solid var(--border-solid);
        }
        .row-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }
        .row-price-area {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .row-add-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 8px;
          cursor: pointer;
          background: var(--primary-light);
          border: 1.5px solid var(--accent);
          color: var(--accent);
          font-size: 11px;
          font-weight: 600;
          font-family: var(--font-ui);
          white-space: nowrap;
          transition: all 0.18s;
        }
        [data-theme="dark"] .row-add-btn {
          background: var(--accent-dim);
        }
        .row-add-btn:hover:not(.disabled) {
          background: var(--accent);
          color: #ffffff;
          box-shadow: var(--shadow-primary);
        }
        .row-add-btn.added {
          background: rgba(18,183,106,0.10);
          border-color: rgba(18,183,106,0.35);
          color: var(--success);
        }
        .row-add-btn.disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }
        @media (max-width: 600px) {
          .product-row { gap: 10px; padding: 10px; }
          .row-img-wrap { width: 72px; height: 58px; }
          .row-desc { display: none; }
          .row-specs { display: none; }
          .row-name { font-size: 13px; }
          .row-actions { gap: 6px; }
        }
      `}</style>
    </Link>
  );
}
