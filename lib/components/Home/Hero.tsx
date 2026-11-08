"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkUnderline from "@/lib/components/LinkUnderline";
import { hasIntroCompleted, onIntroComplete } from "@/lib/intro";
import { unlockScroll } from "@/lib/scroll-lock";
import { removeSilentiumTransitionLayer } from "@/lib/silentium-transition";
import { syncViewportVars } from "@/lib/viewport";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    removeSilentiumTransitionLayer();
    unlockScroll();
    syncViewportVars();

    const header = document.querySelector<HTMLElement>("[data-header]");
    if (header) gsap.set(header, { clearProps: "opacity,visibility" });

    const parallax = root.querySelector<HTMLElement>("[data-hero='parallax']");
    const title = root.querySelector<HTMLElement>("[data-hero='title']");
    const aside = root.querySelector<HTMLElement>("[data-hero='aside']");
    const line1 = root.querySelector<HTMLElement>("[data-hero='line-1']");
    const line2 = root.querySelector<HTMLElement>("[data-hero='line-2']");
    const copy = root.querySelector<HTMLElement>("[data-hero='copy']");
    const links = root.querySelector<HTMLElement>("[data-hero='links']");

    if (!parallax || !title || !aside || !line1 || !line2 || !copy || !links)
      return;

    let unsubscribe = () => {};
    let introTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      gsap.set([title, aside], { clearProps: "opacity,visibility,transform" });
      gsap.set([line1, line2], {
        autoAlpha: 0,
        filter: "blur(12px)",
      });
      gsap.set([copy, links], { autoAlpha: 0, y: 28 });

      const scrollOut = {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 0.55,
      };

      gsap.fromTo(
        parallax,
        { yPercent: -6 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { ...scrollOut, scrub: 0.4 },
        },
      );

      gsap.to(title, {
        yPercent: -45,
        ease: "none",
        scrollTrigger: scrollOut,
      });

      gsap.to(aside, {
        yPercent: -70,
        ease: "none",
        scrollTrigger: { ...scrollOut, scrub: 0.7 },
      });

      gsap.to([title, aside], {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "center top",
          scrub: true,
        },
      });

      const playIntro = () => {
        syncViewportVars();
        ScrollTrigger.refresh();

        gsap.set([title, aside], { autoAlpha: 1, yPercent: 0 });
        introTl?.kill();
        introTl = gsap.timeline({
          defaults: { ease: "power2.out" },
        });

        introTl
          .fromTo(
            line1,
            { autoAlpha: 0, filter: "blur(12px)" },
            { autoAlpha: 1, filter: "blur(0px)", duration: 0.55 },
          )
          .fromTo(
            line2,
            { autoAlpha: 0, filter: "blur(12px)" },
            { autoAlpha: 1, filter: "blur(0px)", duration: 0.5 },
            "-=0.32",
          )
          .fromTo(
            [copy, links],
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.05,
            },
            "-=0.28",
          );
      };

      if (hasIntroCompleted()) {
        requestAnimationFrame(() => {
          requestAnimationFrame(playIntro);
        });
      } else {
        unsubscribe = onIntroComplete(playIntro);
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
          <h1
            data-hero="title"
            className="display will-change-transform lg:col-span-6"
          >
            <span
              data-hero="line-1"
              className="block text-primary-white opacity-0"
              style={{ filter: "blur(12px)" }}
            >
              We build for{" "}
              <span className="max-md:block md:inline lg:block">the few.</span>
            </span>
            <span
              data-hero="line-2"
              className="block text-primary-white opacity-0"
              style={{ filter: "blur(12px)" }}
            >
              Hidden from{" "}
              <span className="max-md:block md:inline lg:block">the world.</span>
            </span>
          </h1>

          <div
            data-hero="aside"
            className="grid w-full grid-cols-6 items-end gap-x-4 gap-y-6 will-change-transform lg:col-span-6 lg:col-start-7"
          >
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
    </section>
  );
}
