const VH_VAR = "--app-vh";
const HEADER_H_VAR = "--header-h";

export function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function syncViewportVars(headerEl?: HTMLElement | null) {
  const vh = getViewportHeight();
  const root = document.documentElement;
  root.style.setProperty(VH_VAR, `${vh}px`);

  const header =
    headerEl ?? document.querySelector<HTMLElement>("[data-header]");
  if (header) {
    const bar = header.querySelector<HTMLElement>(":scope > div");
    const height = bar?.getBoundingClientRect().height || header.offsetHeight || 57;
    root.style.setProperty(HEADER_H_VAR, `${height}px`);
  }
}
