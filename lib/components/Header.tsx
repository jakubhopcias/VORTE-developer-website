"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoMark from "@/lib/components/LogoMark";
import HamburgerMark from "@/lib/components/HamburgerMark";
import SiteMenu from "@/lib/components/SiteMenu";
import { onIntroComplete } from "@/lib/intro";
import { HEADER_OVER_HERO_EVENT } from "@/lib/silentium-transition";
import { getViewportHeight, syncViewportVars } from "@/lib/viewport";

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [snapChrome, setSnapChrome] = useState(false);

  useEffect(() => {
    syncViewportVars();

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
  }, []);

  const solidChrome = pastHero || menuOpen;

  return (
    <>
      <header
        data-header
        className={`pointer-events-none col-span-full row-start-1 h-fit w-full self-start px-section ${
          menuOpen
            ? "fixed inset-x-0 top-0 z-[90] mt-0 bg-[var(--color-black)]"
            : `relative sticky top-0 z-50 mt-[calc(var(--app-vh,100svh)/2-var(--header-h,57px))] ${
                snapChrome ? "" : "transition-colors duration-300"
              } ${solidChrome ? "bg-[var(--color-black)]" : "bg-transparent"}`
        }`}
      >
        <div
          className={`pointer-events-auto relative flex h-[57px] w-full min-w-0 items-center justify-between gap-4 text-primary-white ${
            menuOpen || solidChrome ? "" : "mix-blend-difference"
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
          <button
            type="button"
            data-header-menu
            onClick={() => setMenuOpen((open) => !open)}
            className="group inline-flex items-center gap-2 text-primary-white duration-300"
            aria-label={menuOpen ? "Close menu" : "Menu"}
            aria-expanded={menuOpen}
          >
            <span className="small">{menuOpen ? "Close" : "Menu"}</span>
            {!menuOpen && <HamburgerMark className="h-2.5 w-auto" />}
          </button>
        </div>
        <div
          data-header-border
          className={`absolute inset-x-0 bottom-0 h-px origin-left bg-tertiary-white will-change-transform ${
            snapChrome || menuOpen ? "" : "transition-opacity duration-300"
          } ${solidChrome || menuOpen ? "opacity-0" : "opacity-100"}`}
        />
      </header>
      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
