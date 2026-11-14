"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoMark from "@/lib/components/LogoMark";
import {
  HEADER_CHROME_EVENT,
  type HeaderChromeDetail,
} from "@/lib/header-chrome";
import { onIntroComplete } from "@/lib/intro";
import {
  HEADER_OVER_HERO_EVENT,
  SILENTIUM_HREF,
} from "@/lib/silentium-transition";
import { getViewportHeight, syncViewportVars } from "@/lib/viewport";

gsap.registerPlugin(ScrollTrigger);

/** Same duration both ways — leave accelerates up, return settles down. */
const HEADER_CHROME_DURATION = 0.28;

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onSilentium = pathname === SILENTIUM_HREF;
  const [pastHero, setPastHero] = useState(!isHome);
  const [snapChrome, setSnapChrome] = useState(false);
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

  useEffect(() => {
    syncViewportVars();

    if (!isHome) {
      setPastHero(true);
      setSnapChrome(false);
      return;
    }

    setPastHero(false);

    const onResize = () => syncViewportVars();
    const onOverHero = () => {
      setSnapChrome(true);
      setPastHero(false);
      requestAnimationFrame(() => setSnapChrome(false));
    };

    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.addEventListener(HEADER_OVER_HERO_EVENT, onOverHero);
    const unsubscribeIntro = onIntroComplete(() => {
      syncViewportVars();
      ScrollTrigger.refresh();
    });

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setPastHero(self.scroll() >= getViewportHeight());
      },
      onRefresh: (self) => {
        syncViewportVars();
        setPastHero(self.scroll() >= getViewportHeight());
      },
    });

    setPastHero(st.scroll() >= getViewportHeight());

    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener(HEADER_OVER_HERO_EVENT, onOverHero);
      unsubscribeIntro();
      st.kill();
    };
  }, [isHome]);

  const solidChrome = isHome ? pastHero : true;

  return (
    <header
      data-header
      className={`pointer-events-none col-span-full row-start-1 h-fit w-full self-start relative sticky top-0 z-50 overflow-hidden ${
        isHome
          ? "mt-[calc(var(--app-vh,100svh)/2-var(--header-h,57px))]"
          : ""
      }`}
    >
      <div
        ref={chromeRef}
        data-header-chrome
        className={`relative px-section ${
          snapChrome ? "" : "transition-colors duration-300"
        } ${solidChrome ? "bg-[var(--color-black)]" : "bg-transparent"}`}
      >
        <div
          className={`pointer-events-auto relative flex h-[57px] w-full min-w-0 items-center justify-between gap-6 text-primary-white ${
            solidChrome ? "" : "mix-blend-difference"
          }`}
        >
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

          <nav
            data-header-nav
            aria-label="Primary"
            className="flex shrink-0 items-center gap-6 sm:gap-8"
          >
            {!onSilentium ? (
              <Link href={SILENTIUM_HREF} className="small text-primary-white">
                Silentium residences
              </Link>
            ) : null}
            <a href="/#footer" className="small text-primary-white">
              Enquiry
            </a>
          </nav>
        </div>
        <div
          data-header-border
          className={`absolute inset-x-0 bottom-0 h-px origin-left bg-primary-white will-change-transform ${
            snapChrome ? "" : "transition-opacity duration-300"
          } ${solidChrome ? "opacity-0" : "opacity-100"}`}
        />
      </div>
    </header>
  );
}
