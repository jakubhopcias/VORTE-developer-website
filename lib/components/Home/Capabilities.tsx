"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkUnderline from "@/lib/components/LinkUnderline";

gsap.registerPlugin(ScrollTrigger);

type Service = {
  name: string;
  href: string;
  /** Wrap emphasised words in **double asterisks**. */
  copy: string;
  src: string;
};

const services: Service[] = [
  {
    name: "Designing invisible smart house",
    href: "/services/invisible-smart-house",
    copy: "Advanced **smart-home engineering** and climate control seamlessly integrated beneath architectural surfaces.",
    src: "/smart-home.jpg",
  },
  {
    name: "Bespoke Architecture",
    href: "/services/bespoke-architecture",
    copy: "One-off volumes drawn for a single client: **structure, mass, and interior** as one commission, never repeated.",
    src: "/fancy-building.avif",
  },
  {
    name: "Private Concierge & Management",
    href: "/services/private-concierge",
    copy: "Household operations, access, and maintenance held under the **same NDA** as the building itself.",
    src: "/obsidian/balcony.jpg",
  },
];

function emphasisedCopy(copy: string) {
  return copy.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const emphasised = part.startsWith("**") && part.endsWith("**");

    return (
      <span
        key={index}
        className={
          emphasised ? "text-primary-white" : "text-secondary-white"
        }
      >
        {emphasised ? part.slice(2, -2) : part}
      </span>
    );
  });
}

function indexFromProgress(progress: number) {
  return Math.min(
    services.length - 1,
    Math.floor(progress * services.length),
  );
}

const HOVER_BRIDGE_MS = 180;

export default function Capabilities() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollActiveRef = useRef(0);
  const hoverActiveRef = useRef<number | null>(null);
  const hoverClearTimerRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [copyVisible, setCopyVisible] = useState(true);
  const current = services[active];
  const shown = services[displayed];

  const syncActive = () => {
    setActive(hoverActiveRef.current ?? scrollActiveRef.current);
  };

  const cancelHoverClear = () => {
    if (hoverClearTimerRef.current === null) return;
    window.clearTimeout(hoverClearTimerRef.current);
    hoverClearTimerRef.current = null;
  };

  /** Bridge the column gap: don't drop hover until leave is intentional. */
  const scheduleHoverClear = () => {
    cancelHoverClear();
    hoverClearTimerRef.current = window.setTimeout(() => {
      hoverClearTimerRef.current = null;
      if (hoverActiveRef.current === null) return;
      hoverActiveRef.current = null;
      syncActive();
    }, HOVER_BRIDGE_MS);
  };

  const lockHover = (index: number) => {
    cancelHoverClear();
    hoverActiveRef.current = index;
    syncActive();
  };

  useEffect(() => {
    return () => cancelHoverClear();
  }, []);

  useEffect(() => {
    if (active === displayed) return;

    setCopyVisible(false);
    const timer = window.setTimeout(() => {
      setDisplayed(active);
      setCopyVisible(true);
    }, 320);

    return () => window.clearTimeout(timer);
  }, [active, displayed]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const intro = root.querySelector<HTMLElement>("[data-capabilities='intro']");
    const list = root.querySelector<HTMLElement>("[data-capabilities='list']");
    const media = root.querySelector<HTMLElement>("[data-capabilities='media']");
    const items = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-capabilities='item']"),
    );

    if (!intro || !list || !media) return;

    const ctx = gsap.context(() => {
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

      if (items.length > 0) {
        gsap.set(items, { autoAlpha: 0, y: 16 });
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: list,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }

      const applyScrollIndex = (progress: number) => {
        const next = indexFromProgress(progress);
        if (next === scrollActiveRef.current) return;
        scrollActiveRef.current = next;
        if (hoverActiveRef.current === null) syncActive();
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const pinRange = {
          trigger: root,
          start: "top top",
          end: `+=${services.length * 45}%`,
          scrub: 0.65,
        } as const;

        ScrollTrigger.create({
          ...pinRange,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => applyScrollIndex(self.progress),
        });

        gsap.fromTo(
          media,
          { yPercent: -5 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: pinRange,
          },
        );
      });

      mm.add("(max-width: 1023px)", () => {
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

        ScrollTrigger.create({
          trigger: root,
          start: "top 70%",
          end: "bottom 35%",
          onUpdate: (self) => applyScrollIndex(self.progress),
        });
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="services"
      className="grid grid-cols-1 gap-12 px-section py-section-y lg:h-svh lg:min-h-0 lg:grid-cols-12 lg:gap-12 lg:overflow-hidden lg:p-section"
    >
      <div className="flex flex-col justify-between gap-12 lg:col-span-5 lg:h-full lg:min-h-0 lg:py-section">
        <div data-capabilities="intro" className="opacity-0">
          <h2 className="headline text-primary-white">Capabilities</h2>
          <p className="small mt-6 max-w-md text-secondary-white">
            The residence is the commission. Around it we take the quieter
            mandates: unseen systems, one-off architecture, and the private
            running of the house after the concrete is set.
          </p>
        </div>

        <ul
          data-capabilities="list"
          className="flex w-full flex-col"
          onMouseLeave={scheduleHoverClear}
        >
          {services.map((service, index) => {
            const isActive = index === active;

            return (
              <li
                key={service.name}
                data-capabilities="item"
                className="w-full border-b border-tertiary-white/20 opacity-0"
              >
                <Link
                  href={service.href}
                  onMouseEnter={() => lockHover(index)}
                  onFocus={() => lockHover(index)}
                  className="group grid w-full grid-cols-[1fr_auto] items-center gap-6 py-5 md:py-6"
                >
                  <span
                    className={`small transition-colors duration-500 ${
                      isActive
                        ? "text-primary-white"
                        : "text-secondary-white"
                    }`}
                  >
                    {service.name}
                  </span>
                  <LinkUnderline
                    as="span"
                    className={`xs justify-self-end transition-colors duration-500 ${
                      isActive
                        ? "text-primary-white"
                        : "text-secondary-white group-hover:text-primary-white"
                    }`}
                  >
                    <span className="relative grid">
                      <span
                        className={`col-start-1 row-start-1 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? "opacity-0"
                            : "opacity-100 group-hover:opacity-0"
                        }`}
                      >
                        See details
                      </span>
                      <span
                        aria-hidden={!isActive}
                        className={`col-start-1 row-start-1 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        View service
                      </span>
                    </span>
                  </LinkUnderline>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Link
        href={current.href}
        className="group/cta group relative flex h-[42svh] min-h-0 flex-col justify-end overflow-hidden rounded-xl p-6 lg:col-span-7 lg:col-start-6 lg:h-full lg:min-h-0 lg:p-section"
        onMouseEnter={cancelHoverClear}
        onMouseLeave={scheduleHoverClear}
      >
        <div
          data-capabilities="media"
          className="absolute inset-0 scale-[1.18] will-change-transform"
        >
          {services.map((service, index) => (
            <Image
              key={service.src}
              src={service.src}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black from-10% via-black/50 to-transparent" />
        <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
          <p
            className={`lg:subheading max-w-md font-secondary transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              copyVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {emphasisedCopy(shown.copy)}
          </p>
          <LinkUnderline
            as="span"
            className="small shrink-0 justify-self-end text-secondary-white transition-colors duration-500 group-hover/cta:text-primary-white"
          >
            Click to view service
          </LinkUnderline>
        </div>
      </Link>
    </section>
  );
}
