"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApartmentTiles from "@/lib/components/Home/Silentium/ApartmentTiles";
import LinkUnderline from "@/lib/components/LinkUnderline";

gsap.registerPlugin(ScrollTrigger);

export default function Silentium() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = root.querySelector<HTMLElement>("[data-silentium='media']");
    const intro = root.querySelector<HTMLElement>("[data-silentium='intro']");
    const cta = root.querySelector<HTMLElement>("[data-silentium-cta]");
    const veil = root.querySelector<HTMLElement>("[data-silentium='veil']");
    const line1 = root.querySelector<HTMLElement>(
      "[data-silentium='cta-line-1']",
    );
    const line2 = root.querySelector<HTMLElement>(
      "[data-silentium='cta-line-2']",
    );
    const header = document.querySelector<HTMLElement>("[data-header]");

    if (!media || !intro || !cta || !veil || !line1 || !line2) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.45,
          },
        },
      );

      gsap.set(intro, { autoAlpha: 0, y: 20 });
      gsap.to(intro, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: intro,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.set([line1, line2], {
        autoAlpha: 0,
        filter: "blur(12px)",
      });
      gsap.set(veil, { autoAlpha: 0 });

      const hoverTl = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power2.out" },
        })
        .to(
          veil,
          {
            autoAlpha: 1,
            duration: 0.35,
          },
          0,
        )
        .to(
          line1,
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.55,
          },
          0,
        )
        .to(
          line2,
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.5,
          },
          0.16,
        );

      if (header) {
        hoverTl.to(
          header,
          {
            autoAlpha: 0.15,
            duration: 0.35,
          },
          0,
        );
      }

      const playHover = () => {
        hoverTl.play();
      };

      const reverseHover = () => {
        hoverTl.reverse();
      };

      cta.addEventListener("pointerenter", playHover);
      cta.addEventListener("pointerleave", reverseHover);
      cta.addEventListener("focus", playHover);
      cta.addEventListener("blur", reverseHover);

      return () => {
        cta.removeEventListener("pointerenter", playHover);
        cta.removeEventListener("pointerleave", reverseHover);
        cta.removeEventListener("focus", playHover);
        cta.removeEventListener("blur", reverseHover);
        if (header) gsap.set(header, { clearProps: "opacity,visibility" });
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      id="silentium"
      className="relative flex flex-col gap-8 px-section py-section-y lg:h-svh lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-8 lg:overflow-hidden lg:p-section"
    >
      <div
        data-silentium="veil"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 bg-black/80 opacity-0"
      />

      <div className="contents lg:flex lg:h-full lg:w-1/2 lg:min-h-0 lg:flex-col lg:justify-between lg:gap-12 lg:py-section">
        <div data-silentium="intro" className="order-1 shrink-0 opacity-0">
          <p className="eyebrow">Silentium apartments</p>
          <h2 className="headline mt-6">
            <span className="text-secondary-white">An enclave of </span>
            <span className="text-primary-white">total silence </span>
            <span className="text-secondary-white">
              and monolithic concrete mass.
            </span>
          </h2>
          <p className="small mt-8 max-w-md text-secondary-white">
            Three residences in one poured volume. The Obsidian sits on the
            upper floors with a closed street facade. Monolith Garden opens onto
            a private courtyard. The Silent Horizon is a single-level terrace
            apartment facing the tree line.
          </p>
        </div>

        <div className="order-3 shrink-0 lg:order-2">
          <ApartmentTiles />
        </div>
      </div>

      <Link
        href="/silentium-apartments"
        data-silentium-cta
        aria-label="Enter Silentium"
        className="group/cta group relative z-50 order-2 flex aspect-[4/5] flex-col overflow-hidden rounded-xl p-section lg:aspect-auto lg:h-full lg:min-h-0 lg:w-1/2"
      >
        <div
          data-silentium="media"
          className="absolute inset-0 will-change-transform"
        >
          <div className="absolute inset-0 scale-[1.18] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:scale-[1.3]">
            <Image
              src="/Silentium-building.webp"
              alt="Silentium building"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover lg:border-l lg:border-primary-white"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 via-40% to-transparent to-65% lg:bg-gradient-to-tr lg:from-black/55 lg:via-black/20 lg:via-45% lg:to-transparent lg:to-75%" />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <p
            aria-hidden="true"
            className="display pointer-events-none flex flex-1 flex-col justify-center"
          >
            <span
              data-silentium="cta-line-1"
              className="block text-secondary-white opacity-0"
              style={{ filter: "blur(12px)" }}
            >
              Enter
            </span>
            <span
              data-silentium="cta-line-2"
              className="block uppercase text-primary-white opacity-0"
              style={{ filter: "blur(12px)" }}
            >
              silentium
            </span>
          </p>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
            <p className="subheading max-w-md font-secondary text-secondary-white transition-colors duration-500 group-hover/cta:text-primary-white">
              A masterclass in acoustic isolation and architectural mass.
              Designed for absolute privacy.
            </p>
            <LinkUnderline
              as="span"
              className="small shrink-0 justify-self-end text-secondary-white transition-colors duration-500 group-hover/cta:text-primary-white"
            >
              Click to see more
            </LinkUnderline>
          </div>
        </div>
      </Link>
    </div>
  );
}
