import Image from "next/image";

const apartments = [
  {
    name: "The Obsidian",
    image: "/obsidian/balcony1.jpg",
  },
  {
    name: "Monolith Garden",
    image: "/monolith-garden/living-room.jpg",
  },
  {
    name: "The Silent Horizon",
    image: "/silent-horizon/living-room.jpg",
  },
];

export default function ApartmentTiles() {
  return (
    <ul className="flex w-full flex-col">
      {apartments.map((apartment, index) => (
        <li
          key={apartment.name}
          className="group w-full border-b border-tertiary-white/20"
        >
          <div className="grid w-full grid-cols-[auto_minmax(0,13rem)_auto] items-start gap-x-6 py-5 md:gap-x-8 md:py-6">
            <span className="small shrink-0 text-secondary-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="small truncate text-secondary-white transition-colors duration-500 group-hover:text-primary-white">
              {apartment.name}
            </span>
            {/* Mobile: always-on thumb. Desktop: hover expand (same layout). */}
            <span className="h-[3.75rem] w-24 overflow-hidden opacity-100 transition-[width,height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-0 lg:w-0 lg:opacity-0 lg:group-hover:h-[5.625rem] lg:group-hover:w-36 lg:group-hover:opacity-100">
              <span className="relative block aspect-video w-24 origin-top scale-100 overflow-hidden rounded-[4px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:w-36 lg:scale-95 lg:group-hover:scale-100">
                <Image
                  src={apartment.image}
                  alt=""
                  fill
                  quality={95}
                  sizes="144px"
                  className="object-cover"
                />
              </span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
