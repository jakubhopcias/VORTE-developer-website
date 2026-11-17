"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Holds the last viewport of the page still, so the following footer can
 * scroll up over it. `top` has to be the overflow above one screen; a CSS
 * percentage here resolves against the viewport and sticks immediately.
 */
export default function PinBeforeFooter({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const viewport = window.innerHeight;
      const top = Math.min(0, viewport - el.offsetHeight);
      el.style.top = `${top}px`;
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className="sticky top-0 isolate z-0">
      {children}
    </div>
  );
}
