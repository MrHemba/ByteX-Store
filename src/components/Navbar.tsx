"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/",           label: "Inicio" },
  { href: "/catalogo",   label: "Catálogo" },
  { href: "/catalogo?oferta=true", label: "Ofertas" },
  { href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`, label: "Soporte", external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch]         = useState("");
  const [mounted, setMounted]       = useState(false);
  const { itemCount, openCart }     = useCart();

  useEffect(() => { setMounted(true); }, []);
  const count = mounted ? itemCount() : 0;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) window.location.href = `/catalogo?q=${encodeURIComponent(search)}`;
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link href="/" className="navbar-logo" aria-label="ByteX Store — inicio">
            <div style={{ position: "relative", height: 100, width: 335 }}>
              <Image
                src="/logo.png"
                alt="ByteX Store"
                fill
                priority
                style={{ objectFit: "contain", objectPosition: "left center" }}
                sizes="335px"
                quality={100}
              />
            </div>
          </Link>

          {/* Nav links — desktop */}
          <div className="navbar-links hide-mobile">
            {NAV.map(item =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar-link"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href} className="navbar-link">
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right side */}
          <div className="navbar-actions">
            {/* Search — desktop inline */}
            <form onSubmit={handleSearch} className="navbar-search hide-mobile">
              <Search size={14} className="navbar-search-icon" />
              <input
                placeholder="Buscar equipos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="navbar-search-input"
              />
            </form>

            {/* Cart */}
            <button
              onClick={openCart}
              className="navbar-icon-btn"
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={16} />
              {count > 0 && (
                <span className="navbar-cart-badge">{count}</span>
              )}
            </button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="navbar-icon-btn show-mobile"
              aria-label="Menú"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="navbar-mobile">
            <form onSubmit={handleSearch} className="navbar-mobile-search">
              <input
                className="input-field"
                placeholder="Buscar equipos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontSize: 14 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: "9px 14px", flexShrink: 0 }}>
                <Search size={14} />
              </button>
            </form>
            {NAV.map(item =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar-mobile-link"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="navbar-mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        )}
      </nav>

      <CartDrawer />

      <style>{`
        /* ── Navbar siempre oscura (independiente del tema) ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          height: 64px;
          background: rgba(15, 15, 18, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: background 0.25s;
          overflow: visible;
        }
        .navbar--scrolled {
          background: rgba(10, 10, 13, 0.99);
          border-bottom-color: rgba(255,255,255,0.06);
        }
        .navbar-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .navbar-logo {
          text-decoration: none;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          transition: opacity 0.2s;
        }
        .navbar-logo:hover { opacity: 0.85; }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
        }
        .navbar-link {
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-ui);
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          padding: 5px 12px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .navbar-link:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.08);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .navbar-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px;
          padding: 0 10px;
          height: 36px;
          transition: border-color 0.15s;
        }
        .navbar-search:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent-dim);
          background: rgba(255,255,255,0.10);
        }
        .navbar-search-icon { color: rgba(255,255,255,0.4); flex-shrink: 0; }
        .navbar-search-input {
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: var(--font-ui);
          font-size: 13px;
          width: 180px;
        }
        .navbar-search-input::placeholder { color: rgba(255,255,255,0.35); }

        .navbar-icon-btn {
          position: relative;
          width: 36px; height: 36px;
          border-radius: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.65);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .navbar-icon-btn:hover {
          border-color: rgba(255,255,255,0.25);
          color: #ffffff;
          background: rgba(255,255,255,0.12);
        }

        .navbar-cart-badge {
          position: absolute;
          top: -5px; right: -5px;
          width: 17px; height: 17px;
          border-radius: 50%;
          background: var(--accent);
          color: #ffffff;
          font-size: 9px;
          font-weight: 600;
          font-family: var(--font-ui);
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #0f0f12;
        }

        /* Mobile menu */
        .navbar-mobile {
          background: rgba(15, 15, 18, 0.99);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 12px 24px 20px;
        }
        .navbar-mobile-search {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .navbar-mobile-link {
          display: block;
          padding: 10px 8px;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-ui);
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .navbar-mobile-link:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.08);
        }

        @media (max-width: 768px) {
          .navbar { height: auto; min-height: 64px; }
          .navbar-inner { height: 64px; padding: 0 16px; gap: 16px; }
          .navbar-mobile { padding: 12px 16px 20px; }
        }
      `}</style>
    </>
  );
}
