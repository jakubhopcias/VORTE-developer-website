export const SILENTIUM_IMAGE = "/Silentium-building-reverse.jpg";
export const SILENTIUM_HREF = "/silentium-apartments";
export const SILENTIUM_ENTER_KEY = "vorte:silentium-enter";
export const SILENTIUM_LAYER_ATTR = "data-silentium-transition";

/** Hero parallax rest scale — clone must end here to avoid a handoff jump. */
export const SILENTIUM_HERO_SCALE = 1.2;

export function markSilentiumEnter() {
  try {
    sessionStorage.setItem(SILENTIUM_ENTER_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function consumeSilentiumEnter() {
  try {
    const value = sessionStorage.getItem(SILENTIUM_ENTER_KEY);
    if (value) sessionStorage.removeItem(SILENTIUM_ENTER_KEY);
    return value === "1";
  } catch {
    return false;
  }
}

export function getSilentiumTransitionLayer() {
  return document.querySelector<HTMLElement>(`[${SILENTIUM_LAYER_ATTR}="layer"]`);
}

export function removeSilentiumTransitionLayer() {
  getSilentiumTransitionLayer()?.remove();
}

export function getAppBlack() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-black")
    .trim();
  return value || "#181914";
}

export const HEADER_OVER_HERO_EVENT = "vorte:header-over-hero";

/** Force sticky header into top-of-hero chrome (no solid bg / border flash). */
export function forceHeaderOverHero() {
  window.dispatchEvent(new Event(HEADER_OVER_HERO_EVENT));
}
