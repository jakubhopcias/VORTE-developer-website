import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-svh overflow-hidden flex flex-col justify-end bg-black">
      <Image
        src="/Silentium-building.webp"
        alt="Silentium apartments in Zurich"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent" />

      <div className="relative mx-auto grid grid-cols-12 gap-12 h-fit items-end px-12 pt-24 pb-12">
        <div className="col-span-6 flex flex-col gap-4 items-end gap-y-16">
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

        <div className="col-span-4 col-start-9 flex flex-col justify-between h-full">
          <p className=" col-span-4 max-w-prose col-start-9 ">
            Ready-to-move-in stealth wealth residences (75–160 m²). Raw
            brutalism softened by nature, uncompromising acoustic insulation,
            and absolute privacy.
          </p>
          <button
            type="button"
            className="small w-fit rounded-xl text-nowrap bg-primary-white px-5 py-3 font-medium text-black transition-opacity hover:opacity-90"
          >
            See apartments
          </button>
        </div>
      </div>
    </section>
  );
}
