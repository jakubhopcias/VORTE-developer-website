"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import LogoMark from "@/lib/components/LogoMark";
import {
  emitIntroComplete,
  emitIntroReveal,
  hasIntroCompleted,
} from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { syncViewportVars } from "@/lib/viewport";

const HERO_IMAGE = "/private-door.jpg";

export default function IntroLoader() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(
    () => pathname === "/" && !hasIntroCompleted(),
  );

  useLayoutEffect(() => {
    if (pathname !== "/") {
      setActive(false);
      emitIntroComplete();
      return;
    }

    if (hasIntroCompleted()) {
      setActive(false);
      const header = document.querySelector<HTMLElement>("[data-header]");
      if (header) gsap.set(header, { clearProps: "opacity,visibility" });
      emitIntroComplete();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const curtain = root.querySelector<HTMLElement>("[data-intro='curtain']");
    const chrome = root.querySelector<HTMLElement>("[data-intro='chrome']");
    const bar = root.querySelector<HTMLElement>("[data-intro='bar']");
    const percentValue = root.querySelector<HTMLElement>(
      "[data-intro='percent-value']",
    );
    const percent = root.querySelector<HTMLElement>("[data-intro='percent']");
    const header = document.querySelector<HTMLElement>("[data-header]");
    const headerLogo = document.querySelector<HTMLElement>("[data-header-logo]");

    if (!curtain || !chrome || !bar || !percentValue || !percent) {
      return;
    }

    let cancelled = false;
    const progress = { value: 0 };

    // Intro always opens at the top. Kill restore attempts while the curtain is up.
    history.scrollRestoration = "manual";
    const pinTop = () => window.scrollTo(0, 0);
    pinTop();
    window.addEventListener("scroll", pinTop);

    // scrollbar-gutter: stable already reserves space — don't add paddingRight
    // or the layout jumps when overflow is restored after the loader.
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    lockScroll();
    syncViewportVars(header);

    const blockWheel = (event: WheelEvent | TouchEvent) => {
      event.preventDefault();
    };
    window.addEventListener("wheel", blockWheel, { passive: false });
    window.addEventListener("touchmove", blockWheel, { passive: false });

    gsap.set(header, { autoAlpha: 0 });
    gsap.set([headerLogo].filter(Boolean), { autoAlpha: 0 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    percentValue.textContent = "0";

    const preload = new Promise<void>((resolve) => {
      const img = new window.Image();
      img.src = HERO_IMAGE;
      if (img.complete) {
        resolve();
        return;
      }
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    const fontsReady =
      "fonts" in document
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();

    const run = async () => {
      await Promise.all([preload, fontsReady]);
      if (cancelled) return;

      const loadTl = gsap.timeline();

      loadTl.to(progress, {
        value: 100,
        duration: 1.45,
        ease: "power4.out",
        onUpdate: () => {
          const value = Math.round(progress.value);
          gsap.set(bar, { scaleX: value / 100 });
          percentValue.textContent = `${value}`;
        },
      });

      await loadTl.then();
      if (cancelled) return;

      const exitTl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          if (cancelled) return;
          gsap.set([header, headerLogo].filter(Boolean), {
            clearProps: "opacity,visibility",
            autoAlpha: 1,
          });
          document.documentElement.style.overflow = previousHtmlOverflow;
          document.body.style.overflow = previousOverflow;
          window.removeEventListener("wheel", blockWheel);
          window.removeEventListener("touchmove", blockWheel);
          unlockScroll();
          pinTop();
          window.removeEventListener("scroll", pinTop);
          syncViewportVars(header);
          emitIntroComplete();
          setActive(false);
        },
      });

      exitTl
        .to([percent, bar], { autoAlpha: 0, duration: 0.35 }, 0)
        .to(
          curtain,
          {
            yPercent: -100,
            duration: 1.15,
            ease: "power2.inOut",
            onStart: () => {
              if (!cancelled) emitIntroReveal();
            },
          },
          0.12,
        );
    };

    void run();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", pinTop);
      window.removeEventListener("wheel", blockWheel);
      window.removeEventListener("touchmove", blockWheel);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      unlockScroll();
    };
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto fixed inset-0 z-[100]"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        data-intro="curtain"
        className="absolute inset-0 bg-black will-change-transform"
      />

      {/* Same band as the home header — logo lands where it stays. */}
      <div
        data-intro="chrome"
        className="absolute inset-x-0 top-[calc(var(--app-vh,100svh)/2-var(--header-h,57px))] px-section"
      >
        <div className="relative flex h-[57px] w-full min-w-0 items-center gap-6 text-primary-white">
          <div data-intro="logo" className="shrink-0">
            <LogoMark />
          </div>

          <div className="relative h-px min-w-0 flex-1 overflow-hidden">
            <div
              data-intro="bar"
              className="absolute inset-y-0 left-0 w-full origin-left bg-primary-white will-change-transform"
            />
          </div>

          <div
            data-intro="percent"
            className="w-[3.5ch] shrink-0 text-right font-secondary text-[28px] leading-none tabular-nums tracking-tight text-primary-white md:text-[32px]"
          >
            <span data-intro="percent-value">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
