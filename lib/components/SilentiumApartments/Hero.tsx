import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-svh overflow-hidden bg-black">
      <Image
        src="/Silentium-building.webp"
        alt="Silentium apartments in Zurich"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-[85%] bg-linear-to-t from-black via-black/70 to-transparent md:h-2/3 md:via-black/40" />

      <div className="relative mx-auto flex h-full items-end px-section py-section-y">
        <div className="flex w-full flex-col gap-6 md:gap-10 lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1 className="display lg:col-span-6">
            <span className=" text-secondary-white">
              The only sound you’ll hear is the
            </span>
            <span className="text-primary-white"> you choose</span>
          </h1>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-8 col-span-4 xl:col-span-3 xl:col-start-7 lg:h-full lg:flex-col lg:items-start lg:justify-between">
            <p className="small max-w-prose text-secondary-white">
              Ready-to-move-in stealth wealth residences (75–160 m²). Raw
              brutalism softened by nature, uncompromising acoustic insulation,
              and absolute privacy.
            </p>
            <a href="#apartments" className="btn btn-primary shrink-0">
              See apartments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
