const apartments = [
  {
    name: "The Obsidian",
    href: "/apartments/the-obsidian",
  },
  {
    name: "Monolith Garden",
    href: "/apartments/monolith-garden",
  },
  {
    name: "The Silent Horizon",
    href: "/apartments/the-silent-horizon",
  },
];

export default function ApartmentTiles() {
  return (
    <ul className="flex w-full shrink-0 flex-col gap-6">
      {apartments.map((apartment, index) => (
        <li key={apartment.name} className="w-full">
          <a
            href={apartment.href}
            className="flex w-full items-baseline gap-8"
          >
            <span className="small shrink-0 text-secondary-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="small text-primary-white">{apartment.name}</span>
            <span className="small ml-auto shrink-0 text-secondary-white">
              See apartment →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
