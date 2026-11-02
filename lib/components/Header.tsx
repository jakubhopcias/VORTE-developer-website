import { Menu } from "lucide-react";
import LogoMark from "@/lib/components/LogoMark";

export default function Header() {
  return (
    <header
      data-header
      className="pointer-events-none relative sticky top-0 z-50 col-span-full row-start-1 mt-[calc(50svh-57px)] h-fit w-full self-start px-section"
    >
      <div className="pointer-events-auto relative flex h-[57px] w-full min-w-0 items-center justify-between gap-4 mix-blend-difference">
        <div data-header-logo className="shrink-0 text-white">
          <LogoMark className="h-[0.8125rem] w-auto" />
          <span className="sr-only">VORTE</span>
        </div>
        <button
          type="button"
          data-header-menu
          className="inline-flex items-center gap-2 text-white transition-opacity hover:opacity-80"
          aria-label="Menu"
        >
          <span className="small">Menu</span>
          <Menu className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <div
        data-header-border
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-tertiary-white will-change-transform"
      />
    </header>
  );
}
