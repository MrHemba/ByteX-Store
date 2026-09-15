"use client";
import Link from "next/link";
import type { ReactNode } from "react";

interface Cat { id: string; icon: ReactNode; label: string; }

export default function CategoryPills({ cats }: { cats: Cat[] }) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
      <Link href="/catalogo" style={{ textDecoration: "none" }}>
        <div style={{
          padding: "10px 18px", borderRadius: 8, whiteSpace: "nowrap",
          background: "var(--accent)", color: "var(--bg)",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
          Todos
        </div>
      </Link>

      {cats.map(c => (
        <Link key={c.id} href={`/catalogo?cat=${c.id}`} style={{ textDecoration: "none" }}>
          <div
            className="cat-pill"
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 18px", borderRadius: 8, whiteSpace: "nowrap",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              fontSize: 13, fontWeight: 500, color: "var(--text-2)", cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <span style={{ color: "var(--accent)" }}>{c.icon}</span>
            {c.label}
          </div>
        </Link>
      ))}

      <style>{`
        .cat-pill:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
        }
      `}</style>
    </div>
  );
}
