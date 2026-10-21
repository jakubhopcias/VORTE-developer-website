import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-svh overflow-hidden bg-black">
        <Image
          src="/Silentium-building-reverse.jpg"
          alt="The Obsidian Penthouse building"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent" />

        <div className="relative mx-auto flex h-full items-end pb-12 pt-24 px-12">
          
          <div className="grid grid-cols-12 w-full items-end">
            
            <h1 className="display col-span-6">
              <span className="block text-secondary-white">We build for</span>
              <span className="block text-primary-white">the few.</span>
              <span className="block text-secondary-white">Hidden from</span>
              <span className="block text-primary-white">the world.</span>
            </h1>

            <div className="col-span-4 h-full col-start-9 flex flex-col items-start justify-between gap-8">
              <p className="small max-w-prose">
                We are a private architectural bureau delivering uncompromised
                residential flagships, custom structures, and invisible
                technologies.
              </p>
              <div className="flex flex-wrap gap-3 p-3 border border-secondary-white/50 rounded-xl">
                <button
                  type="button"
                  className="small rounded-xl font-medium bg-primary-white px-5 py-3 text-black transition-opacity hover:opacity-90"
                >
                  See apartments
                </button>
                <button
                  type="button"
                  className="small rounded-xl px-5 py-3 text-primary-white transition-colors hover:border-primary-white"
                >
                  I need custom service
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
  );
}