import Image from "next/image";

export default function NoCorridors() {
  return (
    <section className="grid h-svh grid-cols-1 gap-10 px-section py-section-y lg:grid-cols-12 lg:gap-8 lg:py-section">
      <div className="flex min-h-0 flex-col lg:col-span-6">
        <p className="eyebrow shrink-0">No corridors</p>
        <h2 className="headline mt-6 shrink-0 text-primary-white">
          Zero wasted space.{" "}
          <span className="text-secondary-white">Pure flow.</span>
        </h2>
        <div className="relative mt-10 min-h-0 flex-1 overflow-hidden rounded-xl max-lg:aspect-[4/5] lg:mt-8">
          <Image
            src="/smart-home.jpg"
            alt="Living room wall with a screen"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex min-h-0 flex-col gap-8 lg:col-span-6 lg:justify-between">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl max-lg:aspect-[4/5]">
          <Image
            src="/concrete-and-chair.png"
            alt="Concrete wall with a lounge chair"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <p className="small max-w-md shrink-0 text-secondary-white">
          Direct private elevator access opening straight into the residence.
          Internal layouts designed for maximum spatial continuity, completely
          eliminating dark hallways and transitional bottlenecks.
        </p>
      </div>
    </section>
  );
}
