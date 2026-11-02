"use client";

import { useState } from "react";
import LogoMark from "@/lib/components/LogoMark";
import HamburgerMark from "@/lib/components/HamburgerMark";
import SiteMenu from "@/lib/components/SiteMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        data-header
        className="pointer-events-none relative sticky top-0 z-50 col-span-full row-start-1 mt-[calc(50svh-57px)] h-fit w-full self-start px-section"
      >
        <div className="pointer-events-auto relative flex h-[57px] w-full min-w-0 items-center justify-between gap-4 mix-blend-difference">
          <div data-header-logo className="shrink-0 text-primary-white">
            <LogoMark className="h-[0.8125rem] w-auto" />
            <span className="sr-only">VORTE</span>
          </div>
          <button
            type="button"
            data-header-menu
            onClick={() => setMenuOpen(true)}
            className="group inline-flex items-center gap-2 text-secondary-white transition-colors duration-500 hover:text-primary-white"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className="small">Menu</span>
            <HamburgerMark className="h-2.5 w-auto" />
          </button>
        </div>
        <div
          data-header-border
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-tertiary-white will-change-transform"
        />
      </header>
      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
