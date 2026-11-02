import Image from "next/image";
import Link from "next/link";
import LinkUnderline from "@/lib/components/LinkUnderline";

const apartments = [
  {
    name: "The Obsidian",
    href: "/silentium-apartments#the-obsidian",
    image: "/obsidian/balcony.jpg",
  },
  {
    name: "Monolith Garden",
    href: "/silentium-apartments#monolith-garden",
    image: "/monolith-garden/kitchen.jpg",
  },
  {
    name: "The Silent Horizon",
    href: "/silentium-apartments#the-silent-horizon",
    image: "/silent-horizon/living-room.jpg",
  },
];

export default function ApartmentTiles() {
  return (
    <ul className="flex w-full flex-col">
      {apartments.map((apartment, index) => (
        <li
          key={apartment.name}
          className="w-full border-b border-tertiary-white/20"
        >
          <Link
            href={apartment.href}
            className="group grid w-full grid-cols-[auto_13rem_auto_1fr] items-start gap-x-8 py-5 md:py-6"
          >
            <span className="small shrink-0 text-secondary-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="small truncate text-primary-white">
              {apartment.name}
            </span>
            <span className="h-0 w-0 overflow-hidden opacity-0 transition-[width,height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-[5.625rem] group-hover:w-36 group-hover:opacity-100">
              <span className="relative block aspect-video w-36 origin-top scale-95 overflow-hidden rounded-[4px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100">
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
            <LinkUnderline
              as="span"
              className="xs justify-self-end text-secondary-white"
            >
              See apartment
            </LinkUnderline>
          </Link>
        </li>
      ))}
    </ul>
  );
}
