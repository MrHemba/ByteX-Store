"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "@/components/ProductImage";
import { DropBadge } from "@/components/PriceDrop";

export type HeroItem = {
  id: string;
  nombre: string;
  precio: number;
  foto: string;
  baja_pct?: number | null;
};

/** Cada cuántos ms cambia UNA de las tarjetas por otro producto del catálogo */
const INTERVAL_MS = 3200;
/** Orden en que se renuevan las tarjetas: salteado, para que no se sienta como una barrida */
const SLOT_ORDER = [0, 3, 1, 2];

const money = (n: number) => `$${n.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

/**
 * Muestra 4 productos y los va rotando con todo el catálogo disponible.
 * - SSR/primer render: los 4 iniciales (sin saltos de hidratación). El resto se baraja ya en el cliente.
 * - Se pausa con el mouse/foco/toque encima, con la pestaña oculta y si el usuario pide menos movimiento.
 */
export default function HeroShowcase({ initial, pool }: { initial: HeroItem[]; pool: HeroItem[] }) {
  const [tiles, setTiles] = useState<HeroItem[]>(initial);
  const tilesRef = useRef<HeroItem[]>(initial);
  const queue = useRef<HeroItem[]>([]);
  const step = useRef(0);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const shown = new Set(initial.map(p => p.id));
    const rest = pool.filter(p => !shown.has(p.id));
    for (let i = rest.length - 1; i > 0; i--) {             // Fisher-Yates
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    queue.current = rest;
    if (rest.length === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const preloadNext = () => {
      const n = queue.current[0];
      if (n) { const im = new window.Image(); im.src = n.foto; }   // evita el parpadeo al cambiar
    };
    preloadNext();

    const timer = setInterval(() => {
      if (paused.current || document.hidden) return;
      const incoming = queue.current.shift();
      if (!incoming) return;
      const slot = SLOT_ORDER[step.current++ % SLOT_ORDER.length] % tilesRef.current.length;
      queue.current.push(tilesRef.current[slot]);           // el que sale vuelve al final de la cola
      const next = tilesRef.current.slice();
      next[slot] = incoming;
      tilesRef.current = next;
      setTiles(next);
      preloadNext();
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [initial, pool]);

  const hold = () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); paused.current = true; };
  const release = (delay = 0) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { paused.current = false; }, delay);
  };

  return (
    <div
      className="hero-tiles"
      aria-label="Productos destacados"
      onMouseEnter={hold}
      onMouseLeave={() => release()}
      onFocus={hold}
      onBlur={() => release()}
      onTouchStart={hold}
      onTouchEnd={() => release(5000)}
    >
      {/* key = posición + id: al cambiar el producto, la tarjeta se remonta y vuelve a animarse */}
      {tiles.map((p, i) => (
        <Link
          key={`${i}-${p.id}`}
          href={`/catalogo/${p.id}`}
          className="hero-tile"
          style={initial[i]?.id === p.id ? { animationDelay: `${120 + i * 70}ms` } : undefined}
        >
          <div className="hero-tile-img">
            <Image
              src={p.foto}
              alt={p.nombre}
              fill
              sizes="(max-width: 900px) 45vw, 260px"
              style={{ objectFit: "contain" }}
              priority={i < 2}
            />
            {p.baja_pct ? (
              <DropBadge pct={p.baja_pct} style={{ position: "absolute", top: -4, left: -4, zIndex: 2 }} />
            ) : null}
          </div>
          <div className="hero-tile-meta">
            <span className="hero-tile-name">{p.nombre}</span>
            {p.precio > 0 && <span className="hero-tile-price">{money(p.precio)}</span>}
          </div>
        </Link>
      ))}
    </div>
  );
}
