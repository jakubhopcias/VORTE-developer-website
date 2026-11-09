"use client";

import {
  type AnimationEvent,
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoMark from "@/lib/components/LogoMark";

/**
 * Chrome keeps :-webkit-autofill after fill and paints words after the first
 * black. Re-writing value through the native setter drops that pseudo-state
 * so the field renders as normal typed text (full cream).
 */
function exitAutofillPaint(el: HTMLInputElement | HTMLTextAreaElement) {
  const value = el.value;
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
  if (!descriptor?.set) return;

  descriptor.set.call(el, "");
  descriptor.set.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function onAutofillAnimation(event: AnimationEvent<HTMLElement>) {
  if (event.animationName !== "vorte-autofill-text") return;
  const el = event.currentTarget;
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
    return;
  }
  if (el.dataset.afNorm === "1") return;
  el.dataset.afNorm = "1";
  // After Chrome applies autofill paint — next frame, drop autofill state.
  requestAnimationFrame(() => {
    exitAutofillPaint(el);
    delete el.dataset.afNorm;
  });
}

gsap.registerPlugin(ScrollTrigger);

type FieldKey = "fullName" | "email" | "phone" | "enquiry";
type ReachBy = "email" | "phone";

type Field = {
  key: FieldKey;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  autoComplete: string;
};

type Step = {
  label: string;
  /** Static fields for this step. Step 1 (Reach you) is channel-driven instead. */
  fields?: Field[];
  kind?: "you" | "reach" | "enquiry";
};

const steps: Step[] = [
  {
    label: "You",
    kind: "you",
    fields: [
      {
        key: "fullName",
        label: "Full name",
        type: "text",
        autoComplete: "name",
      },
    ],
  },
  {
    label: "Reach you",
    kind: "reach",
  },
  {
    label: "Enquiry",
    kind: "enquiry",
    fields: [
      {
        key: "enquiry",
        label: "Enquiry",
        type: "textarea",
        autoComplete: "off",
      },
    ],
  },
];

const emptyValues: Record<FieldKey, string> = {
  fullName: "",
  email: "",
  phone: "",
  enquiry: "",
};

function fieldError(key: FieldKey, value: string) {
  const trimmed = value.trim();

  if (key === "fullName" && trimmed.length < 2) {
    return "Enter your full name.";
  }

  if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email.";
  }

  if (key === "phone" && trimmed.replace(/\D/g, "").length < 6) {
    return "Enter a phone number.";
  }

  if (key === "enquiry" && trimmed.length < 1) {
    return "Write your enquiry.";
  }

  return "";
}

function fieldsForStep(index: number, reachBy: ReachBy): Field[] {
  const step = steps[index];
  if (step.kind === "reach") {
    return reachBy === "email"
      ? [
          {
            key: "email",
            label: "Email",
            type: "email",
            autoComplete: "email",
          },
        ]
      : [
          {
            key: "phone",
            label: "Phone",
            type: "tel",
            autoComplete: "tel",
          },
        ];
  }
  return step.fields ?? [];
}

function isStepValid(
  index: number,
  values: Record<FieldKey, string>,
  reachBy: ReachBy,
) {
  return fieldsForStep(index, reachBy).every(
    (field) => !fieldError(field.key, values[field.key]),
  );
}

/** Highest step index openable: all earlier steps must still be valid. */
function maxUnlockedStep(
  values: Record<FieldKey, string>,
  reachBy: ReachBy,
) {
  let unlocked = 0;
  for (let i = 0; i < steps.length - 1; i++) {
    if (!isStepValid(i, values, reachBy)) break;
    unlocked = i + 1;
  }
  return unlocked;
}

type Phase = "form" | "sending" | "sent";

const SEND_SIM_MS = 1600;

export default function Footer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [reachBy, setReachBy] = useState<ReachBy>("email");
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [phase, setPhase] = useState<Phase>("form");
  const [busy, setBusy] = useState(false);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fieldSwapRef = useRef<HTMLDivElement>(null);
  const didAdvance = useRef(false);
  const pendingInRef = useRef<HTMLElement | null>(null);
  const sendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyRef = useRef(false);
  const unlocked = maxUnlockedStep(values, reachBy);
  const step = steps[stepIndex];
  const activeFields = fieldsForStep(stepIndex, reachBy);
  const canProceed = isStepValid(stepIndex, values, reachBy);
  const lockedFlow = phase !== "form";
  const sent = phase === "sent";
  const sending = phase === "sending";

  busyRef.current = busy;

  /** Fade out → commit state → fade in (after paint). */
  function swapPanel(target: HTMLElement | null, apply: () => void) {
    if (!target || busyRef.current) {
      apply();
      return;
    }

    busyRef.current = true;
    setBusy(true);
    gsap.killTweensOf(target);
    gsap.to(target, {
      autoAlpha: 0,
      duration: 0.28,
      ease: "sine.in",
      onComplete: () => {
        apply();
        pendingInRef.current = target;
      },
    });
  }

  // Reveal after React commits the swapped content.
  useLayoutEffect(() => {
    const target = pendingInRef.current;
    if (!target) return;
    pendingInRef.current = null;

    gsap.killTweensOf(target);
    gsap.fromTo(
      target,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.45,
        ease: "power3.out",
        onComplete: () => {
          busyRef.current = false;
          setBusy(false);
          if (didAdvance.current && phase === "form") {
            fieldRef.current?.focus();
          }
        },
      },
    );
  }, [stepIndex, reachBy, phase]);

  // Simulated send: brief loader, then success copy.
  useEffect(() => {
    if (phase !== "sending") return;

    sendTimerRef.current = setTimeout(() => {
      swapPanel(panelRef.current, () => {
        setPhase("sent");
      });
    }, SEND_SIM_MS);

    return () => {
      if (sendTimerRef.current) clearTimeout(sendTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // If an earlier step is cleared/invalidated, drop back to the last openable step.
  useEffect(() => {
    if (lockedFlow || busy) return;
    if (stepIndex > unlocked) {
      swapPanel(panelRef.current, () => {
        setErrors({});
        setStepIndex(unlocked);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, stepIndex, lockedFlow, busy]);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const ctx = gsap.context(() => {
      gsap.set(heading, { autoAlpha: 0, y: 20 });
      gsap.to(heading, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    }, heading);

    return () => ctx.revert();
  }, []);

  function validateStep(index: number) {
    const nextErrors: Partial<Record<FieldKey, string>> = {};

    for (const field of fieldsForStep(index, reachBy)) {
      const message = fieldError(field.key, values[field.key]);
      if (message) nextErrors[field.key] = message;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  /** Show error once the field has content but fails validation. */
  function syncFieldError(key: FieldKey, value: string) {
    const trimmed = value.trim();
    setErrors((current) => ({
      ...current,
      [key]: trimmed ? fieldError(key, value) : "",
    }));
  }

  function goToStep(index: number) {
    if (lockedFlow || busy || index === stepIndex) return;
    if (index > unlocked) return;
    if (index > stepIndex && !isStepValid(stepIndex, values, reachBy)) return;
    didAdvance.current = true;
    swapPanel(panelRef.current, () => {
      setErrors({});
      setStepIndex(index);
    });
  }

  function selectReach(next: ReachBy) {
    if (lockedFlow || busy || next === reachBy) return;
    didAdvance.current = true;
    swapPanel(fieldSwapRef.current, () => {
      setReachBy(next);
      setErrors({});
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lockedFlow || busy || !validateStep(stepIndex)) return;

    if (stepIndex < steps.length - 1) {
      const next = stepIndex + 1;
      if (next > maxUnlockedStep(values, reachBy)) return;
      didAdvance.current = true;
      swapPanel(panelRef.current, () => {
        setStepIndex(next);
      });
      return;
    }

    for (let i = 0; i < steps.length; i++) {
      if (!isStepValid(i, values, reachBy)) {
        didAdvance.current = true;
        swapPanel(panelRef.current, () => {
          setStepIndex(i);
          validateStep(i);
        });
        return;
      }
    }

    didAdvance.current = false;
    swapPanel(panelRef.current, () => {
      setPhase("sending");
    });
  }

  return (
    <footer
      id="footer"
      className="col-span-12 flex flex-col gap-16 px-section py-section-y md:gap-24 md:p-section lg:gap-32"
    >
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-start">
        <h2
          ref={headingRef}
          className="headline lg:col-span-5 lg:self-start opacity-0"
        >
          Your requirements are unique. Our approach is absolute.
        </h2>
        <form
          noValidate
          onSubmit={onSubmit}
          className="grid grid-cols-6 grid-rows-[auto_auto_auto] items-start gap-x-4 gap-y-8 lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-8"
        >
          {/* Row 1 — stepline sizes the row; fields sit beside it. */}
          <ol
            aria-label="Enquiry steps"
            className="col-span-2 row-start-1 flex h-full flex-col"
          >
            {steps.map((item, index) => {
              const status =
                lockedFlow || index < unlocked
                  ? "complete"
                  : index === stepIndex
                    ? "current"
                    : "upcoming";
              const lineComplete = index < unlocked || lockedFlow;
              const canOpen = phase === "form" && index <= unlocked;
              const locked = phase === "form" && index > unlocked;

              return (
                <li key={item.label} className="flex items-stretch gap-4">
                  <div className="flex w-2.5 flex-col items-center">
                    <span
                      className={`size-2.5 shrink-0 rounded-full border transition-colors duration-500 ${
                        status === "upcoming"
                          ? "border-secondary-white bg-transparent"
                          : "border-primary-white bg-primary-white"
                      }`}
                    />
                    {index < steps.length - 1 ? (
                      <span
                        className={`my-1.5 w-px min-h-12 flex-1 transition-colors duration-500 ${
                          lineComplete
                            ? "bg-primary-white"
                            : "bg-secondary-white/40"
                        }`}
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    disabled={lockedFlow || locked}
                    onClick={() => goToStep(index)}
                    aria-current={
                      phase === "form" && index === stepIndex
                        ? "step"
                        : undefined
                    }
                    className={`small h-fit text-left leading-none transition-colors duration-300 ${
                      lockedFlow
                        ? "text-primary-white"
                        : locked
                          ? "cursor-not-allowed text-secondary-white/50"
                          : canOpen && index === stepIndex
                            ? "text-primary-white"
                            : canOpen
                              ? "text-secondary-white hover:text-primary-white"
                              : "text-secondary-white"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            ref={panelRef}
            className="col-span-3 col-start-3 row-start-1 flex min-w-0 flex-col gap-6 self-start will-change-[opacity]"
            aria-live="polite"
          >
            {sending ? (
              <div
                role="status"
                aria-busy="true"
                className="flex items-center gap-3 pt-1"
              >
                <span
                  aria-hidden
                  className="size-4 shrink-0 animate-spin rounded-full border border-secondary-white/25 border-t-primary-white"
                />
                <span className="small text-secondary-white">Sending</span>
              </div>
            ) : sent ? (
              <div className="flex max-w-xs flex-col gap-2">
                <p className="small text-primary-white">
                  Received. We typically reply within 24 hours.
                </p>
              </div>
            ) : (
              <>
                {step.kind === "reach" ? (
                  <div
                    role="radiogroup"
                    aria-label="How should we reach you"
                    className="flex gap-6"
                  >
                    {(
                      [
                        ["email", "Email"],
                        ["phone", "Phone"],
                      ] as const
                    ).map(([value, label]) => {
                      const active = reachBy === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={busy}
                          onClick={() => selectReach(value)}
                          className={`small transition-colors duration-300 ${
                            active
                              ? "text-primary-white underline decoration-primary-white underline-offset-4"
                              : "text-secondary-white hover:text-primary-white"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                <div
                  ref={fieldSwapRef}
                  className="flex flex-col gap-6 will-change-[opacity]"
                >
                  {activeFields.map((field, fieldIndex) => (
                    <label key={field.key} className="flex flex-col gap-2">
                      <span className="small text-primary-white">
                        {field.label}
                      </span>
                      {field.type === "textarea" ? (
                        <textarea
                          ref={fieldIndex === 0 ? fieldRef : undefined}
                          name={field.key}
                          rows={4}
                          autoComplete={field.autoComplete}
                          value={values[field.key]}
                          aria-invalid={errors[field.key] ? true : undefined}
                          onAnimationStart={onAutofillAnimation}
                          onChange={(event) => {
                            const value = event.target.value;
                            setValues((current) => ({
                              ...current,
                              [field.key]: value,
                            }));
                            syncFieldError(field.key, value);
                          }}
                          className="small w-full resize-none rounded-xl border border-primary-white/50 bg-transparent px-4 py-3 text-primary-white outline-none transition-colors focus:border-primary-white"
                        />
                      ) : (
                        <input
                          ref={fieldIndex === 0 ? fieldRef : undefined}
                          name={field.key}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          value={values[field.key]}
                          aria-invalid={errors[field.key] ? true : undefined}
                          onAnimationStart={onAutofillAnimation}
                          onChange={(event) => {
                            const value = event.target.value;
                            setValues((current) => ({
                              ...current,
                              [field.key]: value,
                            }));
                            syncFieldError(field.key, value);
                          }}
                          className="small w-full max-w-[13.5rem] rounded-xl border border-primary-white/50 bg-transparent px-4 py-3 text-primary-white outline-none transition-colors focus:border-primary-white"
                        />
                      )}
                      {errors[field.key] ? (
                        <span className="xs text-primary-white">
                          {errors[field.key]}
                        </span>
                      ) : null}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Row 2 — keep slot so Direct contact doesn't jump when Send hides. */}
          <div className="col-span-3 col-start-3 row-start-2">
            {phase === "form" ? (
              <button
                type="submit"
                disabled={!canProceed || busy}
                aria-disabled={!canProceed || busy}
                className={`btn btn-outline w-fit px-10 transition-opacity duration-300 ${
                  canProceed && !busy ? "" : "cursor-not-allowed opacity-35"
                }`}
              >
                {stepIndex < steps.length - 1 ? "Next" : "Send"}
              </button>
            ) : (
              <div
                aria-hidden
                className="btn btn-outline invisible w-fit px-10"
              >
                Send
              </div>
            )}
          </div>

          {/* Row 3 — Direct contact always under the button row. */}
          <div className="col-span-3 col-start-3 row-start-3 mt-2 flex flex-col gap-2 md:mt-6">
            <p className="small text-secondary-white">Direct contact</p>
            <p className="small text-secondary-white">
              Adam kowalski
              <span className="mx-2 text-primary-white" aria-hidden>
                *
              </span>
              <a href="tel:+48452423123" className="text-secondary-white">
                +48 452 423 123
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 md:grid-cols-12 md:items-start">
        <Link
          href="/"
          aria-label="Vørte home"
          className="w-fit md:col-span-2"
        >
          <LogoMark />
        </Link>
        <div className="flex flex-col gap-2 md:col-span-2 md:col-start-4">
          <p className="small text-secondary-white">Zurich, Switzerland</p>
          <p className="small text-secondary-white">CHE-123.456.789</p>
        </div>
        <div className="flex flex-col gap-2 text-secondary-white md:col-span-3 md:col-start-7 lg:col-span-2 lg:col-start-8">
          <p className="small">VORTE 2026 © All rights reserved.</p>
          <p className="small">
            Designed by{" "}
            <Link
              href="https://hopcias.pl"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Jakub Hopciaś
            </Link>
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-col items-start gap-4  md:col-span-2 md:col-start-11"
        >
          <Link
            href="#silentium"
            className="small text-primary-white underline decoration-primary-white underline-offset-4"
          >
            Silentium Apartments
          </Link>
          <Link
            href="#silentium"
            className="small text-primary-white underline decoration-primary-white underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
