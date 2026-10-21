import Image from "next/image";

const apartments = [
  {
    name: "The obsidian",
    image: "/obsidian/balcony.jpg",
  },
  {
    name: "Monolith garden",
    image: "/monolith-garden/kitchen.jpg",
  },
  {
    name: "The silent horizon",
    image: "/silent-horizon/living-room.jpg",
  },
];

export default function ApartmentTiles() {
  return (
    <ul className="flex min-h-0 flex-1 flex-col justify-between">
      {apartments.map((apartment) => (
        <li
          key={apartment.name}
          className="flex items-end justify-between gap-6"
        >
          <p className="small text-primary-white underline decoration-primary-white underline-offset-4">
            {apartment.name}
          </p>
          <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md border border-secondary-white">
            <Image
              src={apartment.image}
              alt=""
              fill
              sizes="7rem"
              className="object-cover"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
