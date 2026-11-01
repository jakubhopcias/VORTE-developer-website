"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const parallax = root.querySelector<HTMLElement>("[data-hero='parallax']");
    const line1 = root.querySelector<HTMLElement>("[data-hero='line-1']");
    const line2 = root.querySelector<HTMLElement>("[data-hero='line-2']");
    const copy = root.querySelector<HTMLElement>("[data-hero='copy']");
    const links = root.querySelector<HTMLElement>("[data-hero='links']");

    if (!parallax || !line1 || !line2 || !copy || !links) return;

    const ctx = gsap.context(() => {
      gsap.set([line1, line2], {
        autoAlpha: 0,
        filter: "blur(12px)",
      });
      gsap.set([copy, links], { autoAlpha: 0, y: 28 });

      gsap.fromTo(
        parallax,
        { yPercent: -6 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        },
      );

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.to(line1, {
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.1,
      })
        .to(
          line2,
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.05,
          },
          "-=0.65",
        )
        .to(
          [copy, links],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
          },
          "-=0.55",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative h-svh overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div
          data-hero="parallax"
          className="absolute inset-0 scale-[1.2] will-change-transform"
        >
          <Image
            src="/Silentium-building-reverse.jpg"
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
          <h1 className="display lg:col-span-6">
            <span
              data-hero="line-1"
              className="block opacity-0"
              style={{ filter: "blur(12px)" }}
            >
              <span className="text-secondary-white">We build for </span>
              <span className="max-md:block md:inline lg:block text-primary-white">
                the few.
              </span>
            </span>
            <span
              data-hero="line-2"
              className="block opacity-0"
              style={{ filter: "blur(12px)" }}
            >
              <span className="text-secondary-white">Hidden from </span>
              <span className="max-md:block md:inline lg:block text-primary-white">
                the world.
              </span>
            </span>
          </h1>

          <div className="grid w-full grid-cols-6 items-end gap-x-4 gap-y-6 lg:col-span-6 lg:col-start-7">
            <p
              data-hero="copy"
              className="small col-span-6 max-w-prose text-primary-white opacity-0 md:col-span-3"
            >
              We are a private architectural bureau delivering uncompromised
              residential flagships, custom structures, and invisible
              technologies.
            </p>
            <div
              data-hero="links"
              className="col-span-6 flex flex-col items-end gap-6 opacity-0 md:col-span-3"
            >
              <a
                href="#services"
                className="small text-secondary-white underline decoration-secondary-white underline-offset-4 transition-opacity hover:opacity-80"
              >
                I need custom service →
              </a>
              <Link
                href="silentium-apartments"
                className="small text-primary-white underline decoration-primary-white underline-offset-4 transition-opacity hover:opacity-80"
              >
                See apartments →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
