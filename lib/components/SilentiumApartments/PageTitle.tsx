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

/** Way home and the place name. The entrance stagger lives below; this lifts the transition veil. */
export default function PageTitle() {
  useEffect(() => {
    const fromEnter = consumeSilentiumEnter();
    const main = document.querySelector("main");
    const layer = getSilentiumTransitionLayer();
    if (main) gsap.set(main, { clearProps: "opacity,visibility" });
    unlockScroll();

    if (!fromEnter || !layer) {
      removeSilentiumTransitionLayer();
      return;
    }

    const fade = gsap.to(layer, {
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.out",
      onComplete: () => removeSilentiumTransitionLayer(),
    });

    return () => {
      fade.kill();
      removeSilentiumTransitionLayer();
    };
  }, []);

  return (
    <div className="px-section pt-section">
      <div
        data-enter="label"
        className="flex items-center gap-6 motion-safe:opacity-0"
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
