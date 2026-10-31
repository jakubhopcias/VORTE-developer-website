import Image from "next/image";

const references = [
  {
    logo: "/logo1.svg",
    quote:
      "Redefining residential autonomy through invisible local engineering.",
    href: "#",
    image: "/fancy-building.avif",
  },
  {
    logo: "/logo1.svg",
    quote: "A private architecture of mass, silence, and withheld access.",
    href: "#",
    image: "/silentium-building.webp",
  },
];

export default function Press() {
  return (
    <section className="flex flex-col gap-8 px-section py-section-y md:p-section">
      {references.map((reference) => (
        <a
          key={reference.quote}
          href={reference.href}
          className="relative flex h-[60svh] min-h-0 flex-col justify-between overflow-hidden rounded-xl p-section"
        >
          <Image
            src={reference.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black from-10% via-black/50 to-transparent" />
          <Image
            src={reference.logo}
            alt=""
            width={80}
            height={28}
            unoptimized
            className="relative z-10 h-7 w-auto max-w-24 self-start object-contain object-left"
            />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
            <p className="subtitle max-w-xl text-primary-white">
              “ {reference.quote} ”
            </p>
            <span className="small shrink-0 text-secondary-white">
              Click to see article →
            </span>
          </div>
        </a>
      ))}
    </section>
  );
}
