import Hero from "@/lib/components/Home/Hero";
import Silentium from "@/lib/components/Home/Silentium/Silentium";
import Figures from "@/lib/components/Home/Figures";
import Capabilities from "@/lib/components/Home/Capabilities";

export default function Home() {
  return (
    <main>
      <Hero />
      <Silentium />
      <Figures />
      <Capabilities />
    </main>
  );
}
