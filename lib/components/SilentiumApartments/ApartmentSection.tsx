"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import LinkUnderline from "@/lib/components/LinkUnderline";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import type { Apartment, ApartmentImage } from "./apartments";

/**
 * 1 = next (≡ right / →): old exits up, new from below.
 * -1 = prev (≡ left / ←): old exits down, new from above.
 */
function slideDirection(from: number, to: number, length: number): 1 | -1 {
  if (length <= 1) return 1;
  const forward = (to - from + length) % length;
  const backward = (from - to + length) % length;
  return forward <= backward ? 1 : -1;
}

/** One grid cell: natural-height line, slides vertically with gallery direction. */
function ClipSlideCell({
  images,
  active,
  getText,
  className,
  textClassName,
}: {
  images: ApartmentImage[];
  active: number;
  getText: (image: ApartmentImage) => string;
  className: string;
  textClassName: string;
}) {
  const clipRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const prevActive = useRef(active);
  const ready = useRef(false);

  useEffect(() => {
    const current = prevActive.current;
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        yPercent: i === current ? 0 : 100,
        autoAlpha: i === current ? 1 : 0,
      });
    });
    ready.current = true;
  }, [images.length]);

  useEffect(() => {
    if (!ready.current) return;
    const prev = prevActive.current;
    if (prev === active) return;

    const outgoing = layerRefs.current[prev];
    const incoming = layerRefs.current[active];
    const dir = slideDirection(prev, active, images.length);
    prevActive.current = active;
    if (!outgoing || !incoming) return;

    gsap.killTweensOf([outgoing, incoming]);
    gsap.set(incoming, { yPercent: 100 * dir, autoAlpha: 1 });
    gsap
      .timeline({ defaults: { duration: 0.45, ease: "power2.inOut" } })
      .to(outgoing, { yPercent: -100 * dir }, 0)
      .to(incoming, { yPercent: 0 }, 0)
      .set(outgoing, { autoAlpha: 0, yPercent: 100 });
  }, [active, images.length]);

  const activeText = getText(images[active] ?? images[0]) || "\u00a0";

  return (
    <div ref={clipRef} className={`relative overflow-hidden ${className}`}>
      {/* In-flow sizer: natural one-line height so clip matches the <p>. */}
      <p
        aria-hidden
        className={`invisible whitespace-nowrap ${textClassName}`}
      >
        {activeText}
      </p>
      {images.map((image, index) => (
        <p
          key={`${getText(image)}-${image.src}`}
          ref={(el) => {
            layerRefs.current[index] = el;
          }}
          className={`absolute top-0 left-0 whitespace-nowrap will-change-transform ${textClassName}`}
          aria-hidden={index !== active}
        >
          {getText(image) || "\u00a0"}
        </p>
      ))}
    </div>
  );
}

function GalleryMeta({
  images,
  active,
  onSelect,
  largeRoom = false,
  moveRef,
}: {
  images: ApartmentImage[];
  active: number;
  onSelect: (index: number) => void;
  /** Larger room label for fullscreen chrome. */
  largeRoom?: boolean;
  /** Inner strip animated with overflow-clip (logo-style). */
  moveRef?: RefObject<HTMLDivElement | null>;
}) {
  const inner = (
    <div
      ref={moveRef}
      className={`grid grid-cols-6 gap-x-4 gap-y-4 will-change-transform lg:grid-cols-12 ${
        largeRoom ? "items-end" : "items-start"
      }`}
    >
      {largeRoom ? (
        <>
          <ClipSlideCell
            images={images}
            active={active}
            getText={(image) => image.room}
            className="col-span-1 min-w-0 lg:col-span-1"
            textClassName="subheading font-secondary text-primary-white"
          />
          <ClipSlideCell
            images={images}
            active={active}
            getText={(image) => image.caption}
            className="col-span-3 min-w-0 lg:col-span-4"
            textClassName="font-secondary text-[16px] leading-[1.35] text-secondary-white"
          />
        </>
      ) : (
        <>
          <div className="relative col-span-1 min-h-[1.35em] lg:col-span-1">
            {images.map((image, index) => (
              <p
                key={`room-${image.src}`}
                className={`small absolute inset-x-0 top-0 font-secondary text-primary-white transition-opacity duration-300 ${
                  index === active
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                aria-hidden={index !== active}
              >
                {image.room || "\u00a0"}
              </p>
            ))}
          </div>
          <div className="relative col-span-3 min-h-[2.7em] lg:col-span-4">
            {images.map((image, index) => (
              <p
                key={`caption-${image.src}`}
                className={`small absolute inset-x-0 top-0 text-secondary-white transition-opacity duration-300 ${
                  index === active
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                aria-hidden={index !== active}
              >
                {image.caption || "\u00a0"}
              </p>
            ))}
          </div>
        </>
      )}
      <ol
        className="col-span-4 col-start-3 flex flex-wrap justify-end gap-4 lg:col-span-6 lg:col-start-7"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              onMouseEnter={() => onSelect(index)}
              onFocus={() => onSelect(index)}
              onClick={() => onSelect(index)}
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
  );

  if (!moveRef) return inner;

  return <div className="overflow-hidden">{inner}</div>;
}

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
  const [lightbox, setLightbox] = useState(false);
  const mediaRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const lightboxMetaMoveRef = useRef<HTMLDivElement>(null);
  const lightboxCloseMoveRef = useRef<HTMLButtonElement>(null);
  const current = images[active] ?? images[0];

  const advance = () => {
    setActive((i) => (i + 1) % images.length);
  };

  const retreat = () => {
    setActive((i) => (i - 1 + images.length) % images.length);
  };

  const openLightbox = () => {
    if (lightbox || images.length === 0) return;
    setLightbox(true);
  };

  const closeLightbox = () => {
    const stage = stageRef.current;
    const media = mediaRef.current;
    const gradient = gradientRef.current;
    const chromeMove = lightboxMetaMoveRef.current;
    const closeMove = lightboxCloseMoveRef.current;

    const tl = gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: () => {
        setLightbox(false);
        unlockScroll();
      },
    });

    if (chromeMove) {
      tl.to(chromeMove, { yPercent: -130, duration: 0.4 }, 0);
    }
    if (closeMove) {
      tl.to(closeMove, { yPercent: -130, duration: 0.35 }, 0);
    }
    if (gradient) {
      tl.to(gradient, { yPercent: 100, duration: 0.45 }, 0.05);
    }

    if (stage && media) {
      const rect = media.getBoundingClientRect();
      tl.to(
        stage,
        {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 24,
          duration: 0.7,
          ease: "power3.inOut",
        },
        0.12,
      );
    } else if (stage) {
      tl.to(stage, { autoAlpha: 0, duration: 0.35 }, 0.1);
    }
  };

  useEffect(() => {
    if (!lightbox) return;

    lockScroll();
    const stage = stageRef.current;
    const media = mediaRef.current;
    const gradient = gradientRef.current;
    const chromeMove = lightboxMetaMoveRef.current;
    const closeMove = lightboxCloseMoveRef.current;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    if (chromeMove) gsap.set(chromeMove, { yPercent: -130 });
    if (closeMove) gsap.set(closeMove, { yPercent: -130 });
    if (gradient) gsap.set(gradient, { yPercent: 100 });

    if (stage && media) {
      const rect = media.getBoundingClientRect();
      tl.fromTo(
        stage,
        {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 24,
        },
        {
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 0,
          duration: 0.75,
        },
        0,
      );
    }

    // Gradient rises from the bottom as the frame opens.
    if (gradient) {
      tl.to(gradient, { yPercent: 0, duration: 0.65, ease: "power2.out" }, 0.2);
    }

    // Texts + nav enter from top after expand settles.
    if (chromeMove) {
      tl.to(
        chromeMove,
        { yPercent: 0, duration: 0.55, ease: "power2.out" },
        ">-0.08",
      );
    }
    if (closeMove) {
      tl.to(
        closeMove,
        { yPercent: 0, duration: 0.5, ease: "power2.out" },
        "<0.06",
      );
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        advance();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        retreat();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      tl.kill();
    };
  }, [lightbox, images.length]);

  if (!current) return null;

  return (
    <section className="grid grid-cols-1 gap-10 px-section py-section-y lg:min-h-svh lg:grid-cols-12 lg:gap-x-8 lg:py-section">
      <div
        className={`flex min-h-0 flex-col gap-6 lg:col-span-7 ${
          imageOnLeft ? "order-2 lg:order-1" : "order-2 lg:order-2"
        }`}
      >
        <button
          ref={mediaRef}
          type="button"
          onClick={openLightbox}
          aria-label={`Open ${apartment.name} gallery`}
          className="group relative aspect-[4/5] min-h-0 cursor-zoom-in overflow-hidden rounded-3xl lg:aspect-auto lg:flex-1"
        >
          <div className="absolute inset-0 scale-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
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
        </button>
        <GalleryMeta images={images} active={active} onSelect={setActive} />
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

      {lightbox && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={stageRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${apartment.name} gallery`}
              className="fixed inset-0 z-[999] h-[100svh] w-screen overflow-hidden bg-black"
            >
              <div className="absolute inset-0">
                {images.map((image, index) => (
                  <Image
                    key={`full-${image.src}`}
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={95}
                    sizes="100vw"
                    className={`object-cover transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      index === active ? "opacity-100" : "opacity-0"
                    }`}
                    priority
                  />
                ))}
              </div>
              {/* Invisible hit zones — left prev, right next. No chrome. */}
              <button
                type="button"
                aria-label="Previous image"
                onClick={retreat}
                className="absolute inset-y-0 left-0 w-1/2 cursor-default"
              />
              <button
                type="button"
                aria-label="Next image"
                onClick={advance}
                className="absolute inset-y-0 right-0 w-1/2 cursor-default"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] overflow-hidden">
                <div
                  ref={gradientRef}
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent will-change-transform"
                />
              </div>

              {/* Top-right wash so Close stays readable over bright photos. */}
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 h-40 w-56 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.72)_0%,transparent_70%)]"
              />

              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-end px-section pt-6">
                {/* Tight clip box = button height only, so the slide-in stays hidden. */}
                <div className="overflow-hidden">
                  <button
                    ref={lightboxCloseMoveRef}
                    type="button"
                    onClick={closeLightbox}
                    className="pointer-events-auto block font-secondary text-[16px] leading-[1.35] will-change-transform text-primary-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-section pb-section-y pt-16">
                <div className="pointer-events-auto">
                  <GalleryMeta
                    images={images}
                    active={active}
                    onSelect={setActive}
                    largeRoom
                    moveRef={lightboxMetaMoveRef}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
