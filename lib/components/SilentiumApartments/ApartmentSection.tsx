"use client";

import Image from "next/image";
import { useState } from "react";
import LinkUnderline from "@/lib/components/LinkUnderline";
import type { Apartment, ApartmentImage } from "./apartments";

export default function ApartmentSection({
  apartment,
  images,
  imageOnLeft,
}: {
  apartment: Apartment;
  images: ApartmentImage[];
  imageOnLeft: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) return null;

  return (
    <section className="grid grid-cols-1 gap-10 px-section py-section-y lg:min-h-svh lg:grid-cols-12 lg:gap-x-8 lg:py-section">
      <div
        className={`flex min-h-0 flex-col gap-6 lg:col-span-7 ${
          imageOnLeft ? "order-2 lg:order-1" : "order-2 lg:order-2"
        }`}
      >
        <div className="relative aspect-[4/5] min-h-0 overflow-hidden rounded-3xl lg:aspect-auto lg:flex-1">
          {images.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              quality={95}
              sizes="(max-width: 1024px) 100vw, min(58vw, 1400px)"
              className={`object-cover transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
              priority={index === 0}
            />
          ))}
        </div>
        <div className="grid grid-cols-6 items-start gap-x-4 gap-y-4 lg:grid-cols-7">
          {/* Fixed-height stacks — switching images must not reflow the row. */}
          <div className="relative col-span-2 min-h-[1.35em]">
            {images.map((image, index) => (
              <p
                key={`room-${image.src}`}
                className={`small absolute inset-x-0 top-0 text-primary-white transition-opacity duration-300 ${
                  index === active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={index !== active}
              >
                {image.room || "\u00a0"}
              </p>
            ))}
          </div>
          <div className="relative col-span-4 min-h-[2.7em] lg:col-span-2">
            {images.map((image, index) => (
              <p
                key={`caption-${image.src}`}
                className={`small absolute inset-x-0 top-0 text-secondary-white transition-opacity duration-300 ${
                  index === active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={index !== active}
              >
                {image.caption || "\u00a0"}
              </p>
            ))}
          </div>
          <ol className="col-span-4 col-start-3 flex flex-wrap justify-end gap-4 lg:col-span-2 lg:col-start-6">
            {images.map((image, index) => (
              <li key={image.src}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  aria-label={`Show image ${String(index + 1).padStart(2, "0")}`}
                  aria-current={index === active ? "true" : undefined}
                  className={`small transition-colors duration-300 ${
                    index === active
                      ? "text-primary-white"
                      : "text-secondary-white hover:text-primary-white"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        className={`flex h-full flex-col justify-between gap-10 lg:col-span-5 lg:py-2 ${
          imageOnLeft ? "order-1 lg:order-2" : "order-1 lg:order-1"
        }`}
      >
        <div className="flex flex-col gap-8">
          <h2 className="headline text-primary-white">{apartment.name}</h2>
          <p className="small max-w-md text-secondary-white">
            {apartment.summary}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <ul className="flex w-full flex-col">
            {(
              [
                ["Area", apartment.area],
                ...(apartment.outdoor
                  ? ([["Outdoor", apartment.outdoor]] as const)
                  : []),
                ["Ceiling Height", apartment.ceilingHeight],
                ["Layout", apartment.layout],
                ["Access", apartment.access],
              ] as const
            ).map(([label, value]) => (
              <li
                key={label}
                className="group w-full border-b border-tertiary-white/20"
              >
                <div className="grid w-full grid-cols-[minmax(0,9rem)_minmax(0,1fr)] items-start gap-x-6 py-5 md:gap-x-8 md:py-6">
                  <span className="small text-secondary-white transition-colors duration-500 group-hover:text-primary-white">
                    {label}
                  </span>
                  <span className="small text-primary-white">{value}</span>
                </div>
              </li>
            ))}
          </ul>
          <div
            className={`flex ${imageOnLeft ? "justify-end" : "justify-start"}`}
          >
            <LinkUnderline
              href={apartment.floorplan}
              download
              from={imageOnLeft ? "right" : "left"}
              className="small text-primary-white"
            >
              Download floorplan
            </LinkUnderline>
          </div>
        </div>
      </div>
    </section>
  );
}
