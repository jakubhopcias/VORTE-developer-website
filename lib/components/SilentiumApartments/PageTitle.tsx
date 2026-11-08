"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { unlockScroll } from "@/lib/scroll-lock";
import {
  consumeSilentiumEnter,
  getSilentiumTransitionLayer,
  removeSilentiumTransitionLayer,
} from "@/lib/silentium-transition";

/** Page label + reveal after Home → Silentium enter transition. */
export default function PageTitle() {
  useEffect(() => {
    const fromEnter = consumeSilentiumEnter();
    const main = document.querySelector("main");
    const layer = getSilentiumTransitionLayer();

    if (fromEnter && main) {
      gsap.set(main, { autoAlpha: 0 });
      unlockScroll();

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => removeSilentiumTransitionLayer(),
      });

      if (layer) {
        tl.to(layer, { autoAlpha: 0, duration: 0.35 }, 0);
      }
      tl.to(main, { autoAlpha: 1, duration: 0.55 }, layer ? 0.08 : 0);

      return () => {
        tl.kill();
        removeSilentiumTransitionLayer();
        gsap.set(main, { clearProps: "opacity,visibility" });
      };
    }

    removeSilentiumTransitionLayer();
    unlockScroll();
  }, []);

  return (
    <div className="px-section pt-[calc(var(--header-h,57px)+1.5rem)]">
      <p className="font-secondary text-[16px] leading-[1.35] text-secondary-white">
        Silentium apartments
      </p>
    </div>
  );
}
