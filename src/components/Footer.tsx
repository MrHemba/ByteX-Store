"use client";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { INSTAGRAM_URL, FACEBOOK_URL } from "@/lib/social";


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
              <div className="footer-logo-box">
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
              Laptops, PCs, impresoras y accesorios con garantía. Una tienda de H&G Solutions.
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
            <div className="footer-social">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                 className="footer-social-btn" aria-label="Instagram de ByteX Store">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                </svg>
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
                 className="footer-social-btn" aria-label="Facebook de ByteX Store">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Catálogo */}
          <div className="footer-col">
            <h4 className="footer-heading">Catálogo</h4>
            <nav className="footer-nav">
              {CATEGORIES.map(({ id, label }) => (
                <Link
                  key={id}
                  href={`/catalogo?cat=${encodeURIComponent(id)}`}
                  className="footer-link"
                >
                  {label}
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
        .footer-logo-box { position: relative; height: 140px; width: 420px; max-width: 100%; }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 36px;
        }
        .footer-desc {
          font-size: 14px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.62);
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
          color: rgba(255,255,255,0.5);
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
          color: rgba(255,255,255,0.68);
          text-decoration: none;
          transition: color 160ms var(--ease-out);
        }
        @media (hover: hover) and (pointer: fine) {
          .footer-link:hover { color: #ffffff; }
        }
        .footer-info-row {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          font-size: 15px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.68);
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
        .footer-social { display: flex; gap: 10px; margin-top: 16px; }
        .footer-social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.75);
          transition: color 160ms var(--ease-out), border-color 160ms var(--ease-out), background 160ms var(--ease-out);
        }
        .footer-social-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: rgba(255,255,255,0.04);
        }
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
          color: rgba(255,255,255,0.5);
        }
        .footer-bottom-link {
          font-size: 13px;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 160ms var(--ease-out);
        }
        .footer-bottom-link:hover { color: rgba(255,255,255,0.75); }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-col-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 28px !important; }
          .footer-logo-box { width: 260px; height: 87px; }
          .footer-col-brand { grid-column: auto; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
}
