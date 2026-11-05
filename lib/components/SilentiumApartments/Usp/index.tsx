import LivePrivate from "@/lib/components/SilentiumApartments/Usp/LivePrivate";
import Intelligence from "@/lib/components/SilentiumApartments/Usp/Intelligence";
import NoCorridors from "@/lib/components/SilentiumApartments/Usp/NoCorridors";

export default function Usp() {
  return (
    <div id="usp">
      <LivePrivate />
      <Intelligence />
      <NoCorridors />
    </div>
  );
}
