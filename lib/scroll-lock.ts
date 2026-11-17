export const SCROLL_LOCK_EVENT = "vorte:scroll-lock";
export const SCROLL_UNLOCK_EVENT = "vorte:scroll-unlock";

let locked = false;

export function isScrollLocked() {
  return locked;
}

export function lockScroll() {
  if (locked) return;
  locked = true;
  window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
}

export function unlockScroll() {
  if (!locked) return;
  locked = false;
  window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
}
