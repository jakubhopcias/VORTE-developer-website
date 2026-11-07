"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_W = 340;
const REVEAL_H = 240;

/** Design stage — callout % positions were tuned against this frame. */
const DESIGN_W = 1440;
const DESIGN_H = Math.round((1440 * 1536) / 2752);

const features = [
  {
    title: "Concealed HVAC Infrastructure",
    copy: "Supply and return ducts run in the ceiling void. Remote setpoint — no wall thermostats.",
    photo: "/invisible-tech/hvac.png",
    wireframe: "/invisible-tech/hvac-wireframe.png",
  },
  {
    title: "Integrated Floor Heating",
    copy: "Hydronic loops cast into the slab. Even surface heat, zero radiators or floor vents.",
    photo: "/invisible-tech/floor.png",
    wireframe: "/invisible-tech/floor-wireframe.png",
  },
  {
    title: "Invisible Automation and Sensors",
    copy: "Occupancy, lux, and access sensors sit behind finishes. No panels, no LEDs.",
    photo: "/invisible-tech/panels.png",
    wireframe: "/invisible-tech/panels-wireframe.png",
  },
] as const;

function Callouts({ tone }: { tone: "primary" | "pure" }) {
  const interactive = tone === "primary";
  const title = tone === "primary" ? "text-primary-white" : "text-[#fff]";
  const copyColor = tone === "primary" ? "text-primary-white" : "text-[#fff]";
  const dotBorder =
    tone === "primary" ? "border-primary-white" : "border-[#fff]";
  const dotFill =
    tone === "primary" ? "group-hover/callout:bg-primary-white" : "bg-[#fff]";

  const dot = (
    <span
      aria-hidden
      className={`size-2.5 shrink-0 rounded-full border bg-transparent shadow-[0_0_8px_rgba(0,0,0,0.8)] transition-[background-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${dotBorder} ${dotFill} ${
        tone === "primary" ? "group-hover/callout:scale-110" : "scale-110"
      }`}
    />
  );

  const copyClass =
    tone === "pure"
      ? "opacity-100"
      : "opacity-0 group-hover/callout:opacity-100";

  return (
    <div
      className={`absolute inset-0 ${interactive ? "" : "pointer-events-none"}`}
      aria-hidden={tone === "pure"}
    >
      <div
        data-callout-item={tone === "primary" ? "" : undefined}
        className={`group/callout absolute top-[7%] left-[33%] ${interactive ? "cursor-default" : ""}`}
      >
        <div className="grid grid-cols-[auto_15ch_16rem] items-center gap-x-8">
          {dot}
          <div className={`font-secondary text-[24px] leading-[1.2] ${title}`}>
            {features[0].title}
          </div>
          <p
            className={`small transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${copyColor} ${copyClass}`}
          >
            {features[0].copy}
          </p>
        </div>
      </div>

      <div
        data-callout-item={tone === "primary" ? "" : undefined}
        className={`group/callout absolute bottom-[8%] left-[25%] ${interactive ? "cursor-default" : ""}`}
      >
        <div className="grid grid-cols-[12ch_auto_16rem] items-end gap-x-8">
          <div className={`font-secondary text-[24px] leading-[1.2] ${title}`}>
            {features[1].title}
          </div>
          <span className="mb-1.5 flex items-end">{dot}</span>
          <p
            className={`small transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${copyColor} ${copyClass}`}
          >
            {features[1].copy}
          </p>
        </div>
      </div>

      <div
        data-callout-item={tone === "primary" ? "" : undefined}
        className={`group/callout absolute top-[50%] right-[29%] flex flex-col items-start gap-3 ${interactive ? "cursor-default" : ""}`}
      >
        {dot}
        <div className="flex max-w-[200px] flex-col items-start gap-6">
          <div className={`font-secondary text-[24px] leading-[1.2] ${title}`}>
            {features[2].title}
          </div>
          <p
            className={`small transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${copyColor} ${copyClass}`}
          >
            {features[2].copy}
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileTiles() {
  const [wired, setWired] = useState<boolean[]>(() =>
    features.map(() => false),
  );

  const toggle = (index: number) => {
    setWired((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <div className="flex flex-col items-center gap-10 md:grid md:grid-cols-2 md:items-start md:justify-items-center lg:hidden">
      {features.map((feature, index) => {
        const showWire = wired[index];
        const isLast = index === features.length - 1;

        return (
          <article
            key={feature.title}
            className={`flex w-[min(100%,28rem)] flex-col justify-between gap-5 ${
              isLast ? "md:col-span-2" : ""
            }`}
          >
            <h3 className="font-secondary text-[1.25rem] leading-[1.2] text-primary-white md:text-[24px]">
              {feature.title}
            </h3>

            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-pressed={showWire}
                aria-label={
                  showWire
                    ? `Show photo for ${feature.title}`
                    : `Show wireframe for ${feature.title}`
                }
                className="relative aspect-[3/2] w-full overflow-hidden rounded-xl text-left"
              >
                <Image
                  src={feature.photo}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 70vw, 50vw"
                  className={`object-cover object-center transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    showWire ? "opacity-0" : "opacity-100"
                  }`}
                />
                <Image
                  src={feature.wireframe}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 70vw, 50vw"
                  className={`object-cover object-center transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    showWire ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black/8"
                />

                <span className="pointer-events-none absolute right-4 bottom-4 flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`size-2.5 rounded-full border border-primary-white transition-[background-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      showWire
                        ? "scale-110 bg-primary-white"
                        : "scale-100 bg-transparent"
                    }`}
                  />
                  <span className="small text-primary-white">
                    {showWire ? "Tap for photo" : "Tap to reveal"}
                  </span>
                </span>
              </button>

              <p className="small max-w-md text-secondary-white">
                {feature.copy}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DesktopReveal() {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const maskScaleRef = useRef<HTMLDivElement>(null);
  const maskInnerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const scaleRef = useRef(1);

  const placeMask = useCallback((x: number, y: number) => {
    const mask = maskRef.current;
    const inner = maskInnerRef.current;
    if (!mask || !inner) return;
    mask.style.left = `${x}px`;
    mask.style.top = `${y}px`;
    inner.style.left = `${-(x - REVEAL_W / 2)}px`;
    inner.style.top = `${-(y - REVEAL_H / 2)}px`;
  }, []);

  const setMaskOpen = useCallback((on: boolean) => {
    const shell = maskScaleRef.current;
    if (!shell) return;
    gsap.to(shell, {
      scale: on ? 1 : 0,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const setHint = useCallback((on: boolean) => {
    const hint = hintRef.current;
    if (!hint) return;
    hint.classList.toggle("translate-y-1", on);
    hint.classList.toggle("text-primary-white", on);
    hint.classList.toggle("opacity-0", on);
    hint.classList.toggle("translate-y-0", !on);
    hint.classList.toggle("text-secondary-white", !on);
    hint.classList.toggle("opacity-100", !on);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!frame || !stage) return;

    const ro = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width / DESIGN_W;
      scaleRef.current = next;
      stage.style.transform = `scale(${next})`;
    });
    ro.observe(frame);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const items = frame.querySelectorAll<HTMLElement>("[data-callout-item]");
    if (!items.length) return;

    gsap.set(items, { autoAlpha: 0, y: 14 });

    const tween = gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.14,
      ease: "power2.out",
      scrollTrigger: {
        trigger: frame,
        start: "top 70%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = scaleRef.current || 1;
      placeMask((e.clientX - rect.left) / s, (e.clientY - rect.top) / s);
    },
    [placeMask],
  );

  const onEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setHint(true);
      setMaskOpen(true);
      onMove(e);
    },
    [onMove, setHint, setMaskOpen],
  );

  const onLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setHint(false);
      setMaskOpen(false);
      onMove(e);
    },
    [onMove, setHint, setMaskOpen],
  );

  return (
    <div
      ref={frameRef}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative hidden w-full overflow-hidden rounded-xl lg:block"
      style={{ aspectRatio: `${DESIGN_W} / ${DESIGN_H}` }}
    >
      <div
        ref={stageRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: "scale(1)",
        }}
      >
        <Image
          src="/invisible-tech/invisible-tech-apartment.jpg"
          alt="Apartment with invisible technology"
          width={DESIGN_W}
          height={DESIGN_H}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/8"
        />
        <Callouts tone="primary" />

        <p
          ref={hintRef}
          className="small pointer-events-none absolute right-6 bottom-6 translate-y-0 text-secondary-white opacity-100 transition-[opacity,transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          Hover to reveal the layer
        </p>

        <div
          ref={maskRef}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            width: REVEAL_W,
            height: REVEAL_H,
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            ref={maskScaleRef}
            className="relative h-full w-full origin-center overflow-hidden rounded-2xl"
            style={{ transform: "scale(0)" }}
          >
            <div
              ref={maskInnerRef}
              className="absolute"
              style={{
                width: DESIGN_W,
                height: DESIGN_H,
                left: 0,
                top: 0,
              }}
            >
              <Image
                src="/invisible-tech/invisible-tech.png"
                alt=""
                width={DESIGN_W}
                height={DESIGN_H}
                sizes="100vw"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black/8"
              />
              <Callouts tone="pure" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Intelligence() {
  return (
    <section className="flex flex-col gap-10 px-section py-section-y lg:gap-8 lg:py-section">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-end md:gap-8">
        <h2 className="headline text-primary-white md:col-span-6">
          Technology you can only feel
        </h2>
        <p className="small max-w-md text-secondary-white md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-8">
          Climate, security, and lighting integrated invisibly beneath raw
          architectural surfaces. No visible panels, no blinking LEDs—just
          responsive living spaces that anticipate your presence.
        </p>
      </div>

      <MobileTiles />
      <DesktopReveal />
    </section>
  );
}
