export const SCROLL_LOCK_EVENT = "vorte:scroll-lock";
export const SCROLL_UNLOCK_EVENT = "vorte:scroll-unlock";

export function lockScroll() {
  window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
}

export function unlockScroll() {
  window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
}
