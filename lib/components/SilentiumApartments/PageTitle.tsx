"use client";

import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import LogoMark from "@/lib/components/LogoMark";
import { unlockScroll } from "@/lib/scroll-lock";
import {
  consumeSilentiumEnter,
  getSilentiumTransitionLayer,
  removeSilentiumTransitionLayer,
} from "@/lib/silentium-transition";

/** Way home and the place name. Lifts the right-wipe veil from enter. */
export default function PageTitle() {
  useEffect(() => {
    const fromEnter = consumeSilentiumEnter();
    const main = document.querySelector("main");
    const layer = getSilentiumTransitionLayer();
    if (main) gsap.set(main, { clearProps: "opacity,visibility,transform" });
    unlockScroll();

    if (!fromEnter || !layer) {
      removeSilentiumTransitionLayer();
      return;
    }

    // Wipe continues left — home was covered from the right; destination opens.
    gsap.set(layer, { xPercent: 0 });
    const slide = gsap.to(layer, {
      xPercent: -100,
      duration: 0.85,
      ease: "power3.inOut",
      onComplete: () => removeSilentiumTransitionLayer(),
    });

    return () => {
      slide.kill();
      removeSilentiumTransitionLayer();
    };
  }, []);

  return (
    <div className="px-section pt-section">
      <div
        data-enter="label"
        className="flex w-full items-center justify-between motion-safe:opacity-0"
      >
        <Link href="/" aria-label="Vørte home" className="text-primary-white">
          <LogoMark />
        </Link>
        <p className="font-secondary text-[16px] leading-[1.35] text-secondary-white">
          Silentium
        </p>
      </div>
    </div>
  );
}
