import Image from "next/image";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="pointer-events-none sticky top-0 z-50 col-span-full row-start-1 mt-[calc(50svh-57px)] border-b border-tertiary-white h-fit w-full self-start px-section">
      <div className="pointer-events-auto flex h-[57px] w-full min-w-0 items-center justify-between gap-4 ">
        <Image
          src="/logo.svg"
          alt="VORTE"
          width={62}
          height={13}
          priority
          unoptimized
          className="h-[0.8125rem] w-auto shrink-0"
        />
        <button
          type="button"
          className="inline-flex items-center gap-2 text-primary-white transition-opacity hover:opacity-80"
          aria-label="Menu"
        >
          <span className="small">Menu</span>
          <Menu className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </header>
  );
}
