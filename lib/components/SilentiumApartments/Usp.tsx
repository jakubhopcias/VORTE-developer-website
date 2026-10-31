import Image from "next/image";

export default function Usp() {
  return (
    <>
      <section className="grid h-svh grid-cols-12 items-center px-section py-section">
        <div className="relative col-span-6 h-full min-h-0 overflow-hidden rounded-3xl">
          <Image
            src="/monolith-garden/Gemini_Generated_Image_azy184azy184azy1.jpg"
            alt="Enclosed living room with concrete walls"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="col-span-6 pl-16">
          <p className="eyebrow text-secondary-white">live private</p>
          <h2 className="headline mt-8 text-primary-white">
            <span className="block">You won’t know you have</span>
            <span className="block">neighbours</span>
          </h2>
          <p className="small mt-8 max-w-md leading-relaxed text-secondary-white">
            Acoustic isolation engineered at a structural level. Multi-layer
            monolithic concrete walls and triple-glazed panoramic facades
            create an absolute perimeter of silence.
          </p>
        </div>
      </section>

      <section className="flex h-svh flex-col px-section py-section">
        <div className="grid grid-cols-12 items-end gap-y-8">
          <p className="eyebrow col-span-12 text-secondary-white">
            intelligence without interface
          </p>
          <h2 className="headline col-span-5 text-primary-white">
            <span className="block">Invisible technology.</span>
            <span className="block">Absolute control.</span>
          </h2>
          <p className="small col-span-4 col-start-9 max-w-md leading-relaxed text-secondary-white">
            Climate, security, and lighting integrated invisibly beneath raw
            architectural surfaces. No visible panels, no blinking LEDs—just
            responsive living spaces that anticipate your presence.
          </p>
        </div>
        <div className="relative mt-12 min-h-0 flex-1 overflow-hidden rounded-3xl">
          <Image
            src="/obsidian/Gemini_Generated_Image_txtskjtxtskjtxts.jpg"
            alt="Bedroom opening onto trees"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="grid h-svh grid-cols-12 gap-x-8 px-section py-section">
        <div className="col-span-6 flex min-h-0 flex-col">
          <p className="eyebrow text-secondary-white">no corridors</p>
          <h2 className="headline mt-8 text-primary-white">
            <span className="block">Zero wasted space. Pure</span>
            <span className="block">flow.</span>
          </h2>
          <div className="relative mt-10 min-h-0 flex-1 overflow-hidden rounded-3xl">
            <Image
              src="/smart-home.jpg"
              alt="Living room wall with a screen"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="col-span-6 flex min-h-0 flex-col">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl">
            <Image
              src="/concrete-and-chair.png"
              alt="Concrete wall with a lounge chair"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <p className="small mt-6 max-w-md leading-relaxed text-secondary-white">
            Direct private elevator access opening straight into the residence.
            Internal layouts designed for maximum spatial continuity, completely
            eliminating dark hallways and transitional bottlenecks.
          </p>
        </div>
      </section>
    </>
  );
}
