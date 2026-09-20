"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactIntentMode = "general" | "notify" | "custom-frame";

type ContactFormProps = {
  intentIsNotify?: boolean;
  intentIsCustomFrame?: boolean;
  productSlug?: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  team: string;
  playerName: string;
  jerseyNumber: string;
  frameSize: "small" | "medium" | "large";
  referenceUrl: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  team: "",
  playerName: "",
  jerseyNumber: "",
  frameSize: "medium",
  referenceUrl: "",
  message: "",
};

function createFormSchema(mode: ContactIntentMode) {
  return z
    .object({
      name: z.string().trim(),
      email: z.string().trim().email("Enter a valid email."),
      phone: z.string().trim(),
      team: z.string().trim(),
      playerName: z.string().trim(),
      jerseyNumber: z.string().trim(),
      frameSize: z.enum(["small", "medium", "large"]),
      referenceUrl: z.string().trim(),
      message: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (mode === "general") {
        if (values.name.length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["name"], message: "Full name is required." });
        }
        if (values.message.length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["message"], message: "Message is required." });
        }
      }
      if (mode === "custom-frame") {
        if (values.name.length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["name"], message: "Full name is required." });
        }
        if (values.phone.length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["phone"], message: "Phone is required." });
        }
        if (values.team.length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["team"], message: "Team / club is required." });
        }
      }
    });
}

export function ContactForm({ intentIsNotify = false, intentIsCustomFrame = false, productSlug }: ContactFormProps) {
  const mode: ContactIntentMode = intentIsNotify
    ? "notify"
    : intentIsCustomFrame
      ? "custom-frame"
      : "general";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const schema = useMemo(() => createFormSchema(mode), [mode]);

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
      const endpoint = mode === "notify" ? "/api/notify" : "/api/contact";
      let payload: Record<string, unknown>;

      if (mode === "notify") {
        payload = {
          email: values.email,
          productSlug: productSlug ?? "unknown-product",
        };
      } else if (mode === "custom-frame") {
        const briefSummary = [
          values.team && `Team: ${values.team}`,
          values.playerName && `Player: ${values.playerName}`,
          values.jerseyNumber && `Jersey #: ${values.jerseyNumber}`,
          `Frame size: ${values.frameSize}`,
          values.referenceUrl && `Reference: ${values.referenceUrl}`,
          values.message && `Notes: ${values.message}`,
        ]
          .filter(Boolean)
          .join("\n");

        payload = {
          name: values.name,
          email: values.email,
          message: briefSummary || `Custom football frame inquiry for ${productSlug ?? "n/a"}`,
          intent: "custom-frame",
          meta: {
            phone: values.phone,
            productSlug: productSlug ?? null,
            team: values.team,
            playerName: values.playerName || null,
            jerseyNumber: values.jerseyNumber || null,
            frameSize: values.frameSize,
            referenceUrl: values.referenceUrl || null,
          },
        };
      } else {
        payload = {
          name: values.name,
          email: values.email,
          message: values.message,
        };
      }

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
        mode === "notify"
          ? "You will be notified when this model is available."
          : mode === "custom-frame"
            ? "Brief received. The workshop will reply with a quote within one working day."
            : "Message received. We will contact you soon.",
      );
      reset(initialState);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const inputClass =
    "min-touch-target w-full border-border/70 bg-bg-surface text-text-primary placeholder:text-text-muted/75 tracking-[0.04em] transition-colors duration-200 focus-visible:border-brand/80 focus-visible:ring-2 focus-visible:ring-brand/30";
  const labelClass = "technical-label block text-[10px] text-text-muted";

  return (
    <form className="space-y-6 sm:space-y-7" onSubmit={handleSubmit(onSubmit)}>
      {mode !== "notify" ? (
        <div className="space-y-2">
          <Label htmlFor="contact-name" className={labelClass}>
            Full Name
          </Label>
          <Input
            id="contact-name"
            placeholder="Enter your full name"
            className={inputClass}
            {...register("name")}
          />
          {errors.name ? <p className="mt-2 text-xs text-error">{errors.name.message}</p> : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="contact-email" className={labelClass}>
          Email
        </Label>
        <Input
          id="contact-email"
          placeholder="name@email.com"
          type="email"
          className={inputClass}
          {...register("email")}
        />
        {errors.email ? <p className="mt-2 text-xs text-error">{errors.email.message}</p> : null}
      </div>

      {mode === "custom-frame" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="contact-phone" className={labelClass}>
              Phone (WhatsApp preferred)
            </Label>
            <Input
              id="contact-phone"
              placeholder="03XX XXXXXXX"
              className={inputClass}
              {...register("phone")}
            />
            {errors.phone ? <p className="mt-2 text-xs text-error">{errors.phone.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-team" className={labelClass}>
              Team / Club
            </Label>
            <Input
              id="contact-team"
              placeholder="e.g. Real Madrid, Multan FC"
              className={inputClass}
              {...register("team")}
            />
            {errors.team ? <p className="mt-2 text-xs text-error">{errors.team.message}</p> : null}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-player" className={labelClass}>
                Player name (optional)
              </Label>
              <Input id="contact-player" placeholder="e.g. Vinicius Jr." className={inputClass} {...register("playerName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-jersey" className={labelClass}>
                Jersey # (optional)
              </Label>
              <Input id="contact-jersey" placeholder="07" className={inputClass} {...register("jerseyNumber")} />
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className={labelClass}>Frame size</legend>
            <div className="grid grid-cols-3 gap-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <label
                  key={size}
                  className="flex cursor-pointer items-center justify-center border border-border/70 bg-bg-surface px-3 py-3 text-[11px] uppercase tracking-[0.18em] text-text-muted has-[:checked]:border-brand-bright has-[:checked]:bg-bg-deep has-[:checked]:text-text-primary"
                >
                  <input type="radio" value={size} className="sr-only" {...register("frameSize")} />
                  {size}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="contact-reference" className={labelClass}>
              Reference image URL (optional)
            </Label>
            <Input
              id="contact-reference"
              placeholder="https://..."
              className={inputClass}
              {...register("referenceUrl")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message" className={labelClass}>
              Anything else?
            </Label>
            <Textarea
              id="contact-message"
              placeholder="Special requests, deadline, gifting notes..."
              rows={4}
              className="w-full border-border/70 bg-bg-surface text-text-primary placeholder:text-text-muted/75 tracking-[0.04em] transition-colors duration-200 focus-visible:border-brand/80 focus-visible:ring-2 focus-visible:ring-brand/30"
              {...register("message")}
            />
          </div>
        </>
      ) : null}

      {mode === "general" ? (
        <div className="space-y-2">
          <Label htmlFor="contact-message" className={labelClass}>
            Message
          </Label>
          <Textarea
            id="contact-message"
            placeholder="Tell us what you need"
            rows={5}
            className="w-full border-border/70 bg-bg-surface text-text-primary placeholder:text-text-muted/75 tracking-[0.04em] transition-colors duration-200 focus-visible:border-brand/80 focus-visible:ring-2 focus-visible:ring-brand/30"
            {...register("message")}
          />
          {errors.message ? <p className="mt-2 text-xs text-error">{errors.message.message}</p> : null}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || status === "loading"}
        variant="brand"
        className="display-kicker min-touch-target w-full py-4 text-sm sm:text-base"
      >
        {status === "loading"
          ? "Submitting"
          : mode === "notify"
            ? "Notify Me"
            : mode === "custom-frame"
              ? "Request Quote"
              : "Send Message"}
      </Button>

      {status === "success" ? (
        <p role="status" aria-live="polite" className="text-sm text-success">
          {message}
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm text-error">
          {message}
        </p>
      ) : null}
    </form>
  );
}
