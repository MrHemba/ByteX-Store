import type { CSSProperties } from "react";

/** Insignia "-12%" para productos cuyo precio bajó. No renderiza nada si no hay baja vigente. */
export function DropBadge({ pct, style }: { pct?: number | null; style?: CSSProperties }) {
  if (!pct) return null;
  return (
    <span
      title={`Bajó ${pct}% respecto al precio anterior`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "var(--font-ui)",
        letterSpacing: "0.02em",
        color: "#fff",
        background: "var(--error)",
        padding: "3px 7px",
        borderRadius: 4,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      −{pct}%
    </span>
  );
}

/** Precio anterior tachado. Solo se muestra junto a una baja vigente. */
export function OldPrice({ value, pct, style }: { value?: number | null; pct?: number | null; style?: CSSProperties }) {
  if (!pct || !value) return null;
  return (
    <span
      aria-label={`Precio anterior ${value.toFixed(2)} dólares`}
      style={{
        fontSize: 13,
        fontFamily: "var(--font-ui)",
        color: "var(--text-3)",
        textDecoration: "line-through",
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      ${value.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
    </span>
  );
}
