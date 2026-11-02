"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkUnderline from "@/lib/components/LinkUnderline";

gsap.registerPlugin(ScrollTrigger);

const references = [
  {
    logo: "/ad.png",
    logoAlt: "Architectural Digest",
    quote:
      "Redefining residential autonomy through invisible local engineering.",
    href: "#",
    image: "/fancy-building.avif",
  },
  {
    logo: "/dezeen.png",
    logoAlt: "Dezeen",
    quote: "A private architecture of mass, silence, and withheld access.",
    href: "#",
    image: "/silentium-building.webp",
  },
];

export default function Press() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-press='card']"),
    );
    if (cards.length < 2) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        if (index === 0) return;

        const previous = cards[index - 1];

        gsap.fromTo(
          previous,
          { scale: 1, filter: "brightness(1)" },
          {
            scale: 0.94,
            filter: "brightness(0.72)",
            ease: "none",
            scrollTrigger: {
              trigger: card.parentElement,
              start: "top bottom",
              end: "top top",
              scrub: 0.55,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="press" className="relative">
      {references.map((reference, index) => (
        <div
          key={reference.quote}
          className="sticky top-0 flex h-svh items-center px-section py-section-y md:p-section"
          style={{ zIndex: index + 1 }}
        >
          <a
            href={reference.href}
            data-press="card"
            className="group relative flex h-[min(70svh,40rem)] w-full origin-center flex-col justify-between overflow-hidden rounded-xl p-section will-change-transform"
          >
            <Image
              src={reference.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black from-10% via-black/50 to-transparent" />
            <Image
              src={reference.logo}
              alt={reference.logoAlt}
              width={120}
              height={40}
              className="relative z-10 h-8 w-auto max-w-[7.5rem] self-start object-contain object-left md:h-9"
            />
            <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
              <p className="subtitle max-w-xl text-primary-white">
                “ {reference.quote} ”
              </p>
              <LinkUnderline
                as="span"
                className="small shrink-0 text-secondary-white transition-colors duration-500 group-hover:text-primary-white"
              >
                Click to see article →
              </LinkUnderline>
            </div>
          </a>
        </div>
      ))}
    </section>
  );
}
