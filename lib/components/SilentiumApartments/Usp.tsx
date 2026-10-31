import Image from "next/image";

export default function Usp() {
  return (
    <>
      <section className="grid grid-cols-1 gap-10 px-section py-section-y lg:h-svh lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-section">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:col-span-6 lg:aspect-auto lg:h-full lg:min-h-0">
          <Image
            src="/monolith-garden/Gemini_Generated_Image_azy184azy184azy1.jpg"
            alt="Enclosed living room with concrete walls"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">live private</p>
          <h2 className="headline mt-6 text-primary-white">
            <span className="text-secondary-white">
              You<span className="text-primary-white"> won’t know</span> you
              have
              <span className="text-primary-white"> neighbours</span>
            </span>
          </h2>
          <p className="small mt-8 max-w-md text-secondary-white">
            Acoustic isolation engineered at a structural level. Multi-layer
            monolithic concrete walls and triple-glazed panoramic facades create
            an absolute perimeter of silence.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-10 px-section py-section-y lg:h-svh lg:gap-0 lg:py-section">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-end lg:gap-y-6">
          <p className="eyebrow lg:col-span-12">
            intelligence without interface
          </p>
          <h2 className="headline text-primary-white lg:col-span-6">
            Invisible technology. Absolute control.
          </h2>
          <p className="small max-w-md text-secondary-white lg:col-span-4 lg:col-start-7">
            Climate, security, and lighting integrated invisibly beneath raw
            architectural surfaces. No visible panels, no blinking LEDs—just
            responsive living spaces that anticipate your presence.
          </p>
        </div>
        <div className="relative mt-0 aspect-[4/5] min-h-0 overflow-hidden rounded-3xl lg:mt-12 lg:aspect-auto lg:min-h-0 lg:flex-1">
          <Image
            src="/obsidian/Gemini_Generated_Image_txtskjtxtskjtxts.jpg"
            alt="Bedroom opening onto trees"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 px-section py-section-y lg:h-svh lg:grid-cols-12 lg:gap-x-8 lg:py-section">
        <div className="flex min-h-0 flex-col lg:col-span-6">
          <p className="eyebrow">No corridors</p>
          <h2 className="headline mt-6 text-primary-white">
            Zero wasted space. Pure flow.
          </h2>
          <div className="relative mt-10 aspect-[4/5] min-h-0 overflow-hidden rounded-3xl lg:aspect-auto lg:flex-1">
            <Image
              src="/smart-home.jpg"
              alt="Living room wall with a screen"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-8 lg:col-span-6 lg:gap-0">
          <div className="relative aspect-[4/5] min-h-0 overflow-hidden rounded-3xl lg:aspect-auto lg:flex-1">
            <Image
              src="/concrete-and-chair.png"
              alt="Concrete wall with a lounge chair"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <p className="small max-w-md text-secondary-white lg:mt-6">
            Direct private elevator access opening straight into the residence.
            Internal layouts designed for maximum spatial continuity, completely
            eliminating dark hallways and transitional bottlenecks.
          </p>
        </div>
      </section>
    </>
  );
}
