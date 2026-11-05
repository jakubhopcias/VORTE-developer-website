import Image from "next/image";

export default function Intelligence() {
  return (
    <section className="flex h-svh flex-col gap-10 px-section py-section-y lg:gap-8 lg:py-section">
      <div className="flex shrink-0 flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-end">
        <p className="eyebrow lg:col-span-12">Intelligence without interface</p>
        <h2 className="headline text-primary-white lg:col-span-6">
          Invisible technology.{" "}
          <span className="text-secondary-white">Absolute control.</span>
        </h2>
        <p className="small max-w-md text-secondary-white lg:col-span-4 lg:col-start-8">
          Climate, security, and lighting integrated invisibly beneath raw
          architectural surfaces. No visible panels, no blinking LEDs—just
          responsive living spaces that anticipate your presence.
        </p>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
        <Image
          src="/obsidian/Gemini_Generated_Image_txtskjtxtskjtxts.jpg"
          alt="Bedroom opening onto trees"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
