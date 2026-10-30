import Apartments from "@/lib/components/SilentiumApartments/Apartments";
import Hero from "@/lib/components/SilentiumApartments/Hero";
import Usp from "@/lib/components/SilentiumApartments/Usp";

export default function SilentiumApartmentsPage() {
  return (
    <main>
      <Hero />
      <Usp />
      <Apartments />
    </main>
  );
}
