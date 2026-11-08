import ApartmentSection from "@/lib/components/SilentiumApartments/ApartmentSection";
import { apartments } from "@/lib/components/SilentiumApartments/apartments";
import { loadApartmentImages } from "@/lib/components/SilentiumApartments/load-apartment-images";

export default function Apartments() {
  return (
    <div id="apartments">
      {apartments.map((apartment, index) => (
        <ApartmentSection
          key={apartment.name}
          apartment={apartment}
          images={loadApartmentImages(apartment)}
          imageOnLeft={index % 2 === 0}
        />
      ))}
    </div>
  );
}
