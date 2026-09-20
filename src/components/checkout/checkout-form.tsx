"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/db/types";
import { formatPkr } from "@/lib/utils";
import {
  useStepTransition,
  animate,
  stagger,
  animeReady,
} from "@/lib/animation";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(1, "Full name is required."),
  customerEmail: z.string().trim().email("Enter a valid email."),
  customerPhone: z.string().trim().min(1, "Phone number is required."),
  customerAddress: z.string().trim().min(1, "Delivery address is required."),
  customerCity: z.string().trim().min(1, "City is required."),
  customerProvince: z.string().trim(),
  customerPostal: z.string().trim(),
  orderNote: z.string().trim(),
  paymentMethod: z.enum(["card", "jazz", "easy", "bank"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type CheckoutFormProps = {
  product: Product | undefined;
  slug: string;
  background: string;
  notes: string;
  initialValues?: Partial<CheckoutFormValues>;
};

const defaultState: CheckoutFormValues = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  customerCity: "",
  customerProvince: "",
  customerPostal: "",
  orderNote: "",
  paymentMethod: "card",
};

const PAYMENT_OPTIONS = [
  { value: "card", label: "Card Payment", desc: "Visa / MC via PayFast gateway" },
  { value: "jazz", label: "JazzCash", desc: "Mobile wallet — instant transfer" },
  { value: "easy", label: "Easypaisa", desc: "Mobile wallet — instant transfer" },
  { value: "bank", label: "Bank Transfer", desc: "Direct transfer, 24hr verification" },
] as const;

const STEP_FIELDS: Record<number, (keyof CheckoutFormValues)[]> = {
  1: ["customerName", "customerEmail", "customerPhone"],
  2: ["customerAddress", "customerCity"],
  3: ["paymentMethod"],
};

export function CheckoutForm({ product, slug, background, notes, initialValues }: CheckoutFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [payfastData, setPayfastData] = useState<{ url: string; data: Record<string, string> } | null>(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const formRef = useRef<HTMLFormElement>(null);

  // Step transition: keep all steps mounted, swap via opacity/transform.
  // activeStep is 0-indexed (0=step1, 1=step2, 2=step3).
  const { registerStep } = useStepTransition(step - 1);

  // On mount, hide non-active step containers so all three can be rendered
  // (preserving form input state) without all being visible at once. After
  // this initial setup, `useStepTransition` owns visibility/transform.
  useEffect(() => {
    const containers = document.querySelectorAll<HTMLElement>("[data-anim-step]");
    containers.forEach((el) => {
      const idx = Number(el.dataset.animStep);
      const isActive = idx === step - 1;
      if (!isActive) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
      } else {
        el.style.opacity = "1";
        el.style.visibility = "visible";
        el.style.pointerEvents = "auto";
      }
    });
    // Run once on mount only — step transitions handled by useStepTransition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep pointer-events / aria-hidden in sync per step change. Opacity is
  // owned by GSAP autoAlpha (which also toggles visibility for us).
  useEffect(() => {
    const containers = document.querySelectorAll<HTMLElement>("[data-anim-step]");
    containers.forEach((el) => {
      const idx = Number(el.dataset.animStep);
      el.style.pointerEvents = idx === step - 1 ? "auto" : "none";
    });
  }, [step]);

  // Per-step field reveal: when `step` changes, stagger-animate [data-field]
  // children of the active step container. Gated on reduced motion.
  useEffect(() => {
    if (!animeReady()) return;
    const root = document.querySelector<HTMLElement>(
      `[data-anim-step="${step - 1}"]`,
    );
    if (!root) return;
    const fields = Array.from(
      root.querySelectorAll<HTMLElement>("[data-field]"),
    );
    if (fields.length === 0) return;
    animate(fields, {
      opacity: [0, 1],
      translateY: [6, 0],
      duration: 180,
      delay: stagger(24, { start: 40 }),
      ease: "outCubic",
    });
  }, [step]);

  useEffect(() => {
    if (shouldSubmit && formRef.current) {
      formRef.current.submit();
    }
  }, [shouldSubmit]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { ...defaultState, ...initialValues, orderNote: notes ?? "" },
    mode: "onSubmit",
  });

  const paymentMethod = watch("paymentMethod");

  async function handleNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid && step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3);
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
  }

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitError(null);

    if (!product) {
      setSubmitError("Select a frame from the collection first.");
      return;
    }

    const composedNotes = [
      values.orderNote?.trim(),
      values.customerProvince ? `Province: ${values.customerProvince}` : "",
      values.customerPostal ? `Postal: ${values.customerPostal}` : "",
      values.paymentMethod ? `Preferred Payment: ${values.paymentMethod}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          customerPhone: values.customerPhone,
          customerAddress: values.customerAddress,
          customerCity: values.customerCity,
          productSlug: slug || product.slug,
          background,
          notes: composedNotes || notes,
        }),
      });

      type OrderPayload = {
        success: boolean;
        data?: {
          payfastUrl?: string;
          payfastData?: Record<string, string>;
          order?: { id: string };
          orderAccessToken?: string;
        };
        error?: { message: string };
      };
      const payload = (await response.json().catch(() => null)) as OrderPayload | null;

      if (!response.ok || !payload || !payload.success) {
        const message =
          payload && !payload.success
            ? payload.error?.message
            : "Unable to create order at the moment.";
        setSubmitError(message || "Error processing order.");
        return;
      }

      const orderData = payload.data;
      if (!orderData) {
        setSubmitError("Order data is missing from the server response.");
        return;
      }

      const { payfastUrl, payfastData, order, orderAccessToken } = orderData;

      if (!payfastUrl || !payfastData) {
        if (!order?.id) {
          setSubmitError("Order was created but confirmation details are missing.");
          return;
        }

        const orderUrl = orderAccessToken
          ? `/order/${order.id}?token=${encodeURIComponent(orderAccessToken)}`
          : `/order/${order.id}`;
        router.push(orderUrl);
        return;
      }

      setPayfastData({ url: payfastUrl, data: payfastData });
      setShouldSubmit(true);
    } catch {
      setSubmitError("Network error while creating order.");
    }
  }

  const backgroundLabel =
    product?.backgrounds.find((b) => b.value === background)?.label ?? background;

  const stepIndicator = (
    <div className="flex items-center gap-2">
      {(["01", "02", "03"] as const).map((n, i) => {
        const active = step === (i + 1);
        return (
          <span
            key={n}
            className="font-display"
            style={{
              fontSize: 24,
              letterSpacing: "0.04em",
              color: active ? "var(--brand-bright)" : "var(--text-muted)",
            }}
          >
            {n}
          </span>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Header */}
      <div
        style={{
          margin: "0 auto",
          width: "min(calc(100% - 2rem), 80rem)",
          paddingTop: 24,
          marginBottom: 48,
        }}
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="technical-label text-[10px] text-text-muted" style={{ marginBottom: 8 }}>
              Checkout
            </p>
            <h1
              className="font-display uppercase text-text-primary"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                letterSpacing: "0.04em",
                lineHeight: 1,
                fontWeight: 400,
              }}
            >
              Confirm & pay
            </h1>
          </div>
          {stepIndicator}
        </div>
      </div>

      {/* Layout */}
      <div
        style={{
          margin: "0 auto",
          width: "min(calc(100% - 2rem), 80rem)",
          display: "grid",
          gap: 64,
          alignItems: "start",
          gridTemplateColumns: "1fr",
        }}
        className="lg:grid-cols-[1fr_0.75fr]"
      >
        {/* LEFT: form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-bg-surface"
          style={{ padding: 32, border: "0.5px solid var(--border)" }}
        >
          {submitError ? (
            <p role="alert" className="text-sm text-error" style={{ marginBottom: 16 }}>
              {submitError}
            </p>
          ) : null}

          {/*
            Step containers: ALL steps stay mounted so form input state is
            preserved across step transitions. `useStepTransition` swaps
            visibility/transform via opacity + translateX. The wrapper uses
            CSS grid stacking so inactive steps don't take layout height.
          */}
          <div
            style={{
              display: "grid",
              gridTemplateAreas: '"stack"',
            }}
          >
            {/* STEP 1 */}
            <div
              ref={registerStep(0)}
              data-anim-step="0"
              aria-hidden={step !== 1}
              style={{ gridArea: "stack" }}
            >
              <p className="technical-label text-[10px] text-text-muted" style={{ marginBottom: 24 }}>
                Step 01 · Identity
              </p>
              <div className="flex flex-col" style={{ gap: 20 }}>
                <div data-field>
                  <Field
                    label="Full Name"
                    id="customerName"
                    error={errors.customerName?.message}
                    {...register("customerName")}
                  />
                </div>
                <div data-field>
                  <Field
                    label="Email"
                    id="customerEmail"
                    type="email"
                    autoComplete="email"
                    error={errors.customerEmail?.message}
                    {...register("customerEmail")}
                  />
                </div>
                <div data-field>
                  <Field
                    label="Phone"
                    id="customerPhone"
                    error={errors.customerPhone?.message}
                    {...register("customerPhone")}
                  />
                </div>
                <div data-field>
                  <label htmlFor="orderNote" className="fc-label">
                    Order Note (optional)
                  </label>
                  <textarea
                    id="orderNote"
                    className="fc-input"
                    style={{ height: 80, resize: "vertical" }}
                    {...register("orderNote")}
                  />
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div
              ref={registerStep(1)}
              data-anim-step="1"
              aria-hidden={step !== 2}
              style={{
                gridArea: "stack",
                opacity: step === 2 ? 1 : 0,
                pointerEvents: step === 2 ? "auto" : "none",
                visibility: step === 2 ? "visible" : "hidden",
              }}
            >
              <p className="technical-label text-[10px] text-text-muted" style={{ marginBottom: 24 }}>
                Step 02 · Delivery
              </p>
              <div className="flex flex-col" style={{ gap: 20 }}>
                <div data-field>
                  <Field
                    label="Street Address"
                    id="customerAddress"
                    autoComplete="street-address"
                    error={errors.customerAddress?.message}
                    {...register("customerAddress")}
                  />
                </div>
                <div data-field>
                  <Field
                    label="City"
                    id="customerCity"
                    autoComplete="address-level2"
                    error={errors.customerCity?.message}
                    {...register("customerCity")}
                  />
                </div>
                <div data-field>
                  <Field
                    label="Province"
                    id="customerProvince"
                    autoComplete="address-level1"
                    {...register("customerProvince")}
                  />
                </div>
                <div data-field>
                  <Field
                    label="Postal Code"
                    id="customerPostal"
                    autoComplete="postal-code"
                    {...register("customerPostal")}
                  />
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div
              ref={registerStep(2)}
              data-anim-step="2"
              aria-hidden={step !== 3}
              style={{
                gridArea: "stack",
                opacity: step === 3 ? 1 : 0,
                pointerEvents: step === 3 ? "auto" : "none",
                visibility: step === 3 ? "visible" : "hidden",
              }}
            >
              <p className="technical-label text-[10px] text-text-muted" style={{ marginBottom: 24 }}>
                Step 03 · Payment
              </p>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {PAYMENT_OPTIONS.map((opt) => {
                  const active = paymentMethod === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      data-field
                      data-button-motion="true"
                      data-button-motion-level="subtle"
                      onClick={() => setValue("paymentMethod", opt.value, { shouldValidate: true })}
                      className="text-left"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: 14,
                        alignItems: "center",
                        padding: "14px 16px",
                        border: active
                          ? "1px solid var(--brand-bright)"
                          : "0.5px solid var(--border)",
                        background: active
                          ? "color-mix(in srgb, var(--brand) 12%, transparent)"
                          : "transparent",
                        cursor: "pointer",
                      }}
                      aria-pressed={active}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          border: "1px solid var(--border)",
                          display: "inline-grid",
                          placeItems: "center",
                        }}
                      >
                        {active ? (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              background: "var(--brand-bright)",
                            }}
                          />
                        ) : null}
                      </span>
                      <span className="flex flex-col" style={{ gap: 2 }}>
                        <span
                          className="font-display uppercase text-text-primary"
                          style={{ fontSize: 16, letterSpacing: "0.1em" }}
                        >
                          {opt.label}
                        </span>
                        <span className="font-body text-text-muted" style={{ fontSize: 11 }}>
                          {opt.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div data-field>
                <Button
                  type="submit"
                  disabled={isSubmitting || !!payfastData}
                  variant="brand"
                  size="lg"
                  className="display-kicker w-full cursor-pointer transition-colors duration-200"
                  style={{ marginTop: 24 }}
                  aria-busy={isSubmitting || !!payfastData}
                >
                  {isSubmitting || payfastData
                    ? "Redirecting to PayFast…"
                    : `Place Order · ${product ? formatPkr(product.price) : "Rs. 5,000"}`}
                </Button>
                <p
                  className="font-body text-text-muted"
                  style={{ fontSize: 11, textAlign: "center", marginTop: 12 }}
                >
                  Secured by PayFast · No card details stored
                </p>
              </div>
            </div>
          </div>

          {/* Step navigation */}
          <div
            className="flex items-center justify-between"
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "0.5px solid var(--border-subtle)",
            }}
          >
            {step > 1 ? (
              <Button type="button" variant="ghost" size="default" onClick={handleBack}>
                ← Back
              </Button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <Button type="button" variant="outline" size="default" onClick={handleNext}>
                Next →
              </Button>
            ) : (
              <span />
            )}
          </div>
        </form>

        {/* Hidden PayFast Form */}
        {payfastData && (
          <form ref={formRef} action={payfastData.url} method="POST" className="hidden">
            {Object.entries(payfastData.data).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
          </form>
        )}

        {/* RIGHT: order summary */}
        <aside style={{ position: "sticky", top: 160 }}>
          <div
            className="bg-bg-surface"
            style={{ padding: 24, border: "0.5px solid var(--border)" }}
          >
            <p
              className="technical-label text-[10px] text-text-muted"
              style={{
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: "0.5px solid var(--border-subtle)",
              }}
            >
              Order Summary
            </p>

            <div
              className="flex items-start"
              style={{
                gap: 16,
                paddingBottom: 16,
                borderBottom: "0.5px solid var(--border-subtle)",
              }}
            >
              <div
                className="bg-bg-deep"
                style={{
                  width: 48,
                  height: 48,
                  border: "0.5px solid var(--border)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="font-display text-text-muted"
                  style={{ fontSize: 12, letterSpacing: "0.06em" }}
                >
                  {(product?.name ?? "FC").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col min-w-0" style={{ gap: 4 }}>
                <span
                  className="font-display uppercase text-text-primary"
                  style={{ fontSize: 16, letterSpacing: "0.06em" }}
                >
                  {product?.name ?? "No frame selected"}
                </span>
                <span className="font-body text-text-muted" style={{ fontSize: 10 }}>
                  {backgroundLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: 8, paddingTop: 16 }}>
              <SummaryRow
                label="Frame · 1:64 Scale"
                value={product ? formatPkr(product.price) : "—"}
              />
              <SummaryRow label="Delivery" value="Rs. 0 (Free)" />

              <div
                className="flex items-center justify-between"
                style={{
                  paddingTop: 16,
                  marginTop: 8,
                  borderTop: "0.5px solid var(--border)",
                }}
              >
                <span className="technical-label text-[10px] text-text-muted">Total</span>
                <span
                  className="font-display text-text-primary"
                  style={{ fontSize: 24, letterSpacing: "0.04em" }}
                >
                  {product ? formatPkr(product.price) : "Rs. 5,000"}
                </span>
              </div>
            </div>

            <div
              className="flex flex-col"
              style={{
                gap: 8,
                marginTop: 16,
                paddingTop: 16,
                borderTop: "0.5px solid var(--border-subtle)",
              }}
            >
              {["✓ Nationwide Delivery", "✓ Secure PayFast", "✓ 7 Day Build"].map((t) => (
                <span
                  key={t}
                  className="font-body text-text-muted uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.22em" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, id, ...rest },
  ref,
) {
  return (
    <div>
      <label htmlFor={id} className="fc-label">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className="fc-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-error" style={{ marginTop: 6 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
});

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="font-body text-text-muted uppercase"
        style={{ fontSize: 11, letterSpacing: "0.22em" }}
      >
        {label}
      </span>
      <span
        className="font-display text-text-primary"
        style={{ fontSize: 16, letterSpacing: "0.06em" }}
      >
        {value}
      </span>
    </div>
  );
}
