"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ContactFormProps = {
  intentIsNotify: boolean;
  productSlug?: string;
};

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

const FIELD_WRAP: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "0.5px solid var(--border)",
  color: "var(--text-primary)",
  padding: "14px 0",
  fontSize: 16,
  letterSpacing: "0.02em",
  outline: "none",
  fontFamily: "var(--font-body, Inter, sans-serif)",
};

function createFormSchema(intentIsNotify: boolean) {
  return z
    .object({
      name: z.string().trim(),
      email: z.string().trim().email("Enter a valid email."),
      message: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (!intentIsNotify && values.name.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message: "Full name is required.",
        });
      }
      if (!intentIsNotify && values.message.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["message"],
          message: "Message is required.",
        });
      }
    });
}

export function ContactForm({ intentIsNotify, productSlug }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const schema = useMemo(() => createFormSchema(intentIsNotify), [intentIsNotify]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormState>({
    resolver: zodResolver(schema),
    defaultValues: initialState,
    mode: "onSubmit",
  });

  async function onSubmit(values: FormState) {
    setStatus("loading");
    setMessage("");

    try {
      const endpoint = intentIsNotify ? "/api/notify" : "/api/contact";
      const payload = intentIsNotify
        ? {
            email: values.email,
            productSlug: productSlug ?? "unknown-product",
          }
        : {
            name: values.name,
            email: values.email,
            message: values.message,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as
        | { success: false; error: { message: string } }
        | null;

      if (!response.ok) {
        setStatus("error");
        setMessage(body?.error.message ?? "Request failed. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(
        intentIsNotify
          ? "You will be notified when this model is available."
          : "Message received. The workshop will reply within one working day.",
      );
      reset(initialState);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 36 }}
    >
      {!intentIsNotify ? (
        <div style={FIELD_WRAP}>
          <label
            htmlFor="contact-name"
            className="font-body text-text-muted"
            style={KICKER}
          >
            01 · Full Name
          </label>
          <input
            id="contact-name"
            placeholder="Your name"
            style={INPUT_STYLE}
            {...register("name")}
          />
          {errors.name ? (
            <p className="font-body" style={{ ...KICKER, color: "var(--text-error)" }}>
              {errors.name.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <div style={FIELD_WRAP}>
        <label
          htmlFor="contact-email"
          className="font-body text-text-muted"
          style={KICKER}
        >
          {intentIsNotify ? "01 · Email" : "02 · Email"}
        </label>
        <input
          id="contact-email"
          placeholder="name@email.com"
          type="email"
          style={INPUT_STYLE}
          {...register("email")}
        />
        {errors.email ? (
          <p className="font-body" style={{ ...KICKER, color: "var(--text-error)" }}>
            {errors.email.message}
          </p>
        ) : null}
      </div>

      {!intentIsNotify ? (
        <div style={FIELD_WRAP}>
          <label
            htmlFor="contact-message"
            className="font-body text-text-muted"
            style={KICKER}
          >
            03 · Message
          </label>
          <textarea
            id="contact-message"
            placeholder="What car, what backdrop, what should the plate say?"
            rows={5}
            style={{
              ...INPUT_STYLE,
              padding: "14px 0",
              resize: "vertical",
              minHeight: 140,
              lineHeight: 1.6,
            }}
            {...register("message")}
          />
          {errors.message ? (
            <p className="font-body" style={{ ...KICKER, color: "var(--text-error)" }}>
              {errors.message.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          paddingTop: 24,
          borderTop: "0.5px solid var(--border-subtle)",
          marginTop: 8,
        }}
      >
        <button
          type="submit"
          data-button-motion="true"
          data-button-motion-level="strong"
          disabled={isSubmitting || status === "loading"}
          className="font-display uppercase"
          style={{
            width: "100%",
            padding: "20px 32px",
            background:
              isSubmitting || status === "loading"
                ? "color-mix(in srgb, var(--brand-bright) 50%, transparent)"
                : "var(--brand-bright)",
            color: "var(--text-primary)",
            border: "1px solid var(--brand-bright)",
            fontSize: 16,
            letterSpacing: "0.18em",
            cursor: isSubmitting || status === "loading" ? "wait" : "pointer",
            transition: "background 0.25s ease",
          }}
        >
          {status === "loading"
            ? "SENDING…"
            : intentIsNotify
              ? "NOTIFY ME →"
              : "SEND MESSAGE →"}
        </button>
      </div>

      {status === "success" ? (
        <p
          role="status"
          aria-live="polite"
          className="font-body"
          style={{
            ...KICKER,
            color: "var(--text-success)",
            padding: "16px 0",
            borderTop: "0.5px solid var(--status-success-border)",
          }}
        >
          ✓ {message}
        </p>
      ) : null}
      {status === "error" ? (
        <p
          role="alert"
          className="font-body"
          style={{
            ...KICKER,
            color: "var(--text-error)",
            padding: "16px 0",
            borderTop: "0.5px solid var(--text-error)",
          }}
        >
          ✗ {message}
        </p>
      ) : null}
    </form>
  );
}
