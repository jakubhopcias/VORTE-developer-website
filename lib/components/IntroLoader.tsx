"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import LogoMark from "@/lib/components/LogoMark";
import { emitIntroComplete, hasIntroCompleted } from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { syncViewportVars } from "@/lib/viewport";

const HERO_IMAGE = "/Silentium-building-reverse.jpg";

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
    const logo = root.querySelector<HTMLElement>("[data-intro='logo']");
    const bar = root.querySelector<HTMLElement>("[data-intro='bar']");
    const percentValue = root.querySelector<HTMLElement>(
      "[data-intro='percent-value']",
    );
    const meta = root.querySelector<HTMLElement>("[data-intro='meta']");
    const header = document.querySelector<HTMLElement>("[data-header]");
    const headerLogo = document.querySelector<HTMLElement>("[data-header-logo]");
    const headerNav = document.querySelector<HTMLElement>("[data-header-nav]");
    const headerBorder = document.querySelector<HTMLElement>(
      "[data-header-border]",
    );

    if (!curtain || !logo || !bar || !percentValue || !meta) return;

    let cancelled = false;
    const progress = { value: 0 };

    // scrollbar-gutter: stable already reserves space — don't add paddingRight
    // or the layout jumps when overflow is restored after the loader.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lockScroll();
    syncViewportVars(header);

    gsap.set(header, { autoAlpha: 0 });
    gsap.set([headerLogo, headerNav].filter(Boolean), { autoAlpha: 0 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    if (headerBorder) {
      gsap.set(headerBorder, { scaleX: 0, transformOrigin: "left center" });
    }
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

      const headerLogoMove = document.querySelector<HTMLElement>(
        "[data-header-logo-move]",
      );

      const exitTl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          if (cancelled) return;
          gsap.set(logo, { autoAlpha: 0 });
          gsap.set(headerLogoMove, { clearProps: "transform" });
          gsap.to(headerNav, {
            autoAlpha: 1,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => {
              gsap.set([header, headerLogo, headerNav].filter(Boolean), {
                clearProps: "opacity,visibility",
              });
            },
          });
          document.body.style.overflow = previousOverflow;
          unlockScroll();
          syncViewportVars(header);
          emitIntroComplete();
          setActive(false);
        },
      });

      exitTl
        .to(meta, { autoAlpha: 0, duration: 0.35 }, 0)
        .set(header, { autoAlpha: 1 }, 0.12)
        .to(
          curtain,
          {
            yPercent: -100,
            duration: 1.15,
            ease: "power2.inOut",
          },
          0.12,
        );

      if (headerBorder) {
        exitTl.to(
          headerBorder,
          {
            scaleX: 1,
            duration: 0.95,
            ease: "power2.inOut",
          },
          0.28,
        );
      }

      // Clip-slide: loader logo exits down, header logo enters from top.
      exitTl.to(
        logo,
        {
          yPercent: 130,
          duration: 0.55,
          ease: "power2.in",
        },
        0.18,
      );

      if (headerLogo && headerLogoMove) {
        gsap.set(headerLogo, { autoAlpha: 1 });
        exitTl.fromTo(
          headerLogoMove,
          { yPercent: -130 },
          {
            yPercent: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          0.52,
        );
      }
    };

    void run();

    return () => {
      cancelled = true;
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

      <div className="absolute inset-0 flex items-center justify-center px-section">
        <div className="w-[min(22rem,90vw)] text-primary-white">
          <div className="relative z-10 mx-auto w-fit overflow-hidden">
            <div data-intro="logo" className="will-change-transform">
              <LogoMark className="text-[2.5rem]" />
            </div>
          </div>
          <div data-intro="meta" className="mt-3 flex items-center gap-4">
            <div className="relative h-px min-w-0 flex-1 overflow-hidden bg-secondary-white/20">
              <div
                data-intro="bar"
                className="absolute inset-y-0 left-0 w-full bg-secondary-white will-change-transform"
              />
            </div>
            <div
              data-intro="percent"
              className="flex w-[2.75rem] shrink-0 items-baseline justify-end font-secondary text-[0.8125rem] leading-none text-secondary-white"
            >
              <span
                data-intro="percent-value"
                className="inline-block w-[1.75rem] text-right tabular-nums"
              >
                0
              </span>
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
