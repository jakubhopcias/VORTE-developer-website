import Image from "next/image";
import ApartmentTiles from "@/lib/components/Home/Silentium/ApartmentTiles";

export default function Silentium() {
  return (
    <div id="silentium" className="m-12 grid h-[85svh] min-h-0 grid-cols-12 overflow-hidden">
      <div className="col-span-6 flex h-full min-h-0 flex-col justify-center gap-16 p-8">
        <div className="flex shrink-0 flex-col">
          <p className="small font-primary tracking-[0.4em] text-secondary-white">
            Silentium apartments
          </p>
          <h2 className="headline mt-6">
            <span className=" text-secondary-white">An enclave of </span>
            <span className=" text-primary-white">total silence </span>
            <span className=" text-secondary-white">
              and monolithic concrete mass.
            </span>
          </h2>
          <p className="small mt-8 max-w-md text-secondary-white">
            Three residences in one poured volume. The Obsidian sits on the
            upper floors with a closed street facade. Monolith Garden opens
            onto a private courtyard. The Silent Horizon is a single-level
            terrace apartment facing the tree line.
          </p>
        </div>
        <ApartmentTiles />
      </div>
      <div className="relative col-span-6 flex h-full min-h-0 flex-col justify-end overflow-hidden rounded-xl p-12">
        <Image
          src="/Silentium-building.webp"
          alt="Silentium building"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black from-10% via-black/50 to-transparent" />
        <p className="subheading font-secondary frelative max-w-md text-primary-white">
          A masterclass in acoustic isolation and architectural mass. Designed
          for absolute privacy.
        </p>
      </div>
    </div>
  );
}
