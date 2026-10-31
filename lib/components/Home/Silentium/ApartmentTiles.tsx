import Link from "next/link";

const apartments = [
  {
    name: "The Obsidian",
    href: "/silentium-apartments#the-obsidian",
  },
  {
    name: "Monolith Garden",
    href: "/silentium-apartments#monolith-garden",
  },
  {
    name: "The Silent Horizon",
    href: "/silentium-apartments#the-silent-horizon",
  },
];

export default function ApartmentTiles() {
  return (
    <ul className="flex w-full shrink-0 flex-col gap-8 md:gap-6">
      {apartments.map((apartment, index) => (
        <li key={apartment.name} className="w-full">
          <Link
            href={apartment.href}
            className="flex w-full items-baseline gap-8"
          >
            <span className="small shrink-0 text-secondary-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="small text-primary-white">{apartment.name}</span>
            <span className="xs ml-auto shrink-0 text-secondary-white">
              See apartment →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
