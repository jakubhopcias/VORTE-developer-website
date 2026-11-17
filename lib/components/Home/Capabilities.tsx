"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Service = {
  name: string;
  /** Wrap emphasised words in **double asterisks**. */
  copy: string;
  src: string;
};

const services: Service[] = [
  {
    name: "Designing invisible smart house",
    copy: "Advanced **smart-home engineering** and climate control seamlessly integrated beneath architectural surfaces.",
    src: "/smart-home.jpg",
  },
  {
    name: "Bespoke Architecture",
    copy: "One-off volumes drawn for a single client: **structure, mass, and interior** as one commission, never repeated.",
    src: "/fancy-building.avif",
  },
  {
    name: "Private Concierge & Management",
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

export default function Capabilities() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [copyVisible, setCopyVisible] = useState(true);
  const shown = services[displayed];

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
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="services"
      className="flex min-h-svh flex-col gap-12 px-section py-section-y lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-12 lg:py-section"
    >
      <div className="flex flex-col justify-between gap-12 lg:col-span-5">
        <div data-capabilities="intro" className="opacity-0">
          <h2 className="headline text-primary-white">Capabilities</h2>
          <p className="small mt-6 max-w-md text-secondary-white">
            The residence is the commission. Around it we take the quieter
            mandates: unseen systems, one-off architecture, and the private
            running of the house after the concrete is set.
          </p>
        </div>

        <ul data-capabilities="list" className="flex w-full flex-col">
          {services.map((service, index) => {
            const isActive = index === active;

            return (
              <li
                key={service.name}
                data-capabilities="item"
                className="w-full border-b border-tertiary-white/20 opacity-0"
              >
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className="grid w-full grid-cols-1 items-center py-5 text-left md:py-6"
                >
                  <span
                    className={`small transition-colors duration-500 ${
                      isActive
                        ? "text-primary-white"
                        : "text-secondary-white hover:text-primary-white"
                    }`}
                  >
                    {service.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative flex min-h-[42svh] flex-1 flex-col justify-end overflow-hidden rounded-xl p-6 md:min-h-[50svh] lg:col-span-7 lg:col-start-6 lg:h-auto lg:min-h-0 lg:flex-none lg:p-section">
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
        <p
          className={`relative z-10 lg:subheading max-w-md font-secondary transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            copyVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {emphasisedCopy(shown.copy)}
        </p>
      </div>
    </section>
  );
}
