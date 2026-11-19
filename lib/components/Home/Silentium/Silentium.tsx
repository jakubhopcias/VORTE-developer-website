"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApartmentTiles from "@/lib/components/Home/Silentium/ApartmentTiles";
import { hasIntroCompleted } from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import {
  SILENTIUM_HREF,
  SILENTIUM_IMAGE,
  SILENTIUM_LAYER_ATTR,
  getAppBlack,
  markSilentiumEnter,
  removeSilentiumTransitionLayer,
} from "@/lib/silentium-transition";

gsap.registerPlugin(ScrollTrigger);

export default function Silentium() {
  const rootRef = useRef<HTMLDivElement>(null);
  const enteringRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch(SILENTIUM_HREF);
  }, [router]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    enteringRef.current = false;
    removeSilentiumTransitionLayer();

    const media = root.querySelector<HTMLElement>("[data-silentium='media']");
    const intro = root.querySelector<HTMLElement>("[data-silentium='intro']");
    const cta = root.querySelector<HTMLElement>("[data-silentium-cta]");
    const list = root.querySelector<HTMLElement>("[data-silentium='list']");
    const header = document.querySelector<HTMLElement>("[data-header]");

    if (!media || !intro || !cta) return;

    const resetSectionVisibility = () => {
      gsap.set([media, cta, intro, list].filter(Boolean), {
        clearProps: "opacity,visibility,transform,filter",
      });
      if (hasIntroCompleted() && header) {
        gsap.set(header, { clearProps: "opacity,visibility" });
      }
    };

    if (hasIntroCompleted()) unlockScroll();
    resetSectionVisibility();

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      enteringRef.current = false;
      removeSilentiumTransitionLayer();
      if (hasIntroCompleted()) unlockScroll();
      resetSectionVisibility();
    };
    window.addEventListener("pageshow", onPageShow);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { yPercent: -6 },
        {
          yPercent: 6,
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

      const exitTargets = [list, cta].filter(
        (el): el is HTMLElement => Boolean(el),
      );

      gsap.fromTo(
        exitTargets,
        { y: 0, autoAlpha: 1 },
        {
          y: 40,
          autoAlpha: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "bottom 90%",
            end: "bottom top",
            scrub: 0.55,
          },
        },
      );

      /** Wipe enters from the right, covers home, then destination lifts it left. */
      const enterSilentium = async (event: Event) => {
        event.preventDefault();
        if (enteringRef.current) return;
        enteringRef.current = true;

        lockScroll();
        removeSilentiumTransitionLayer();

        const black = getAppBlack();
        const layer = document.createElement("div");
        layer.setAttribute(SILENTIUM_LAYER_ATTR, "layer");
        Object.assign(layer.style, {
          position: "fixed",
          inset: "0",
          zIndex: "120",
          pointerEvents: "none",
          background: black,
          willChange: "transform",
        });
        document.body.appendChild(layer);
        gsap.set(layer, { xPercent: 100 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
        });

        tl.to(layer, { xPercent: 0, duration: 0.85 }, 0);

        try {
          await tl.then();
        } catch {
          enteringRef.current = false;
          unlockScroll();
          removeSilentiumTransitionLayer();
          resetSectionVisibility();
          return;
        }

        markSilentiumEnter();
        router.push(SILENTIUM_HREF);
      };

      cta.addEventListener("click", enterSilentium);

      return () => {
        cta.removeEventListener("click", enterSilentium);
      };
    }, root);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      ctx.revert();
      if (!enteringRef.current) {
        removeSilentiumTransitionLayer();
        resetSectionVisibility();
      }
    };
  }, [router]);

  return (
    <div
      ref={rootRef}
      id="silentium"
      className="relative flex flex-col gap-10 px-section py-section-y lg:h-svh lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-10 lg:overflow-hidden lg:p-section"
    >
      <div className="flex flex-col justify-between gap-12 lg:w-[38%] lg:min-w-0 lg:py-section">
        <div data-silentium="intro" className="shrink-0 opacity-0">
          <h2 className="headline">
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

        <div data-silentium="list" className="shrink-0 will-change-transform">
          <ApartmentTiles />
        </div>
      </div>

      {/* Withheld facade — gradient hides the rest; label names the debt. */}
      <a
        href={SILENTIUM_HREF}
        data-silentium-cta
        aria-label="Enter Silentium"
        className="group relative z-50 flex min-h-0 w-full flex-1 flex-col justify-center overflow-hidden rounded-xl lg:h-full"
      >
        <div
          data-silentium="media"
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src={SILENTIUM_IMAGE}
            alt="Silentium building"
            fill
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover object-left"
            priority
          />
        </div>

        {/* One veil block — slides right on hover, no crossfade flicker. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-[160%] will-change-transform transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[14%] group-focus-visible:translate-x-[14%]"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, transparent 20%, rgba(24,25,20,0.5) 36%, rgba(24,25,20,0.92) 52%, #181914 64%, #181914 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full min-h-[22rem] items-center justify-end py-section-y md:min-h-[28rem] lg:min-h-0">
          <span className="mr-16 font-secondary text-[16px] leading-[1.35] text-secondary-white/50 will-change-transform transition-[transform,color] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5 group-hover:text-primary-white group-focus-visible:translate-x-5 group-focus-visible:text-primary-white md:mr-20 lg:mr-24">
            See more →
          </span>
        </div>
      </a>
    </div>
  );
}
