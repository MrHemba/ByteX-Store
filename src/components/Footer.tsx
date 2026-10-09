"use client";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, MapPin } from "lucide-react";

const CATEGORIES = ["Laptops", "PCs", "Impresoras", "Monitores", "Zona Tech", "Servicios"];

export default function Footer() {
  const wNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-grid">

          {/* Col 1 — Brand */}
          <div className="footer-col footer-col-brand">
            <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 18 }}>
              <div style={{ position: "relative", height: 140, width: 420 }}>
                <Image
                  src="/logo.png"
                  alt="ByteX Store"
                  fill
                  style={{ objectFit: "contain", objectPosition: "left center" }}
                  sizes="420px"
                  quality={100}
                />
              </div>
            </Link>
            <p className="footer-desc">
              Laptops, PCs e impresoras de segunda mano revisados por expertos. Una tienda de H&G Solutions.
            </p>
            <a
              href={`https://wa.me/${wNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-wa-btn"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>

          {/* Col 2 — Catálogo */}
          <div className="footer-col">
            <h4 className="footer-heading">Catálogo</h4>
            <nav className="footer-nav">
              {CATEGORIES.map(item => (
                <Link
                  key={item}
                  href={`/catalogo?cat=${item.toLowerCase()}`}
                  className="footer-link"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Soporte */}
          <div className="footer-col">
            <h4 className="footer-heading">Soporte</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="footer-info-row">
                <MapPin size={15} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
                Ecuador — A nivel nacional
              </div>
              <div className="footer-info-row">
                <MessageCircle size={15} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
                WhatsApp disponible
              </div>
              <a
                href={`https://wa.me/${wNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{ marginTop: 4 }}
              >
                Contáctanos
              </a>
              <Link href="/catalogo" className="footer-link">Ver catálogo completo</Link>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-copy">
            © {year} ByteX Store · H&G Solutions
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <Link href="/privacidad" className="footer-bottom-link">Privacidad</Link>
            <Link href="/terminos" className="footer-bottom-link">Términos</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: rgba(15, 15, 18, 0.98);
          border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: 0;
        }
        .footer-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 52px 24px 28px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 36px;
        }
        .footer-desc {
          font-size: 14px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          max-width: 280px;
          margin-bottom: 20px;
        }
        .footer-heading {
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-ui);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 16px;
        }
        .footer-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .footer-link {
          display: block;
          padding: 5px 0;
          font-size: 15px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #ffffff; }
        .footer-info-row {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          font-size: 15px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.55);
        }
        .footer-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background: rgba(37,211,102,0.10);
          border: 1px solid rgba(37,211,102,0.30);
          border-radius: 6px;
          color: #25D366;
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-ui);
          text-decoration: none;
          transition: background 0.15s;
        }
        .footer-wa-btn:hover { background: rgba(37,211,102,0.18); }
        .footer-bottom {
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy {
          font-size: 13px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.3);
        }
        .footer-bottom-link {
          font-size: 13px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-bottom-link:hover { color: rgba(255,255,255,0.75); }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-col-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .footer-col-brand { grid-column: auto; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
}
