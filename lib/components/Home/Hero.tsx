"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkUnderline from "@/lib/components/LinkUnderline";
import {
  hasIntroCompleted,
  hasIntroRevealed,
  onIntroReveal,
} from "@/lib/intro";
import { unlockScroll } from "@/lib/scroll-lock";
import { removeSilentiumTransitionLayer } from "@/lib/silentium-transition";
import { syncViewportVars } from "@/lib/viewport";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    removeSilentiumTransitionLayer();
    syncViewportVars();

    // Intro owns the lock and the mark. Don't steal them mid-loader.
    if (!hasIntroCompleted()) return;

    unlockScroll();
    const header = document.querySelector<HTMLElement>("[data-header]");
    if (header) gsap.set(header, { clearProps: "opacity,visibility" });
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const parallax = root.querySelector<HTMLElement>("[data-hero='parallax']");
    const line1 = root.querySelector<HTMLElement>("[data-hero='line-1']");
    const line2 = root.querySelector<HTMLElement>("[data-hero='line-2']");
    const copy = root.querySelector<HTMLElement>("[data-hero='copy']");
    const links = root.querySelector<HTMLElement>("[data-hero='links']");

    if (!parallax || !line1 || !line2 || !copy || !links) return;

    let unsubscribe = () => {};
    let introTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.fromTo(
        parallax,
        { yPercent: -6 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        },
      );

      if (reduced) return;

      // Same clip-slide as apartment copy: rises from below an overflow edge.
      gsap.set([line1, line2, copy, links], { yPercent: 130 });

      const playIntro = () => {
        syncViewportVars();
        ScrollTrigger.refresh();

        introTl?.kill();
        introTl = gsap.timeline({
          defaults: { ease: "power2.out" },
        });

        introTl
          .to(line1, { yPercent: 0, duration: 0.9 })
          .to(line2, { yPercent: 0, duration: 0.85 }, "-=0.55")
          .to(copy, { yPercent: 0, duration: 0.6 }, "-=0.4")
          .to(links, { yPercent: 0, duration: 0.6 }, "-=0.45");
      };

      if (hasIntroRevealed()) {
        requestAnimationFrame(() => {
          requestAnimationFrame(playIntro);
        });
      } else {
        unsubscribe = onIntroReveal(playIntro);
      }
    }, root);

    return () => {
      unsubscribe();
      introTl?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative h-[var(--app-vh,100svh)] overflow-hidden bg-black"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          data-hero="parallax"
          className="absolute inset-0 scale-[1.2] will-change-transform"
        >
          <Image
            src="/private-door.jpg"
            alt="The Obsidian Penthouse building"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[85%] bg-linear-to-t from-black to-transparent md:h-2/3" />

      <div className="relative mx-auto flex h-full items-end px-section py-section-y">
        <div className="flex w-full flex-col gap-6 md:gap-10 lg:grid lg:grid-cols-12 lg:items-end">
          <h1 data-hero="title" className="display lg:col-span-6">
            <span className="block overflow-hidden py-[0.08em]">
              <span
                data-hero="line-1"
                className="block text-primary-white will-change-transform"
              >
                We build for{" "}
                <span className="max-md:block md:inline lg:block">the few.</span>
              </span>
            </span>
            <span className="block overflow-hidden py-[0.08em]">
              <span
                data-hero="line-2"
                className="block text-primary-white will-change-transform"
              >
                Hidden from{" "}
                <span className="max-md:block md:inline lg:block">
                  the world.
                </span>
              </span>
            </span>
          </h1>

          <div
            data-hero="aside"
            className="grid w-full grid-cols-6 items-end gap-x-4 gap-y-6 lg:col-span-6 lg:col-start-7"
          >
            <div className="col-span-6 overflow-hidden md:col-span-3">
              <p
                data-hero="copy"
                className="small max-w-prose text-primary-white will-change-transform"
              >
                We are a private architectural bureau delivering uncompromised
                residential flagships, custom structures, and invisible
                technologies.
              </p>
            </div>
            <div className="col-span-6 overflow-hidden md:col-span-3">
              <div
                data-hero="links"
                className="flex flex-col items-end gap-6 will-change-transform"
              >
                <LinkUnderline
                  href="#services"
                  className="small text-primary-white"
                >
                  I need custom service
                </LinkUnderline>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
