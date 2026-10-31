import Image from "next/image";
import Link from "next/link";

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
      <div className="absolute inset-x-0 bottom-0 h-[85%] bg-linear-to-t from-black via-black/70 to-transparent md:h-2/3 md:via-black/40" />

      <div className="relative mx-auto flex h-full items-end px-section py-section-y">
        <div className="flex w-full flex-col gap-6 md:gap-10 lg:grid lg:grid-cols-12 lg:items-end lg:gap-0">
          <h1 className="display lg:col-span-6">
            <span className="block">
              <span className="text-secondary-white">We build for </span>
              <span className="max-md:block md:inline lg:block text-primary-white">
                the few.
              </span>
            </span>
            <span className="block">
              <span className="text-secondary-white">Hidden from </span>
              <span className="max-md:block md:inline lg:block text-primary-white">
                the world.
              </span>
            </span>
          </h1>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-8 lg:col-span-4 lg:col-start-9 
          lg:h-full lg:flex-col lg:items-start lg:justify-between">
            <p className="small max-w-prose text-secondary-white lg:text-primary-white">
              We are a private architectural bureau delivering uncompromised
              residential flagships, custom structures, and invisible
              technologies.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3 lg:btn-group lg:gap-4">
              <a href="#services" className="btn-outline">
                I need custom service
              </a>
              <Link href="silentium-apartments" className="btn-primary">
                See apartments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
