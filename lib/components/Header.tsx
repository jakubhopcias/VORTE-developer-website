import Image from "next/image";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="pointer-events-none sticky top-0 z-50 col-span-full row-start-1 h-fit self-start px-section pt-6 lg:col-span-6 lg:col-start-4 lg:px-0">
      <div className="pointer-events-auto flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-primary-white/40 bg-black/40 px-3 py-2 backdrop-blur-md sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-3 lg:rounded-full">
        <Image
          src="/logo.svg"
          alt="VORTE"
          width={62}
          height={13}
          priority
          unoptimized
          className="h-[0.8125rem] w-auto shrink-0"
        />
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="btn btn-primary max-sm:px-3 max-sm:py-2"
          >
            Schedule audience
          </button>
          <button
            type="button"
            className="btn btn-outline max-sm:px-3 max-sm:py-2"
            aria-label="Menu"
          >
            <span className="max-sm:sr-only">Menu</span>
            <Menu className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
