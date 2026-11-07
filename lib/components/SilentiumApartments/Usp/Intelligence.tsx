"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_W = 340;
const REVEAL_H = 240;
/** Clip the x-ray window — never scale, or titles/copy inside would stretch. */
const MASK_CLIP_OPEN = "inset(0% round 16px)";
const MASK_CLIP_CLOSED = "inset(50% round 16px)";

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

function Callouts({
  tone,
  activeParam,
  onActiveParam,
  copyAlways = false,
}: {
  tone: "primary" | "pure";
  activeParam: number | null;
  onActiveParam?: (index: number | null) => void;
  /** Wireframe-on-top: white copy stays visible; photo copy still hover-gated. */
  copyAlways?: boolean;
}) {
  const interactive = Boolean(onActiveParam);
  const ink = tone === "primary" ? "text-primary-white" : "text-[#fff]";
  const fillColor =
    tone === "primary"
      ? "border-primary-white bg-primary-white"
      : "border-[#fff] bg-[#fff]";
  const idleColor =
    tone === "primary"
      ? "border-primary-white bg-primary-white/0"
      : "border-[#fff] bg-[#fff]/0";
  const titleClass = `font-secondary text-[24px] leading-[1.2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${ink}`;
  const copyClassName = `small transition-[opacity,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${ink}`;

  const bindParam = (index: number) =>
    onActiveParam
      ? {
          onMouseEnter: () => onActiveParam(index),
          onMouseLeave: () => onActiveParam(null),
        }
      : {};

  const hint = (index: number) => {
    const filled = activeParam === index;
    return (
      <span
        aria-hidden
        className={`size-2.5 shrink-0 rounded-full border shadow-[0_0_8px_rgba(0,0,0,0.8)] transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          filled ? `${fillColor} scale-110` : `${idleColor} scale-100`
        }`}
      />
    );
  };

  const copyClass = (index: number) =>
    copyAlways || activeParam === index ? "opacity-100" : "opacity-0";

  return (
    <div className={`absolute inset-0 ${interactive ? "" : "pointer-events-none"}`}>
      <div
        data-callout-item={interactive ? "" : undefined}
        className={`absolute top-[9%] left-[33%] ${interactive ? "cursor-default" : ""}`}
        {...bindParam(0)}
      >
        <div className="grid grid-cols-[auto_15ch_16rem] items-center gap-x-8">
          {hint(0)}
          <div className={titleClass}>{features[0].title}</div>
          <p className={`${copyClassName} ${copyClass(0)}`}>{features[0].copy}</p>
        </div>
      </div>

      <div
        data-callout-item={interactive ? "" : undefined}
        className={`absolute bottom-[8%] left-[25%] ${interactive ? "cursor-default" : ""}`}
        {...bindParam(1)}
      >
        <div className="grid grid-cols-[12ch_auto_16rem] items-end gap-x-8">
          <div className={titleClass}>{features[1].title}</div>
          <span className="mb-1.5 flex items-end">{hint(1)}</span>
          <p className={`${copyClassName} ${copyClass(1)}`}>{features[1].copy}</p>
        </div>
      </div>

      <div
        data-callout-item={interactive ? "" : undefined}
        className={`absolute top-[49%] right-[26%] flex flex-col items-start gap-3 ${interactive ? "cursor-default" : ""}`}
        {...bindParam(2)}
      >
        {hint(2)}
        <div className="flex max-w-[200px] flex-col items-start gap-6">
          <div className={titleClass}>{features[2].title}</div>
          <p className={`${copyClassName} ${copyClass(2)}`}>{features[2].copy}</p>
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

function FrameHint({
  tone,
  hovered,
  wireOnTop,
}: {
  tone: "primary" | "pure";
  hovered: boolean;
  wireOnTop: boolean;
}) {
  const color = tone === "primary" ? "text-primary-white" : "text-[#fff]";
  const idle = wireOnTop ? "Click to return" : "Hover to reveal the layer";
  const active = wireOnTop ? "Click to return" : "Click to switch";
  const showActive = hovered && !wireOnTop;

  return (
    <p
      aria-hidden={tone === "pure"}
      aria-live={tone === "primary" ? "polite" : undefined}
      className={`small pointer-events-none absolute right-6 bottom-6 grid text-right ${color}`}
    >
      <span
        className={`col-start-1 row-start-1 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showActive ? "opacity-0" : "opacity-100"
        }`}
      >
        {idle}
      </span>
      <span
        className={`col-start-1 row-start-1 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showActive ? "opacity-100" : "opacity-0"
        }`}
      >
        {active}
      </span>
    </p>
  );
}

function DesktopReveal() {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const maskScaleRef = useRef<HTMLDivElement>(null);
  const maskInnerRef = useRef<HTMLDivElement>(null);
  const wireLayerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const switchTlRef = useRef<gsap.core.Timeline | null>(null);
  const scaleRef = useRef(1);
  const pointerRef = useRef({ x: 0, y: 0, over: false });
  const rafRef = useRef(0);
  const switchingRef = useRef(false);
  const [activeParam, setActiveParam] = useState<number | null>(null);
  const [frameHovered, setFrameHovered] = useState(false);
  const [wireOnTop, setWireOnTop] = useState(false);
  const wireOnTopRef = useRef(false);
  wireOnTopRef.current = wireOnTop;

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
      clipPath: on ? MASK_CLIP_OPEN : MASK_CLIP_CLOSED,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const syncFromPointer = useCallback(() => {
    const frame = frameRef.current;
    const pointer = pointerRef.current;
    if (!frame || !pointer.over || wireOnTopRef.current) return;

    const rect = frame.getBoundingClientRect();
    const { x, y } = pointer;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      pointer.over = false;
      setFrameHovered(false);
      setMaskOpen(false);
      return;
    }

    const s = scaleRef.current || 1;
    placeMask((x - rect.left) / s, (y - rect.top) / s);
  }, [placeMask, setMaskOpen]);

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const startLoop = useCallback(() => {
    stopLoop();
    const tick = () => {
      syncFromPointer();
      if (pointerRef.current.over && !wireOnTopRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopLoop, syncFromPointer]);

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
    gsap.set(wireLayerRef.current, { opacity: 0, scale: 1 });
    gsap.set(flashRef.current, { opacity: 0 });
    gsap.set(maskScaleRef.current, { clipPath: MASK_CLIP_CLOSED });
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

  useEffect(
    () => () => {
      stopLoop();
      switchTlRef.current?.kill();
    },
    [stopLoop],
  );

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;
  }, []);

  const onEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, over: true };
      setFrameHovered(true);
      if (wireOnTopRef.current || switchingRef.current) return;
      setMaskOpen(true);
      startLoop();
    },
    [setMaskOpen, startLoop],
  );

  const onLeave = useCallback(() => {
    pointerRef.current.over = false;
    stopLoop();
    setFrameHovered(false);
    setMaskOpen(false);
    setActiveParam(null);
  }, [setMaskOpen, stopLoop]);

  const onClick = useCallback(() => {
    if (switchingRef.current) return;

    const wireLayer = wireLayerRef.current;
    const flash = flashRef.current;
    const shell = maskScaleRef.current;
    if (!wireLayer || !flash) return;

    setActiveParam(null);
    switchTlRef.current?.kill();
    switchingRef.current = true;

    if (!wireOnTopRef.current) {
      stopLoop();
      wireOnTopRef.current = true;
      setWireOnTop(true);

      const tl = gsap.timeline({
        onComplete: () => {
          if (shell) gsap.set(shell, { clipPath: MASK_CLIP_CLOSED });
          gsap.set(flash, { opacity: 0 });
          gsap.set(wireLayer, { opacity: 1, scale: 1 });
          switchingRef.current = false;
        },
      });
      switchTlRef.current = tl;

      if (shell) {
        tl.to(
          shell,
          { clipPath: MASK_CLIP_CLOSED, duration: 0.28, ease: "power2.in" },
          0,
        );
      }
      tl.set(wireLayer, { opacity: 0, scale: 1.02 }, 0);
      tl.to(
        wireLayer,
        { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" },
        0.12,
      );
      tl.fromTo(
        flash,
        { opacity: 0 },
        { opacity: 0.16, duration: 0.14, ease: "power1.out" },
        0.18,
      );
      tl.to(flash, { opacity: 0, duration: 0.4, ease: "power2.out" }, 0.32);
      return;
    }

    wireOnTopRef.current = false;
    setWireOnTop(false);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(wireLayer, { opacity: 0, scale: 1 });
        gsap.set(flash, { opacity: 0 });
        switchingRef.current = false;
        if (pointerRef.current.over) {
          setMaskOpen(true);
          startLoop();
        }
      },
    });
    switchTlRef.current = tl;

    tl.to(
      wireLayer,
      { opacity: 0, scale: 1.02, duration: 0.4, ease: "power2.inOut" },
      0,
    );
    tl.fromTo(
      flash,
      { opacity: 0.1 },
      { opacity: 0, duration: 0.35, ease: "power2.out" },
      0,
    );
  }, [setMaskOpen, startLoop, stopLoop]);

  return (
    <div
      ref={frameRef}
      role="button"
      tabIndex={0}
      aria-pressed={wireOnTop}
      aria-label={
        wireOnTop ? "Switch to photo layer" : "Switch to wireframe layer"
      }
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="relative hidden w-full cursor-pointer overflow-hidden rounded-xl lg:block"
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

        {/* Photo labels sit under the x-ray so the mask can show pure-white wire copy. */}
        <div className={wireOnTop ? "pointer-events-none" : ""}>
          <Callouts
            tone="primary"
            activeParam={activeParam}
            onActiveParam={wireOnTop ? undefined : setActiveParam}
          />
          <FrameHint
            tone="primary"
            hovered={frameHovered}
            wireOnTop={wireOnTop}
          />
        </div>

        {/* X-ray: clip-path open/close — content stays 1:1, titles never stretch. */}
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
            className="relative h-full w-full overflow-hidden rounded-2xl"
            style={{ clipPath: MASK_CLIP_CLOSED }}
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
              <Callouts tone="pure" activeParam={activeParam} copyAlways />
              <FrameHint
                tone="pure"
                hovered={frameHovered}
                wireOnTop={false}
              />
            </div>
          </div>
        </div>

        <div
          ref={wireLayerRef}
          aria-hidden={!wireOnTop}
          className={`absolute inset-0 origin-center ${
            wireOnTop ? "" : "pointer-events-none"
          }`}
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
          <Callouts
            tone="pure"
            activeParam={activeParam}
            onActiveParam={wireOnTop ? setActiveParam : undefined}
            copyAlways
          />
          <FrameHint
            tone="pure"
            hovered={frameHovered}
            wireOnTop={wireOnTop}
          />
        </div>

        <div
          ref={flashRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#fff]"
          style={{ opacity: 0 }}
        />
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
