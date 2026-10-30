"use client";

import { useState } from "react";
import Image from "next/image";

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
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section className="m-12 grid h-svh py-12 min-h-0 grid-cols-12">
      <div className="col-span-6 flex h-full min-h-0 flex-col justify-between p-8">
        <div>
          <h2 className="headline text-primary-white">Capabilities</h2>
          <p className="small mt-6 max-w-md text-secondary-white">
            The residence is the commission. Around it we take the quieter
            mandates: unseen systems, one-off architecture, and the private
            running of the house after the concrete is set.
          </p>
        </div>
        <ul className="flex flex-col gap-8">
          {services.map((service, index) => {
            const isActive = index === active;

            return (
              <li key={service.name}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(index)}
                  className="flex w-full items-center justify-between gap-6 text-left"
                >
                  <span
                    className={`small ${
                      isActive
                        ? "text-primary-white underline decoration-primary-white underline-offset-4"
                        : "text-secondary-white"
                    }`}
                  >
                    {service.name}
                  </span>
                  {isActive ? (
                    <span className="xs text-primary-white" aria-hidden>
                      +
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="relative col-span-6 flex h-full min-h-0 flex-col justify-end overflow-hidden rounded-xl p-12">
        <Image
          key={current.src}
          src={current.src}
          alt={current.name}
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black from-10% via-black/50 to-transparent" />
        <p className="subheading font-secondary relative max-w-md">
          {emphasisedCopy(current.copy)}
        </p>
      </div>
    </section>
  );
}
