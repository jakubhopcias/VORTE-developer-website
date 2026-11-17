export const INTRO_COMPLETE_EVENT = "vorte:intro-complete";
/** Curtain has started leaving — hero copy can rise while black still clears. */
export const INTRO_REVEAL_EVENT = "vorte:intro-reveal";

let introCompleted = false;
let introRevealed = false;

export function hasIntroCompleted() {
  return introCompleted;
}

export function hasIntroRevealed() {
  return introRevealed || introCompleted;
}

export function emitIntroReveal() {
  if (introRevealed) return;
  introRevealed = true;
  window.dispatchEvent(new Event(INTRO_REVEAL_EVENT));
}

export function emitIntroComplete() {
  introCompleted = true;
  introRevealed = true;
  window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
}

export function onIntroReveal(callback: () => void) {
  if (introRevealed || introCompleted) {
    callback();
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener(INTRO_REVEAL_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_REVEAL_EVENT, handler);
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
