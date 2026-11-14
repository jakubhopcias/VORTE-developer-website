export const HEADER_CHROME_EVENT = "vorte:header-chrome";

export type HeaderChromeDetail = {
  hidden: boolean;
  /** Snap back with no motion — used when the gallery unmounts mid-animation. */
  immediate?: boolean;
  accept: () => void;
  done: () => void;
};

/** Ask the header to leave or return. Resolves when the motion finishes. */
export function setHeaderChrome(hidden: boolean): Promise<void> {
  return new Promise((resolve) => {
    let accepted = false;
    window.dispatchEvent(
      new CustomEvent<HeaderChromeDetail>(HEADER_CHROME_EVENT, {
        detail: {
          hidden,
          accept: () => {
            accepted = true;
          },
          done: () => resolve(),
        },
      }),
    );
    if (!accepted) resolve();
  });
}

/** Drop a hidden header back into place without waiting for a tween. */
export function restoreHeaderChrome() {
  window.dispatchEvent(
    new CustomEvent<HeaderChromeDetail>(HEADER_CHROME_EVENT, {
      detail: {
        hidden: false,
        immediate: true,
        accept: () => {},
        done: () => {},
      },
    }),
  );
}
