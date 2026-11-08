import Apartments from "@/lib/components/SilentiumApartments/Apartments";
import PageTitle from "@/lib/components/SilentiumApartments/PageTitle";
import Usp from "@/lib/components/SilentiumApartments/Usp";

export default function SilentiumApartmentsPage() {
  return (
    <main>
      <PageTitle />
      <Usp />
      <Apartments />
    </main>
  );
}
