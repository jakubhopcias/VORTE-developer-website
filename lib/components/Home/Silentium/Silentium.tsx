import Image from "next/image";
import Link from "next/link";
import ApartmentTiles from "@/lib/components/Home/Silentium/ApartmentTiles";

export default function Silentium() {
  return (
    <div
      id="silentium"
      className="flex flex-col gap-8 px-section py-section-y lg:h-svh lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-8 lg:overflow-hidden lg:p-section"
    >
      <div className="contents lg:flex lg:w-1/2 lg:min-h-0 lg:flex-col lg:justify-center lg:gap-16">
        <div className="order-1">
          <p className="eyebrow">Silentium apartments</p>
          <h2 className="headline mt-6">
            <span className="text-secondary-white">An enclave of </span>
            <span className="text-primary-white">total silence </span>
            <span className="text-secondary-white">
              and monolithic concrete mass.
            </span>
          </h2>
          <p className="small mt-8 max-w-md text-secondary-white">
            Three residences in one poured volume. The Obsidian sits on the
            upper floors with a closed street facade. Monolith Garden opens onto
            a private courtyard. The Silent Horizon is a single-level terrace
            apartment facing the tree line.
          </p>
        </div>

        <div className="order-3 lg:order-2">
          <ApartmentTiles />
        </div>
      </div>

      <div className="relative order-2 flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl p-section lg:w-1/2 lg:aspect-auto lg:h-full lg:min-h-0">
        <Image
          src="/Silentium-building.webp"
          alt="Silentium building"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover lg:border-l lg:border-primary-white"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 via-40% to-transparent to-65% lg:bg-gradient-to-tr lg:from-black/55 lg:via-black/20 lg:via-45% lg:to-transparent lg:to-75%" />
        <p className="subheading font-secondary relative max-w-md text-primary-white">
          A masterclass in acoustic isolation and architectural mass. Designed
          for absolute privacy.
        </p>
        <Link
          href="/silentium-apartments"
          className="absolute inset-0 z-10"
          aria-label="View Silentium apartments"
        />
      </div>
    </div>
  );
}
