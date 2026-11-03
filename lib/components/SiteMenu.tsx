"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import LogoMark from "@/lib/components/LogoMark";
import LinkUnderline from "@/lib/components/LinkUnderline";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

type SiteMenuProps = {
  open: boolean;
  onClose: () => void;
};

type MenuItem = {
  id: string;
  label: string;
  href: string;
  copy: string;
  kind: "primary" | "service";
};

const items: MenuItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    copy: "Private architectural commissions shaped as singular residences, never repeated.",
    kind: "primary",
  },
  {
    id: "silentium",
    label: "Silentium apartments",
    href: "/silentium-apartments",
    copy: "An enclave of total silence and monolithic concrete mass — three residences in one poured volume.",
    kind: "primary",
  },
  {
    id: "smart-house",
    label: "Smart house designing",
    href: "/services/invisible-smart-house",
    copy: "We design smart houses from scratch to develop your experience — systems held beneath architectural surfaces.",
    kind: "service",
  },
  {
    id: "bespoke",
    label: "Bespoke architecture",
    href: "/services/bespoke-architecture",
    copy: "One-off volumes drawn for a single client: structure, mass, and interior as one commission.",
    kind: "service",
  },
  {
    id: "concierge",
    label: "Private concierge and management",
    href: "/services/private-concierge",
    copy: "Household operations, access, and maintenance held under the same NDA as the building itself.",
    kind: "service",
  },
];

const primaryItems = items.filter((item) => item.kind === "primary");
const serviceItems = items.filter((item) => item.kind === "service");

function itemIdForPath(pathname: string) {
  const match = items.find((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.id ?? items[0].id;
}

export default function SiteMenu({ open, onClose }: SiteMenuProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const logoMoveRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(items[0].id);
  const [displayedId, setDisplayedId] = useState(items[0].id);
  const [copyVisible, setCopyVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const active = items.find((item) => item.id === displayedId) ?? items[0];

  useEffect(() => {
    if (!open) return;
    const id = itemIdForPath(pathname);
    setActiveId(id);
    setDisplayedId(id);
    setCopyVisible(true);
    setMounted(true);
  }, [open, pathname]);

  useEffect(() => {
    if (activeId === displayedId) return;
    setCopyVisible(false);
    const timer = window.setTimeout(() => {
      setDisplayedId(activeId);
      setCopyVisible(true);
    }, 90);
    return () => window.clearTimeout(timer);
  }, [activeId, displayedId]);

  useEffect(() => {
    if (!mounted) return;

    const root = rootRef.current;
    const menuLogoMove = logoMoveRef.current;
    const headerLogoMove = document.querySelector<HTMLElement>(
      "[data-header-logo-move]",
    );
    if (!root || !menuLogoMove) return;

    const previousOverflow = document.body.style.overflow;
    const reveals = root.querySelectorAll("[data-menu='reveal']");
    const tl = gsap.timeline();

    if (open) {
      lockScroll();
      document.body.style.overflow = "hidden";

      tl.fromTo(
        root,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
        0,
      );

      if (headerLogoMove) {
        tl.to(
          headerLogoMove,
          {
            yPercent: 130,
            duration: 0.4,
            ease: "power2.in",
          },
          0,
        );
      }

      tl.fromTo(
        menuLogoMove,
        { yPercent: -130 },
        {
          yPercent: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        0.22,
      );

      tl.fromTo(
        reveals,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.out",
        },
        0.18,
      );
    } else {
      tl.to(
        reveals,
        {
          autoAlpha: 0,
          y: 8,
          duration: 0.22,
          ease: "power2.in",
        },
        0,
      );

      tl.to(
        menuLogoMove,
        {
          yPercent: 130,
          duration: 0.4,
          ease: "power2.in",
        },
        0,
      );

      if (headerLogoMove) {
        tl.fromTo(
          headerLogoMove,
          { yPercent: -130 },
          {
            yPercent: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          0.2,
        );
      }

      tl.to(root, { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 0.28);

      tl.add(() => {
        gsap.set(menuLogoMove, { clearProps: "transform" });
        if (headerLogoMove) gsap.set(headerLogoMove, { clearProps: "transform" });
        document.body.style.overflow = previousOverflow;
        unlockScroll();
        setMounted(false);
      });
    }

    return () => {
      tl.kill();
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[80] flex flex-col bg-black px-section opacity-0"
    >
      <div className="relative flex h-[57px] shrink-0 items-center justify-between">
        <div className="overflow-hidden text-primary-white">
          <div
            ref={logoMoveRef}
            data-menu-logo-move
            className="will-change-transform"
          >
            <LogoMark className="h-[0.8125rem] w-auto" />
          </div>
          <span className="sr-only">VORTE</span>
        </div>
        <button
          type="button"
          data-menu="reveal"
          onClick={onClose}
          className="small text-secondary-white transition-colors duration-300 hover:text-primary-white"
        >
          Close
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 content-center items-stretch gap-12 md:grid-cols-12 md:gap-12">
        <nav
          data-menu="reveal"
          aria-label="Primary"
          className="flex flex-col gap-16 md:col-span-5 md:col-start-3"
        >
          {primaryItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              className={`title font-secondary transition-colors duration-150 ${
                activeId === item.id
                  ? "text-primary-white"
                  : "text-secondary-white hover:text-primary-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex items-stretch gap-5">
            <div
              className="flex shrink-0 flex-col justify-center items-center gap-4 text-tertiary-white"
              aria-hidden
            >
              <span className="w-px h-full bg-current" />
              <span
                className="small flex items-center"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                Services
              </span>
              <span className="w-px h-full bg-current" />
            </div>
            <div className="flex flex-col gap-12">
              {serviceItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  className={`subtitle font-secondary transition-colors duration-150 ${
                    activeId === item.id
                      ? "text-primary-white"
                      : "text-secondary-white hover:text-primary-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div
          data-menu="reveal"
          className="flex flex-col justify-between items-end md:col-span-3 md:col-start-8 md:h-full"
        >
          <p
            className={`small max-w-sm text-secondary-white transition-opacity duration-150 ${
              copyVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {active.copy}
          </p>
          <Link href="#footer" onClick={onClose} className="group w-fit">
            <LinkUnderline
              as="span"
              className="small text-secondary-white transition-colors duration-300 group-hover:text-primary-white"
            >
              Schedule audience
            </LinkUnderline>
          </Link>
        </div>
      </div>
    </div>
  );
}
