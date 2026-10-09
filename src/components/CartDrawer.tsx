"use client";
import { X, Trash2, ShoppingBag, Plus, Minus, Send, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useState, useEffect } from "react";

const BLANK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%23F4F4F5' width='60' height='60'/%3E%3C/svg%3E`;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const count    = mounted ? itemCount() : 0;
  const totalVal = mounted ? total()     : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(9,9,11,0.50)", backdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: 380, maxWidth: "100vw",
        background: "var(--surface)",
        borderLeft: "1px solid var(--border)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>

        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
            }}>
              Cotización
            </span>
            {count > 0 && (
              <span style={{
                background: "var(--accent)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-ui)",
                padding: "1px 7px",
                borderRadius: 4,
              }}>
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            style={{
              width: 30, height: 30, borderRadius: 6,
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              color: "var(--text-3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "border-color 0.15s",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Items */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "12px 16px",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {items.length === 0 ? (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 12, paddingTop: 80, textAlign: "center",
            }}>
              <ShoppingBag size={40} style={{ color: "var(--text-3)" }} />
              <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-ui)", color: "var(--text-2)" }}>
                Tu cotización está vacía
              </div>
              <div style={{ fontSize: 13, color: "var(--text-3)", fontFamily: "var(--font-ui)", lineHeight: 1.5 }}>
                Agrega equipos desde el catálogo para solicitar tu cotización
              </div>
              <Link
                href="/catalogo"
                onClick={closeCart}
                className="btn-primary"
                style={{ marginTop: 8, fontSize: 13, padding: "9px 18px", textDecoration: "none" }}
              >
                Ver catálogo <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} style={{
                display: "flex", gap: 12, padding: "10px",
                background: "var(--bg-alt)",
                border: "1px solid var(--border)",
                borderRadius: 6,
              }}>
                {/* Image */}
                <div style={{
                  width: 60, height: 60, borderRadius: 6,
                  overflow: "hidden", flexShrink: 0,
                  position: "relative",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}>
                  <Image
                    src={item.product.fotos_tienda?.[0] || BLANK}
                    alt={item.product.nombre}
                    fill
                    style={{ objectFit: "contain", padding: "4px" }}
                    unoptimized
                    sizes="60px"
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 400,
                    fontFamily: "var(--font-ui)",
                    color: "var(--text)",
                    marginBottom: 3,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {item.product.nombre}
                  </div>
                  <span className="price-tag" style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
                    ${(item.product.precio * item.quantity).toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                  </span>

                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        style={{
                          width: 24, height: 24, borderRadius: 4,
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-3)", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "border-color 0.15s",
                        }}
                      >
                        <Minus size={10} />
                      </button>
                      <span style={{
                        fontSize: 13, fontWeight: 600, fontFamily: "var(--font-ui)", color: "var(--text)",
                        minWidth: 20, textAlign: "center",
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        style={{
                          width: 24, height: 24, borderRadius: 4,
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-3)", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "border-color 0.15s",
                        }}
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      style={{
                        width: 24, height: 24, borderRadius: 4,
                        background: "rgba(220,38,38,0.08)",
                        border: "1px solid rgba(220,38,38,0.20)",
                        color: "var(--error)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.15s",
                      }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "14px 18px",
            borderTop: "1px solid var(--border)",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {/* Subtotal */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
            }}>
              <span style={{ fontSize: 13, color: "var(--text-3)", fontFamily: "var(--font-ui)" }}>
                Subtotal referencial
              </span>
              <span className="price-tag" style={{ fontSize: 20 }}>
                ${totalVal.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <Link
              href="/carrito"
              onClick={closeCart}
              className="btn-primary"
              style={{
                width: "100%", textAlign: "center",
                fontSize: 14, padding: "10px 18px",
                textDecoration: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Send size={14} /> Solicitar cotización
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
