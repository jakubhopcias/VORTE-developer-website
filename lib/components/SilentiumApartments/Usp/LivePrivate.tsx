"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    n: "01",
    label: "Pure White Matte Finish",
    src: "/wall-layers/matte-finish.png",
  },
  {
    n: "02",
    label: "Dense Acoustic Panel",
    src: "/wall-layers/dense-accoustic-panel.png",
  },
  {
    n: "03",
    label: "Acoustic Dampening Membrane",
    src: "/wall-layers/acoustic-dampening-membrane.png",
  },
  {
    n: "04",
    label: "Dense Acoustic Panel",
    src: "/wall-layers/dense-accoustic-panel.png",
  },
  {
    n: "05",
    label: "Concrete wall",
    src: "/wall-layers/concrete-wall.png",
  },
];

/** Pull each layer toward the middle index (2). */
function compressX(index: number, amount: number) {
  return (2 - index) * amount;
}

export default function LivePrivate() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const items = gsap.utils.toArray<HTMLElement>(
      track.querySelectorAll("[data-layer]"),
    );
    if (items.length < 2) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const getAmount = () =>
        Math.min(140, Math.max(72, window.innerWidth * 0.055));

      const apply = (progress: number) => {
        // 0 at edges, 1 when section center hits viewport center.
        const spread = 1 - Math.abs(progress - 0.5) * 2;
        const amount = getAmount() * (1 - spread);

        items.forEach((el, i) => {
          gsap.set(el, { x: compressX(i, amount), force3D: true });
        });
      };

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.45,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });

      apply(st.progress);

      return () => {
        st.kill();
        gsap.set(items, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="flex h-fit flex-col gap-10 px-section py-section-y lg:gap-24 lg:py-section"
    >
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-end">
        <h2 className="headline text-primary-white lg:col-span-6">
          5 layers of sound isolation
        </h2>
        <p className="small max-w-md text-secondary-white lg:col-span-4 lg:col-start-8">
          Acoustic isolation engineered at a structural level. Multi-layer
          monolithic concrete walls and triple-glazed panoramic facades create
          an absolute perimeter of silence — attenuating up to{" "}
          <span className="text-primary-white">62 dB</span> of airborne noise.
        </p>
      </div>

      <div
        ref={trackRef}
        className="grid h-fit grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-16"
      >
        {layers.map((layer) => (
          <div
            key={layer.n}
            data-layer
            className="flex h-fit flex-col gap-4 will-change-transform"
          >
            <div className="relative mx-auto aspect-square w-64">
              <Image
                src={layer.src}
                alt={layer.label}
                fill
                sizes="224px"
                className="object-contain object-center"
              />
            </div>
            <div className="grid shrink-0 grid-cols-3 items-start gap-6">
              <span className="small col-span-1 text-end text-primary-white">
                {layer.n}
              </span>
              <span className="small col-span-2 text-secondary-white">
                {layer.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
