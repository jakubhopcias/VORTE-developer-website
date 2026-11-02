export const INTRO_COMPLETE_EVENT = "vorte:intro-complete";

export function emitIntroComplete() {
  window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
}

export function onIntroComplete(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(INTRO_COMPLETE_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_COMPLETE_EVENT, handler);
}
