"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type FieldKey = "fullName" | "email" | "phone" | "enquiry";

type Field = {
  key: FieldKey;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  autoComplete: string;
};

type Step = {
  label: string;
  fields: Field[];
};

const steps: Step[] = [
  {
    label: "You",
    fields: [
      {
        key: "fullName",
        label: "Full name",
        type: "text",
        autoComplete: "name",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        autoComplete: "email",
      },
    ],
  },
  {
    label: "Reach you",
    fields: [
      {
        key: "phone",
        label: "Phone",
        type: "tel",
        autoComplete: "tel",
      },
    ],
  },
  {
    label: "enquiry",
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

export default function Footer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [sent, setSent] = useState(false);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const didAdvance = useRef(false);
  const step = steps[stepIndex];
  const reached = sent ? steps.length : stepIndex;

  useEffect(() => {
    if (!didAdvance.current || sent) return;
    fieldRef.current?.focus();
  }, [stepIndex, sent]);

  function validateStep(index: number) {
    const nextErrors: Partial<Record<FieldKey, string>> = {};

    for (const field of steps[index].fields) {
      const message = fieldError(field.key, values[field.key]);
      if (message) nextErrors[field.key] = message;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sent || !validateStep(stepIndex)) return;

    if (stepIndex < steps.length - 1) {
      didAdvance.current = true;
      setStepIndex(stepIndex + 1);
      return;
    }

    setSent(true);
  }

  return (
    <footer className="m-12 flex flex-col gap-24">
      <div className="grid grid-cols-12 items-center">
        <form
          noValidate
          onSubmit={onSubmit}
          className="col-span-5 flex items-start gap-10"
        >
          <ol aria-label="Enquiry steps" className="flex shrink-0 flex-col">
            {steps.map((item, index) => {
              const status =
                index < reached ? "complete" : index === reached ? "current" : "upcoming";
              const lineComplete = index < reached;

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
                  {index < stepIndex && !sent ? (
                    <button
                      type="button"
                      onClick={() => {
                        setErrors({});
                        setStepIndex(index);
                      }}
                      className="small h-fit text-left leading-none text-secondary-white"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span
                      className={`small h-fit leading-none ${
                        status === "current"
                          ? "text-primary-white"
                          : "text-secondary-white"
                      }`}
                      aria-current={status === "current" ? "step" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="flex min-w-0 flex-1 flex-col">
            {sent ? (
              <p className="small max-w-xs text-primary-white">
                Received. The correspondence stays between us.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {step.fields.map((field, index) => (
                  <label key={field.key} className="flex flex-col gap-2">
                    <span className="small text-primary-white">{field.label}</span>
                    {field.type === "textarea" ? (
                      <textarea
                        ref={index === 0 ? fieldRef : undefined}
                        name={field.key}
                        rows={5}
                        autoComplete={field.autoComplete}
                        value={values[field.key]}
                        aria-invalid={errors[field.key] ? true : undefined}
                        onChange={(event) => {
                          setValues((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }));
                          setErrors((current) => ({ ...current, [field.key]: "" }));
                        }}
                        className="small resize-none rounded-xl border border-primary-white/50 bg-transparent px-4 py-3 text-primary-white outline-none transition-colors focus:border-primary-white"
                      />
                    ) : (
                      <input
                        ref={index === 0 ? fieldRef : undefined}
                        name={field.key}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        value={values[field.key]}
                        aria-invalid={errors[field.key] ? true : undefined}
                        onChange={(event) => {
                          setValues((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }));
                          setErrors((current) => ({ ...current, [field.key]: "" }));
                        }}
                        className="small rounded-xl border border-primary-white/50 bg-transparent px-4 py-3 text-primary-white outline-none transition-colors focus:border-primary-white"
                      />
                    )}
                    {errors[field.key] ? (
                      <span className="xs text-primary-white">{errors[field.key]}</span>
                    ) : null}
                  </label>
                ))}
                <button
                  type="submit"
                  className="small mt-2 self-center rounded-xl border border-primary-white/70 px-10 py-3 text-primary-white transition-colors hover:border-primary-white"
                >
                  {stepIndex < steps.length - 1 ? "Next" : "Send"}
                </button>
              </div>
            )}
            <div className="mt-14 flex flex-col items-center gap-2 text-center">
              <p className="xs text-secondary-white">Direct contact</p>
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
          </div>
        </form>

        <h2 className="headline col-span-5 col-start-7">
          <span className="block text-secondary-white">Correspondence</span>
          <span className="block text-primary-white">for the few.</span>
        </h2>
      </div>

      <div className="grid grid-cols-12 items-center">
        <Image
          src="/logo.svg"
          alt="VORTE"
          width={62}
          height={13}
          unoptimized
          className="col-span-2 h-6 w-auto"
        />
        <div className="col-span-2 col-start-4 flex min-w-0 flex-wrap items-baseline gap-x-3">
          <p className="small whitespace-nowrap text-secondary-white">Warsaw, Poland</p>
          <p className="small whitespace-nowrap text-secondary-white">
            NIP: 000 00 00 000
          </p>
        </div>
        <div className="col-span-2 col-start-8 flex min-w-0 flex-wrap items-baseline justify-end gap-x-6 text-right min-[1320px]:w-max min-[1320px]:flex-nowrap min-[1320px]:justify-self-end">
          <p className="small whitespace-nowrap text-secondary-white">
            VORTE 2026 © All rights reserved.
          </p>
          <p className="small whitespace-nowrap text-secondary-white">
            Designed by Jakub Hopciaś
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="col-span-2 col-start-11 flex justify-end"
        >
          <a
            href="#silentium"
            className="small text-primary-white underline decoration-primary-white underline-offset-4"
          >
            Silentium Apartments
          </a>
        </nav>
      </div>
    </footer>
  );
}
