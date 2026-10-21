import Image from "next/image";
import { Menu, Volume2 } from "lucide-react";

export default function Header() {
  return (
    <header className=" sticky top-0 z-50 col-start-4 col-span-6  row-start-1 h-fit self-start pt-6">
      <div className="pointer-events-auto flex items-center justify-between gap-4 rounded-full border border-primary-white/40 bg-black/40 py-3 px-6 backdrop-blur-md">
        <Image
          src="/logo.svg"
          alt="VORTE"
          width={62}
          height={13}
          priority
          unoptimized
          className="h-[0.8125rem] w-auto"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="small rounded-xl font-medium bg-primary-white px-5 py-2.5 text-black"
          >
            Schedule audience
          </button>
          <button
            type="button"
            className="small inline-flex items-center gap-2 rounded-xl border border-primary-white/70 px-4 py-2.5 text-primary-white"
          >
            Mute
            <Volume2 className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            className="small inline-flex items-center gap-2 rounded-xl border border-primary-white/70 px-4 py-2.5 text-primary-white"
          >
            Menu
            <Menu className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
