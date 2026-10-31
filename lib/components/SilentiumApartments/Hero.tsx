import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex h-svh flex-col justify-end overflow-hidden bg-black">
      <Image
        src="/Silentium-building.webp"
        alt="Silentium apartments in Zurich"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent" />

      <div className="relative mx-auto grid h-fit grid-cols-12 items-end gap-12 px-section pb-section pt-section-top">
        <div className="col-span-6 flex flex-col items-end gap-4 gap-y-16">
          <h1 className="display w-full text-primary-white">
            <span className="block text-secondary-white">The only sound</span>
            <span className="block text-secondary-white">
              you’ll hear is the{" "}
            </span>
            <span className="block">
              <span className="text-secondary-white">one</span> you choose
            </span>
          </h1>
        </div>

        <div className="col-span-4 col-start-9 flex h-full flex-col justify-between">
          <p className="max-w-prose">
            Ready-to-move-in stealth wealth residences (75–160 m²). Raw
            brutalism softened by nature, uncompromising acoustic insulation,
            and absolute privacy.
          </p>
          <button type="button" className="btn-primary text-nowrap">
            See apartments
          </button>
        </div>
      </div>
    </section>
  );
}
