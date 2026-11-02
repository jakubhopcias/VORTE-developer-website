"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onIntroComplete } from "@/lib/intro";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      // Weight without glue — slightly slower than default, still responsive.
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.15,
      syncTouch: false,
      // Keep hash / in-page links working through Lenis instead of native jumps.
      anchors: {
        offset: 0,
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });

    const onScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    const unsubscribeIntro = onIntroComplete(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      unsubscribeIntro();
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return null;
}
