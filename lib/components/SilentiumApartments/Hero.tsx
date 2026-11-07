"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkUnderline from "@/lib/components/LinkUnderline";
import { unlockScroll } from "@/lib/scroll-lock";
import {
  SILENTIUM_HERO_SCALE,
  SILENTIUM_IMAGE,
  consumeSilentiumEnter,
  forceHeaderOverHero,
  removeSilentiumTransitionLayer,
} from "@/lib/silentium-transition";
import { syncViewportVars } from "@/lib/viewport";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fromTransition = consumeSilentiumEnter();
    const parallax = root.querySelector<HTMLElement>("[data-hero='parallax']");
    const title = root.querySelector<HTMLElement>("[data-hero='title']");
    const aside = root.querySelector<HTMLElement>("[data-hero='aside']");
    const line1 = root.querySelector<HTMLElement>("[data-hero='line-1']");
    const line2 = root.querySelector<HTMLElement>("[data-hero='line-2']");
    const copy = root.querySelector<HTMLElement>("[data-hero='copy']");
    const links = root.querySelector<HTMLElement>("[data-hero='links']");
    const header = document.querySelector<HTMLElement>("[data-header]");

    if (!parallax || !title || !aside || !line1 || !line2 || !copy || !links)
      return;

    syncViewportVars();
    window.scrollTo(0, 0);
    forceHeaderOverHero();

    const ctx = gsap.context(() => {
      gsap.set(parallax, { yPercent: 0, scale: SILENTIUM_HERO_SCALE });
      gsap.set([line1, line2], {
        autoAlpha: 0,
        filter: "blur(12px)",
      });
      gsap.set([copy, links], { autoAlpha: 0, y: 28 });
      if (header) gsap.set(header, { clearProps: "opacity,visibility" });

      const playIntro = () => {
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(line1, { autoAlpha: 1, filter: "blur(0px)", duration: 0.55 })
          .to(
            line2,
            { autoAlpha: 1, filter: "blur(0px)", duration: 0.5 },
            "-=0.32",
          )
          .to(
            [copy, links],
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05 },
            "-=0.28",
          );
      };

      const armScroll = () => {
        const scrollOut = {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.55,
        };

        gsap.fromTo(
          parallax,
          { yPercent: 0 },
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

        ScrollTrigger.refresh();
      };

      let handedOff = false;
      const finishHandoff = () => {
        if (handedOff) return;
        handedOff = true;
        window.scrollTo(0, 0);
        forceHeaderOverHero();
        removeSilentiumTransitionLayer();
        unlockScroll();
        armScroll();
        playIntro();
      };

      if (fromTransition) {
        const img = root.querySelector("img");
        const settle = () => finishHandoff();
        if (img && !img.complete) {
          img.decode?.().then(settle).catch(settle);
          img.addEventListener("load", settle, { once: true });
          window.setTimeout(settle, 400);
        } else {
          requestAnimationFrame(() => requestAnimationFrame(settle));
        }
      } else {
        removeSilentiumTransitionLayer();
        unlockScroll();
        armScroll();
        playIntro();
      }
    }, root);

    return () => {
      ctx.revert();
      removeSilentiumTransitionLayer();
      unlockScroll();
      if (header) gsap.set(header, { clearProps: "opacity,visibility" });
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
          className="absolute inset-0 will-change-transform"
          style={{ transform: `scale(${SILENTIUM_HERO_SCALE})` }}
        >
          <Image
            src={SILENTIUM_IMAGE}
            alt="Silentium apartments in Zurich"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </div>
      <div
        data-hero="wash"
        className="absolute inset-x-0 bottom-0 h-[85%] bg-linear-to-t from-black to-transparent md:h-2/3"
      />

      <div className="relative mx-auto flex h-full items-end px-section py-section-y">
        <div className="flex w-full flex-col gap-6 md:gap-10 lg:grid lg:grid-cols-12 lg:items-end">
          <h1
            data-hero="title"
            className="display will-change-transform lg:col-span-6"
          >
            <span
              data-hero="line-1"
              className="text-primary-white opacity-0"
              style={{ filter: "blur(12px)" }}
            >
              The only sound you'll hear is the one
            </span>
            <span
              data-hero="line-2"
              className="text-primary-white opacity-0"
              style={{ filter: "blur(12px)" }}
            >
              {" "}
              you choose
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
              Ready-to-move-in stealth wealth residences (75–160 m²). Raw
              brutalism softened by nature, uncompromising acoustic insulation,
              and absolute privacy.
            </p>
            <div
              data-hero="links"
              className="col-span-6 flex flex-col items-end gap-6 opacity-0 md:col-span-3"
            >
              <LinkUnderline
                href="#apartments"
                className="small text-primary-white"
              >
                See apartments
              </LinkUnderline>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
