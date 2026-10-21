import Image from "next/image";
import ApartmentTiles from "@/lib/components/Home/Silentium/ApartmentTiles";

export default function Silentium() {
  return (
    <div className="m-12 grid h-[85svh] min-h-0 grid-cols-12 overflow-hidden">
      <div className="col-span-6 flex h-full min-h-0 flex-col gap-12 p-6">
        <h2 className="headline shrink-0">
          <span className=" text-secondary-white">An enclave of </span>
          <span className=" text-primary-white">total silence </span>
          <span className=" text-secondary-white">
            and monolithic concrete mass.
          </span>
        </h2>
        <ApartmentTiles />
      </div>
      <div className="relative col-span-6 h-full min-h-0 overflow-hidden rounded-xl">
        <Image
          src="/Silentium-building.webp"
          alt="Silentium building"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
