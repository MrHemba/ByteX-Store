"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, LayoutGrid, List, X, ChevronDown, SlidersHorizontal, PackageSearch } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ProductCard from "@/components/ProductCard";
import ProductRow from "@/components/ProductRow";
import type { Product } from "@/lib/types";
import { CATEGORIES as STORE_CATEGORIES, matchesCategory } from "@/lib/categories";

const CATEGORIES = [
  { id: "todos", label: "Todos los equipos" },
  ...STORE_CATEGORIES.map(({ id, label }) => ({ id, label })),
];

const CONDITIONS = [
  { id: "todos",           label: "Todas" },
  { id: "nuevo",           label: "Nuevo" },
  { id: "reacondicionado", label: "Reacondicionado" },
  { id: "segunda",         label: "Segunda vida" },
];

const SORT_OPTIONS = [
  { id: "reciente",    label: "Más recientes" },
  { id: "precio_asc",  label: "Menor precio" },
  { id: "precio_desc", label: "Mayor precio" },
  { id: "nombre",      label: "Nombre A–Z" },
];

interface Props {
  allProducts: Product[];
  initialCat?: string;
  initialQ?: string;
}

export default function CatalogoClient({ allProducts, initialCat = "todos", initialQ = "" }: Props) {
  const [query, setQuery]         = useState(initialQ);
  const [inputVal, setInputVal]   = useState(initialQ);
  const [category, setCategory]   = useState(initialCat);
  const [condition, setCondition] = useState("todos");
  const [sortBy, setSortBy]       = useState("reciente");
  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid");
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (category !== "todos") {
      list = list.filter(p => matchesCategory(p.categoria, category));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion_publica?.toLowerCase().includes(q) ||
        p.categoria?.toLowerCase().includes(q)
      );
    }
    if (condition !== "todos") {
      list = list.filter(p => p.condicion === condition);
    }
    if (onlyAvail) {
      list = list.filter(p => p.es_servicio || p.stock > 0);
    }
    switch (sortBy) {
      case "precio_asc":  list.sort((a, b) => a.precio - b.precio); break;
      case "precio_desc": list.sort((a, b) => b.precio - a.precio); break;
      case "nombre":      list.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
    }
    return list;
  }, [allProducts, category, query, condition, sortBy, onlyAvail]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setQuery(inputVal); };
  const clearSearch  = () => { setInputVal(""); setQuery(""); };
  const resetAll     = () => { setCategory("todos"); setCondition("todos"); setOnlyAvail(false); setQuery(""); setInputVal(""); };

  const hasFilters = category !== "todos" || condition !== "todos" || onlyAvail || query;
  const activeFilters = (category !== "todos" ? 1 : 0) + (condition !== "todos" ? 1 : 0) + (onlyAvail ? 1 : 0);

  // Hoja de filtros (móvil): Escape la cierra
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  return (
    <div className="cat-root">

      {/* ── TOP BAR ── */}
      <div className="cat-topbar">
        <div className="cat-topbar-inner">

          {/* Left: title + count */}
          <div className="cat-topbar-left">
            <button className="cat-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-expanded={sidebarOpen} aria-controls="cat-filtros">
              <SlidersHorizontal size={15} />
              Filtros
              {activeFilters > 0 && <span className="cat-filter-count">{activeFilters}</span>}
            </button>
            <span className="cat-count">
              <strong>{filtered.length}</strong> equipo{filtered.length !== 1 ? "s" : ""}
              {category !== "todos" && (
                <> · <span style={{ color: "var(--accent)" }}>{CATEGORIES.find(c => c.id === category)?.label}</span></>
              )}
            </span>
          </div>

          {/* Center: search */}
          <form onSubmit={handleSearch} className="cat-search">
            <Search size={14} className="cat-search-ico" />
            <input
              className="cat-search-inp"
              placeholder="Buscar equipos..."
              value={inputVal}
              onChange={e => { setInputVal(e.target.value); setQuery(e.target.value); }}
              type="search"
              aria-label="Buscar equipos"
            />
            {inputVal && (
              <button type="button" onClick={clearSearch} className="cat-search-x">
                <X size={12} />
              </button>
            )}
          </form>

          {/* Right: sort + view */}
          <div className="cat-topbar-right">
            <div className="cat-sel-wrap">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="cat-sel">
                {SORT_OPTIONS.map(s => (
                  <option key={s.id} value={s.id} style={{ background: "var(--surface)" }}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={11} className="cat-sel-arrow" />
            </div>
            <div className="cat-view-toggle">
              <button onClick={() => setViewMode("grid")} className={`cat-view-btn${viewMode === "grid" ? " active" : ""}`} title="Cuadrícula">
                <LayoutGrid size={14} />
              </button>
              <button onClick={() => setViewMode("list")} className={`cat-view-btn${viewMode === "list" ? " active" : ""}`} title="Lista">
                <List size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── BODY: sidebar + grid ── */}
      <div className="cat-body">

        {/* SIDEBAR */}
        <div className={`cat-sheet-backdrop${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        <aside id="cat-filtros" className={`cat-sidebar${sidebarOpen ? " open" : ""}`} aria-label="Filtros">

          {/* Cabecera de la hoja (solo móvil) */}
          <div className="cat-sheet-head">
            <span className="cat-sheet-title">Filtros</span>
            <button className="cat-sheet-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar filtros">
              <X size={16} />
            </button>
          </div>

          {/* Categorías */}
          <div className="sidebar-section">
            <p className="sidebar-label">Categoría</p>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`sidebar-cat-btn${category === c.id ? " active" : ""}`}
              >
                <span>{c.label}</span>
                {category === c.id && <span className="sidebar-cat-dot" />}
              </button>
            ))}
          </div>

          <div className="sidebar-divider" />

          {/* Condición */}
          <div className="sidebar-section">
            <p className="sidebar-label">Condición</p>
            {CONDITIONS.map(c => (
              <label key={c.id} className="sidebar-check-row">
                <input
                  type="radio"
                  name="condition"
                  value={c.id}
                  checked={condition === c.id}
                  onChange={() => setCondition(c.id)}
                  className="sidebar-radio"
                />
                <span className="sidebar-check-label">{c.label}</span>
              </label>
            ))}
          </div>

          <div className="sidebar-divider" />

          {/* Solo disponibles */}
          <div className="sidebar-section">
            <button type="button" role="switch" aria-checked={onlyAvail}
              onClick={() => setOnlyAvail(!onlyAvail)} className="sidebar-avail">
              <span className="sidebar-check-label">Solo disponibles</span>
              <span className={`sidebar-toggle${onlyAvail ? " on" : ""}`}>
                <span className="sidebar-thumb" />
              </span>
            </button>
          </div>

          {/* Reset */}
          {hasFilters && (
            <>
              <div className="sidebar-divider" />
              <div className="sidebar-section">
                <button onClick={resetAll} className="sidebar-reset">
                  <X size={11} /> Limpiar filtros
                </button>
              </div>
            </>
          )}

          {/* Pie de la hoja (solo móvil) */}
          <div className="cat-sheet-foot">
            <button className="btn-primary" style={{ width: "100%", padding: "12px 18px" }} onClick={() => setSidebarOpen(false)}>
              Ver {filtered.length} equipo{filtered.length !== 1 ? "s" : ""}
            </button>
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="cat-main">
          {filtered.length === 0 ? (
            <div className="cat-empty">
              <PackageSearch size={36} strokeWidth={1.5} className="empty-ico" />
              <p className="empty-title">{query ? `Sin resultados para "${query}"` : "No hay equipos aquí"}</p>
              <p className="empty-sub">Escríbenos por WhatsApp y conseguimos lo que necesitas.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={resetAll} className="btn-outline">Ver todos los equipos</button>
                <a className="btn-ghost" target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, estoy buscando: ${query || "un equipo"}`)}`}>
                  <WhatsAppIcon size={15} /> Preguntar por WhatsApp
                </a>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="cat-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="cat-list">
              {filtered.map(p => <ProductRow key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .cat-root {
          padding-top: 64px;
          min-height: 100vh;
          background: var(--bg);
        }

        /* ── TOP BAR ── */
        .cat-topbar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 64px;
          z-index: 20;
        }
        .cat-topbar-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 20px;
          height: 52px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cat-topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .cat-sidebar-toggle {
          display: none;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          border-radius: 5px;
          color: var(--text-2);
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }
        .cat-count {
          font-size: 15px;
          font-family: var(--font-ui);
          color: var(--text-3);
          white-space: nowrap;
        }
        .cat-count strong { color: var(--text); font-weight: 600; }

        /* Search */
        .cat-search {
          flex: 1;
          max-width: 400px;
          display: flex;
          align-items: center;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.15s;
        }
        .cat-search:focus-within { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-dim); }
        .cat-search-ico { color: var(--text-3); margin-left: 10px; flex-shrink: 0; }
        .cat-search-inp {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-family: var(--font-ui);
          font-size: 15px;
          padding: 8px 8px;
        }
        .cat-search-inp::placeholder { color: var(--text-3); }
        .cat-search-x {
          background: none; border: none; cursor: pointer; color: var(--text-3);
          padding: 4px 8px; display: flex; align-items: center; transition: color 0.15s;
        }
        .cat-search-x:hover { color: var(--text-2); }

        /* Right controls */
        .cat-topbar-right { display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0; }
        .cat-sel-wrap { position: relative; display: flex; align-items: center; }
        .cat-sel {
          appearance: none;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 5px;
          color: var(--text);
          font-family: var(--font-ui);
          font-size: 14px;
          font-weight: 500;
          padding: 5px 28px 5px 10px;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s;
        }
        .cat-sel:hover { border-color: var(--border-strong); }
        .cat-sel-arrow { position: absolute; right: 8px; color: var(--text-3); pointer-events: none; }
        .cat-view-toggle {
          display: flex;
          border: 1px solid var(--border);
          border-radius: 5px;
          overflow: hidden;
        }
        .cat-view-btn {
          padding: 5px 8px;
          background: var(--surface);
          border: none;
          color: var(--text-3);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.15s, color 0.15s;
        }
        .cat-view-btn:not(:last-child) { border-right: 1px solid var(--border); }
        .cat-view-btn:hover { color: var(--text-2); background: var(--bg-alt); }
        .cat-view-btn.active { background: var(--accent-dim); color: var(--accent); }

        /* ── BODY ── */
        .cat-body {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 20px 60px;
          display: flex;
          gap: 0;
          align-items: flex-start;
        }

        /* ── SIDEBAR ── */
        .cat-sidebar {
          width: 220px;
          flex-shrink: 0;
          padding: 20px 16px 20px 0;
          position: sticky;
          top: 120px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .cat-sidebar::-webkit-scrollbar { display: none; }

        .sidebar-section { padding: 4px 0 8px; }
        .sidebar-label {
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-ui);
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          padding: 0 4px;
        }
        .sidebar-divider { height: 1px; background: var(--border); margin: 4px 0; }

        .sidebar-cat-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 10px;
          border-radius: 5px;
          border: none;
          background: transparent;
          color: var(--text-2);
          font-family: var(--font-ui);
          font-size: 15px;
          text-align: left;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .sidebar-cat-btn:hover { background: var(--bg-alt); color: var(--text); }
        .sidebar-cat-btn.active {
          background: var(--accent-dim);
          color: var(--accent);
          font-weight: 600;
        }
        .sidebar-cat-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent); flex-shrink: 0;
        }

        .sidebar-check-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.12s;
        }
        .sidebar-check-row:hover { background: var(--bg-alt); }
        .sidebar-radio {
          width: 14px; height: 14px;
          accent-color: var(--accent);
          cursor: pointer;
          flex-shrink: 0;
        }
        .sidebar-check-label {
          font-size: 15px;
          font-family: var(--font-ui);
          color: var(--text-2);
        }

        .sidebar-avail {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          cursor: pointer;
          background: none;
          border: none;
          border-radius: 6px;
          font: inherit;
          text-align: left;
        }
        .sidebar-toggle {
          width: 34px; height: 18px;
          border-radius: 9px;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          position: relative;
          cursor: pointer;
          transition: background-color 200ms var(--ease-out), border-color 200ms var(--ease-out);
          flex-shrink: 0;
        }
        .sidebar-toggle.on { background: var(--accent-dim); border-color: var(--accent); }
        .sidebar-thumb {
          position: absolute;
          top: 2px; left: 2px;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: var(--text-3);
          transition: transform 200ms var(--ease-out), background-color 200ms var(--ease-out);
        }
        .sidebar-toggle.on .sidebar-thumb { transform: translateX(16px); background: var(--accent); }

        .sidebar-reset {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 10px;
          border-radius: 5px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-3);
          font-family: var(--font-ui);
          font-size: 14px;
          cursor: pointer;
          width: 100%;
          transition: border-color 0.15s, color 0.15s;
        }
        .sidebar-reset:hover { border-color: var(--border-strong); color: var(--text-2); }

        /* ── MAIN ── */
        .cat-main {
          flex: 1;
          min-width: 0;
          padding: 20px 0 0 20px;
          border-left: 1px solid var(--border);
        }

        /* Grid */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }
        .cat-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Empty */
        .cat-empty {
          text-align: center;
          padding: 80px 24px;
        }
        .empty-ico { color: var(--text-3); margin: 0 auto 14px; display: block; }
        .empty-title {
          font-size: 16px; font-weight: 600;
          font-family: var(--font-display);
          color: var(--text-2); margin-bottom: 6px;
        }
        .empty-sub {
          font-size: 13px; font-family: var(--font-ui);
          color: var(--text-3); margin-bottom: 24px;
        }

        /* ── RESPONSIVE ── */
        .cat-sheet-backdrop, .cat-sheet-head, .cat-sheet-foot { display: none; }
        .cat-sheet-title { font-family: var(--font-display); font-size: 17px; font-weight: 600; color: var(--text); }
        .cat-sheet-close {
          width: 34px; height: 34px; border-radius: 8px;
          display: grid; place-items: center;
          background: var(--bg-alt); border: 1px solid var(--border);
          color: var(--text-2); cursor: pointer;
        }
        .cat-filter-count {
          min-width: 18px; height: 18px; padding: 0 5px;
          border-radius: 9px;
          background: var(--accent); color: #fff;
          font-size: 11px; font-weight: 700; line-height: 18px; text-align: center;
        }
        @media (max-width: 1400px) {
          .cat-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 1100px) {
          .cat-sidebar { width: 190px; }
          .cat-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .cat-topbar { position: static; }
          .cat-topbar-inner {
            height: auto; padding: 10px 14px; gap: 8px; flex-wrap: wrap;
          }
          .cat-topbar-left { order: 1; }
          .cat-topbar-right { order: 2; margin-left: auto; }
          .cat-search { order: 3; flex: 1 1 100%; max-width: none; min-height: 38px; }
          .cat-body { padding: 0 12px 48px; flex-direction: column; align-items: stretch; }
          /* Filtros como hoja inferior: no empujan el listado */
          .cat-sidebar {
            position: fixed;
            left: 0; right: 0; bottom: 0; top: auto;
            z-index: 301;
            width: 100%;
            max-height: 82vh;
            overflow-y: auto;
            overscroll-behavior: contain;
            padding: 0 16px;
            background: var(--surface);
            border: none;
            border-radius: 16px 16px 0 0;
            box-shadow: 0 -12px 40px rgba(0,0,0,0.18);
            transform: translateY(100%);
            visibility: hidden;
            transition: transform 320ms var(--ease-drawer), visibility 0s linear 320ms;
          }
          .cat-sidebar.open {
            transform: translateY(0);
            visibility: visible;
            transition: transform 320ms var(--ease-drawer), visibility 0s;
          }
          .cat-sheet-backdrop {
            display: block;
            position: fixed; inset: 0; z-index: 300;
            background: rgba(9,9,11,0.5);
            opacity: 0;
            pointer-events: none;
            transition: opacity 240ms var(--ease-out);
          }
          .cat-sheet-backdrop.open { opacity: 1; pointer-events: auto; }
          .cat-sheet-head {
            display: flex;
            position: sticky; top: 0; z-index: 1;
            align-items: center; justify-content: space-between;
            padding: 14px 0 10px;
            background: var(--surface);
          }
          .cat-sheet-foot {
            display: block;
            position: sticky; bottom: 0;
            padding: 12px 0 calc(12px + env(safe-area-inset-bottom));
            background: var(--surface);
            border-top: 1px solid var(--border);
          }
          .cat-main { width: 100%; padding: 14px 0 0; border-left: none; }
          .cat-sidebar-toggle { display: flex; }
          .cat-count { display: none; }
          .cat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        }
        @media (max-width: 380px) {
          .cat-sel { font-size: 12px; padding-left: 8px; }
        }
      `}</style>
    </div>
  );
}
