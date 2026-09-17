"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type State = "idle" | "loading" | "done";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<State>("idle");
  const [width, setWidth] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isLoading = useRef(false);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function schedule(fn: () => void, delay: number) {
    const t = setTimeout(fn, delay);
    timers.current.push(t);
    return t;
  }

  // Detect link clicks → start progress
  useEffect(() => {
    function onLinkClick(e: MouseEvent) {
      const anchor = (e.composedPath()[0] as Element)?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor?.href) return;
      try {
        const url = new URL(anchor.href);
        if (url.origin !== location.origin) return;
        if (anchor.target === "_blank") return;
        if (url.pathname + url.search === location.pathname + location.search) return;
      } catch {
        return;
      }

      clearTimers();
      isLoading.current = true;
      setState("loading");
      setWidth(0);
      schedule(() => setWidth(22), 60);
      schedule(() => setWidth(52), 400);
      schedule(() => setWidth(74), 900);
      schedule(() => setWidth(86), 2000);
    }

    document.addEventListener("click", onLinkClick);
    return () => {
      document.removeEventListener("click", onLinkClick);
      clearTimers();
    };
  }, []);

  // Complete progress when route finishes
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!isLoading.current) return;

    isLoading.current = false;
    clearTimers();
    setWidth(100);
    setState("done");
    schedule(() => {
      setState("idle");
      setWidth(0);
    }, 550);
  }, [pathname]);

  if (state === "idle") return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2.5,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)",
          borderRadius: "0 2px 2px 0",
          boxShadow: "0 0 12px var(--accent-glow), 0 0 4px var(--accent)",
          transition:
            state === "done"
              ? "width 0.22s ease, opacity 0.35s ease 0.2s"
              : "width 0.65s ease",
          opacity: state === "done" ? 0 : 1,
        }}
      />
    </div>
  );
}
