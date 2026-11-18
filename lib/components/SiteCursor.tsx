"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const FINE = "(pointer: fine)";
/** Match Lenis weight (0.09) — light lag, still readable for actions. */
const CURSOR_LERP = 0.12;
const SETTLE = 0.1;

type CursorApi = {
  enabled: boolean;
  setLabel: (label: string | null) => void;
};

const CursorContext = createContext<CursorApi>({
  enabled: false,
  setLabel: () => {},
});

export function useSiteCursor() {
  return useContext(CursorContext);
}

/** Marks a region that shows an action label beside the site cursor. */
export function CursorHotspot({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const { enabled, setLabel } = useSiteCursor();

  return (
    <div
      className={className}
      onPointerEnter={(event) => {
        if (!enabled || event.pointerType !== "mouse") return;
        setLabel(label);
      }}
      onPointerLeave={() => {
        if (!enabled) return;
        setLabel(null);
      }}
    >
      {children}
    </div>
  );
}

/**
 * Global cream crosshair. Replaces the system cursor on fine pointers.
 * Hotspots push a short action label via CursorHotspot.
 */
export default function SiteCursor({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelMoveRef = useRef<HTMLSpanElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const readyRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabelState] = useState<string | null>(null);
  const [shownLabel, setShownLabel] = useState<string | null>(null);
  const [labelOpen, setLabelOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const setLabel = useCallback((next: string | null) => {
    setLabelState(next);
  }, []);

  useEffect(() => {
    const fine = window.matchMedia(FINE);
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (!enabled) {
      root.classList.remove("has-site-cursor");
      root.style.removeProperty("cursor");
      body.style.removeProperty("cursor");
      readyRef.current = false;
      setReady(false);
      setLabelState(null);
      return;
    }

    root.classList.add("has-site-cursor");
    root.style.setProperty("cursor", "none", "important");
    body.style.setProperty("cursor", "none", "important");

    return () => {
      root.classList.remove("has-site-cursor");
      root.style.removeProperty("cursor");
      body.style.removeProperty("cursor");
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      const el = rootRef.current;
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;

      if (Math.abs(dx) < SETTLE && Math.abs(dy) < SETTLE) {
        current.current.x = target.current.x;
        current.current.y = target.current.y;
      } else {
        current.current.x += dx * CURSOR_LERP;
        current.current.y += dy * CURSOR_LERP;
      }

      if (el) {
        el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.current = { x: event.clientX, y: event.clientY };
      if (!readyRef.current) {
        current.current = { x: event.clientX, y: event.clientY };
        readyRef.current = true;
        setReady(true);
      }
    };

    const onLeave = () => {
      readyRef.current = false;
      setReady(false);
    };

    raf.current = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  useEffect(() => {
    if (label) {
      setShownLabel(label);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setLabelOpen(true));
      });
      return () => cancelAnimationFrame(id);
    }

    setLabelOpen(false);
    const clear = window.setTimeout(() => setShownLabel(null), 520);
    return () => window.clearTimeout(clear);
  }, [label]);

  return (
    <CursorContext.Provider value={{ enabled, setLabel }}>
      {children}
      {enabled ? (
        <div
          ref={rootRef}
          aria-hidden
          className={`pointer-events-none fixed top-0 left-0 z-[200] transition-opacity duration-150 ease-out will-change-transform ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-primary-white" />
            <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-primary-white" />
          </span>
          {shownLabel ? (
            <span className="xs absolute top-0 left-0 translate-x-3.5 -translate-y-1/2 overflow-hidden text-primary-white">
              <span
                ref={labelMoveRef}
                className={`inline-block whitespace-nowrap will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  labelOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                {shownLabel}
              </span>
            </span>
          ) : null}
        </div>
      ) : null}
    </CursorContext.Provider>
  );
}
