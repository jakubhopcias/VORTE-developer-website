"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApartmentTiles from "@/lib/components/Home/Silentium/ApartmentTiles";
import LinkUnderline from "@/lib/components/LinkUnderline";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import {
  SILENTIUM_HERO_SCALE,
  SILENTIUM_HREF,
  SILENTIUM_IMAGE,
  SILENTIUM_LAYER_ATTR,
  forceHeaderOverHero,
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

    // Fresh visit to home: always re-enable interactions + clear leftovers.
    enteringRef.current = false;
    removeSilentiumTransitionLayer();
    unlockScroll();

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
    const list = root.querySelector<HTMLElement>("[data-silentium='list']");
    const header = document.querySelector<HTMLElement>("[data-header]");

    if (!media || !intro || !cta || !veil || !line1 || !line2) return;

    const resetSectionVisibility = () => {
      gsap.set([media, cta, intro, list, veil].filter(Boolean), {
        clearProps: "opacity,visibility,transform,filter",
      });
      gsap.set([line1, line2], {
        autoAlpha: 0,
        filter: "blur(12px)",
      });
      gsap.set(veil, { autoAlpha: 0 });
      if (header) gsap.set(header, { clearProps: "opacity,visibility" });
    };

    resetSectionVisibility();

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      enteringRef.current = false;
      removeSilentiumTransitionLayer();
      unlockScroll();
      resetSectionVisibility();
    };
    window.addEventListener("pageshow", onPageShow);

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

      const exitTargets = [list, cta].filter(
        (el): el is HTMLElement => Boolean(el),
      );

      gsap.fromTo(
        exitTargets,
        { y: 0, autoAlpha: 1 },
        {
          y: 56,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "bottom 90%",
            end: "bottom top",
            scrub: 0.55,
          },
        },
      );

      const hoverTl = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power2.out" },
        })
        .to(veil, { autoAlpha: 1, duration: 0.35 }, 0)
        .to(
          line1,
          { autoAlpha: 1, filter: "blur(0px)", duration: 0.55 },
          0,
        )
        .to(
          line2,
          { autoAlpha: 1, filter: "blur(0px)", duration: 0.5 },
          0.16,
        );

      if (header) {
        hoverTl.to(header, { autoAlpha: 0.15, duration: 0.35 }, 0);
      }

      const playHover = () => {
        if (enteringRef.current) return;
        hoverTl.play();
      };

      const reverseHover = () => {
        if (enteringRef.current) return;
        hoverTl.reverse();
      };

      const enterSilentium = async (event: Event) => {
        event.preventDefault();
        if (enteringRef.current) return;
        enteringRef.current = true;

        hoverTl.reverse();
        lockScroll();

        const mediaInner = media.querySelector<HTMLElement>(":scope > div");
        const rect = cta.getBoundingClientRect();
        const radius = getComputedStyle(cta).borderRadius || "0px";
        const black = getAppBlack();
        let startScale = 1.18;
        if (mediaInner) {
          try {
            startScale = new DOMMatrix(
              getComputedStyle(mediaInner).transform,
            ).a;
          } catch {
            startScale = 1.18;
          }
        }
        if (!Number.isFinite(startScale) || startScale <= 0) startScale = 1.18;

        removeSilentiumTransitionLayer();

        const layer = document.createElement("div");
        layer.setAttribute(SILENTIUM_LAYER_ATTR, "layer");
        Object.assign(layer.style, {
          position: "fixed",
          inset: "0",
          zIndex: "120",
          pointerEvents: "none",
        });

        const frame = document.createElement("div");
        Object.assign(frame.style, {
          position: "absolute",
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          overflow: "hidden",
          borderRadius: radius,
          background: black,
          willChange: "top, left, width, height, border-radius",
        });

        const imgWrap = document.createElement("div");
        Object.assign(imgWrap.style, {
          position: "absolute",
          inset: "0",
          transform: `scale(${startScale})`,
          transformOrigin: "center center",
          willChange: "transform",
        });

        const img = document.createElement("img");
        img.src = SILENTIUM_IMAGE;
        img.alt = "";
        img.decoding = "sync";
        Object.assign(img.style, {
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        });

        // Same bottom wash as destination hero — avoids crop jump on handoff.
        const gradient = document.createElement("div");
        Object.assign(gradient.style, {
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "0",
          height: "85%",
          background: `linear-gradient(to top, ${black}, transparent)`,
          opacity: "0",
          pointerEvents: "none",
        });

        imgWrap.appendChild(img);
        frame.appendChild(imgWrap);
        frame.appendChild(gradient);
        layer.appendChild(frame);
        document.body.appendChild(layer);

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
        });

        // No fade / delay — expand alone covers the page (above header).
        tl.to(
          frame,
          {
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 0,
            duration: 0.9,
          },
          0,
        );
        tl.to(
          imgWrap,
          {
            scale: SILENTIUM_HERO_SCALE,
            duration: 0.9,
          },
          0,
        );
        tl.to(gradient, { opacity: 1, duration: 0.55, ease: "power2.out" }, 0.25);

        try {
          await tl.then();
        } catch {
          enteringRef.current = false;
          unlockScroll();
          removeSilentiumTransitionLayer();
          resetSectionVisibility();
          return;
        }

        resetSectionVisibility();
        forceHeaderOverHero();
        markSilentiumEnter();
        router.push(SILENTIUM_HREF);
      };

      cta.addEventListener("pointerenter", playHover);
      cta.addEventListener("pointerleave", reverseHover);
      cta.addEventListener("focus", playHover);
      cta.addEventListener("blur", reverseHover);
      cta.addEventListener("click", enterSilentium);

      return () => {
        cta.removeEventListener("pointerenter", playHover);
        cta.removeEventListener("pointerleave", reverseHover);
        cta.removeEventListener("focus", playHover);
        cta.removeEventListener("blur", reverseHover);
        cta.removeEventListener("click", enterSilentium);
      };
    }, root);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      ctx.revert();
      // If we left mid-enter, layer stays for handoff; otherwise clear.
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

        <div
          data-silentium="list"
          className="order-3 shrink-0 will-change-transform lg:order-2"
        >
          <ApartmentTiles />
        </div>
      </div>

      <a
        href={SILENTIUM_HREF}
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
              src={SILENTIUM_IMAGE}
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
      </a>
    </div>
  );
}
