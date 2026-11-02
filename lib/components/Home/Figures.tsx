"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Figure = {
  value: string;
  prefix?: string;
  unit?: string;
  copy: string;
};

const figures: Figure[] = [
  {
    prefix: "€ ",
    value: "140",
    unit: " M+",
    copy: "Total value of completed high-end residential and architectural assets.",
  },
  {
    value: "3",
    copy: "Maximum number of private residential commissions accepted per year.",
  },
  {
    value: "50",
    unit: " Yrs",
    copy: "Minimum certified durability standard for monolithic concrete structures.",
  },
  {
    value: "100",
    unit: "%",
    copy: "Transactions and private viewings executed under strict multi-layer NDA protocols.",
  },
];

function countStart(target: number) {
  if (target <= 3) return 1;
  return Math.max(0, Math.round(target * 0.62));
}

export default function Figures() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = root.querySelector<HTMLElement>("[data-figures='media']");
    const rows = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-figures='row']"),
    );

    if (!media || rows.length === 0) return;

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

      // Animate only while the section settles into full view, so rows at the
      // bottom of the screen still show counting — finished by `top top`.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top 55%",
          end: "top top",
          scrub: 0.7,
        },
      });

      rows.forEach((row) => {
        const value = row.querySelector<HTMLElement>("[data-figures='value']");
        const count = row.querySelector<HTMLElement>("[data-figures='count']");
        const copy = row.querySelector<HTMLElement>("[data-figures='copy']");
        if (!value || !count || !copy) return;

        const target = Number(count.dataset.target ?? "0");
        const start = countStart(target);
        const counter = { val: start };

        count.textContent = String(start);
        gsap.set(value, { autoAlpha: 0, y: 10 });
        gsap.set(copy, { autoAlpha: 0, y: 10 });

        tl.to(
          value,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "+=0.08",
        )
          .to(
            counter,
            {
              val: target,
              duration: 0.85,
              ease: "power4.out",
              onUpdate: () => {
                count.textContent = String(Math.round(counter.val));
              },
            },
            "<",
          )
          .to(
            copy,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.55",
          );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="figures"
      className="grid grid-cols-1 gap-12 px-section py-section-y md:h-svh md:min-h-0 md:grid-cols-12 md:items-stretch md:gap-8 md:overflow-hidden md:p-section"
    >
      <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-xl md:order-1 md:col-span-5 md:aspect-auto md:h-full md:min-h-0">
        <div
          data-figures="media"
          className="absolute inset-0 scale-[1.18] will-change-transform"
        >
          <Image
            src="/concrete-and-chair.png"
            alt="Concrete interior with a lounge chair"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>
      <ul
        data-figures="list"
        className="mx-auto order-2 grid w-full max-w-md grid-cols-1 gap-8 md:mx-0 md:max-w-none md:col-span-7 md:h-full md:content-evenly md:gap-0 md:py-section lg:col-span-5 lg:col-start-7"
      >
        {figures.map((figure) => (
          <li
            key={figure.copy}
            data-figures="row"
            className="grid grid-cols-6 items-start md:items-center md:grid-cols-[minmax(8rem,auto)_1fr] md:gap-8 lg:gap-12"
          >
            <p
              data-figures="value"
              className="title col-span-2 flex items-baseline text-primary-white opacity-0 md:col-auto"
            >
              {figure.prefix ? (
                <span className="subheading text-secondary-white">
                  {figure.prefix}
                </span>
              ) : null}
              <span data-figures="count" data-target={figure.value}>
                {figure.value}
              </span>
              {figure.unit ? (
                <span className="subheading text-secondary-white">
                  {figure.unit}
                </span>
              ) : null}
            </p>
            <p
              data-figures="copy"
              className="small col-span-3 col-start-4 text-secondary-white opacity-0 md:col-auto md:col-start-auto md:max-w-xs"
            >
              {figure.copy}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
