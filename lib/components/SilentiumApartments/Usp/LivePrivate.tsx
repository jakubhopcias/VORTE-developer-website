import Image from "next/image";

export default function LivePrivate() {
  return (
    <section className="grid h-svh grid-cols-1 gap-10 px-section py-section-y lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-section">
      <div className="relative min-h-0 overflow-hidden rounded-xl max-lg:aspect-[4/5] lg:col-span-6 lg:h-full">
        <Image
          src="/monolith-garden/Gemini_Generated_Image_azy184azy184azy1.jpg"
          alt="Enclosed living room with concrete walls"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="lg:col-span-5 lg:col-start-8">
        <p className="eyebrow">Live private</p>
        <h2 className="headline mt-6 text-primary-white">
          <span className="text-secondary-white">You</span>
          <span className="text-primary-white"> won&apos;t know</span>
          <span className="text-secondary-white"> you have</span>
          <span className="text-primary-white"> neighbours</span>
        </h2>
        <p className="small mt-8 max-w-md text-secondary-white">
          Acoustic isolation engineered at a structural level. Multi-layer
          monolithic concrete walls and triple-glazed panoramic facades create
          an absolute perimeter of silence.
        </p>
      </div>
    </section>
  );
}
