"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import LogoMark from "@/lib/components/LogoMark";
import {
  HEADER_CHROME_EVENT,
  type HeaderChromeDetail,
} from "@/lib/header-chrome";
/** Same duration both ways — leave accelerates up, return settles down. */
const HEADER_CHROME_DURATION = 0.28;

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const chromeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onChrome = (event: Event) => {
      const detail = (event as CustomEvent<HeaderChromeDetail>).detail;
      detail.accept();
      const chrome = chromeRef.current;
      if (!chrome) {
        detail.done();
        return;
      }

      if (detail.immediate) {
        gsap.killTweensOf(chrome);
        gsap.set(chrome, { clearProps: "transform,opacity,visibility" });
        detail.done();
        return;
      }

      gsap.killTweensOf(chrome);
      if (detail.hidden) {
        gsap.set(chrome, { yPercent: 0, autoAlpha: 1 });
        gsap.to(chrome, {
          yPercent: -100,
          duration: HEADER_CHROME_DURATION,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(chrome, { autoAlpha: 0 });
            detail.done();
          },
        });
        return;
      }

      gsap.set(chrome, { yPercent: -100, autoAlpha: 1 });
      gsap.to(chrome, {
        yPercent: 0,
        duration: HEADER_CHROME_DURATION,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          gsap.set(chrome, { clearProps: "transform,opacity,visibility" });
          detail.done();
        },
      });
    };

    window.addEventListener(HEADER_CHROME_EVENT, onChrome);
    return () => {
      window.removeEventListener(HEADER_CHROME_EVENT, onChrome);
      const chrome = chromeRef.current;
      if (!chrome) return;
      gsap.killTweensOf(chrome);
      gsap.set(chrome, { clearProps: "transform,opacity,visibility" });
    };
  }, []);

  if (!isHome) return null;

  return (
    <header
      data-header
      className="pointer-events-none relative z-50 col-span-full row-start-1 mt-[calc(var(--app-vh,100svh)/2-var(--header-h,57px))] h-fit w-full self-start overflow-hidden"
    >
      <div
        ref={chromeRef}
        data-header-chrome
        className="relative bg-transparent px-section"
      >
        <div className="pointer-events-auto relative flex h-[57px] w-full min-w-0 items-center text-primary-white mix-blend-difference">
          <Link
            href="/"
            data-header-logo
            aria-label="Vørte home"
            className="shrink-0 overflow-hidden text-primary-white"
          >
            <div data-header-logo-move className="will-change-transform">
              <LogoMark />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
