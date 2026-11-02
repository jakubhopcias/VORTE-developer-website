"use client";

import { useEffect } from "react";

const TARGET_SELECTOR = [
  "main :is(h1, h2, h3, h4, p, a, li, dt, dd, label, figcaption, button)",
  "footer :is(h1, h2, h3, h4, p, a, li, dt, dd, label, button)",
  "[data-death-zone]",
].join(", ");

const FEATHER = 14;

function clearMask(el: HTMLElement) {
  el.style.maskImage = "";
  el.style.webkitMaskImage = "";
}

function applyMask(el: HTMLElement, clipTop: number) {
  const softStart = Math.max(0, clipTop - FEATHER);
  const gradient = `linear-gradient(to bottom, transparent 0px, transparent ${softStart}px, black ${clipTop}px, black 100%)`;
  el.style.maskImage = gradient;
  el.style.webkitMaskImage = gradient;
}

export default function DeathZone() {
  useEffect(() => {
    let frame = 0;

    const update = () => {
      const header = document.querySelector<HTMLElement>("[data-header]");
      if (!header) return;

      const headerBottom = header.getBoundingClientRect().bottom;
      const targets = document.querySelectorAll<HTMLElement>(TARGET_SELECTOR);

      for (const el of targets) {
        if (
          el.closest(
            "[data-header], [data-intro], [data-death-zone-ignore], img, picture, video",
          )
        ) {
          clearMask(el);
          continue;
        }

        const rect = el.getBoundingClientRect();

        if (
          rect.height === 0 ||
          rect.bottom <= 0 ||
          rect.top >= window.innerHeight ||
          rect.top >= headerBottom
        ) {
          clearMask(el);
          continue;
        }

        const clipTop = Math.min(rect.height, headerBottom - rect.top);
        if (clipTop <= 0) {
          clearMask(el);
          continue;
        }

        applyMask(el, clipTop);
      }
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    const observer = new MutationObserver(requestUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      observer.disconnect();

      document
        .querySelectorAll<HTMLElement>(TARGET_SELECTOR)
        .forEach(clearMask);
    };
  }, []);

  return null;
}
