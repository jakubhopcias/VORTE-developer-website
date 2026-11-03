export const INTRO_COMPLETE_EVENT = "vorte:intro-complete";

let introCompleted = false;

export function hasIntroCompleted() {
  return introCompleted;
}

export function emitIntroComplete() {
  introCompleted = true;
  window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
}

export function onIntroComplete(callback: () => void) {
  if (introCompleted) {
    callback();
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener(INTRO_COMPLETE_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_COMPLETE_EVENT, handler);
}
