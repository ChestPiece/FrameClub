import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-md border transition-colors outline-none select-none focus-visible:border-brand-bright disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        brand: "border-brand bg-brand text-text-primary hover:bg-brand-mid",
        outline: "border-border bg-transparent text-text-primary hover:bg-bg-elevated",
        muted: "border-border bg-bg-deep text-text-muted hover:text-text-primary",
        ghost: "border-transparent bg-transparent text-text-muted hover:text-text-primary",
      },
      size: {
        sm: "px-3 py-2 text-[10px]",
        default: "px-4 py-3 text-xs",
        lg: "px-5 py-4 text-sm",
        xl: "px-6 py-4 text-xl",
        "icon-sm": "size-7 border-transparent p-0",
        icon: "size-8 border-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "default",
    },
  }
)

type ButtonOwnProps = {
  /**
   * Opt-in split-flip label (primary slides up, ghost slides in).
   * Only honored when children is a plain string. Off by default.
   */
  splitLabel?: boolean
}

function isIconSize(size: string | null | undefined) {
  return size === "icon" || size === "icon-sm"
}

function Button({
  className,
  variant = "brand",
  size = "default",
  render,
  nativeButton,
  children,
  splitLabel = false,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> &
  ButtonOwnProps) {
  const iconOnly = isIconSize(size)

  const motionLevel = iconOnly
    ? "minimal"
    : variant === "brand" && (size === "lg" || size === "xl")
      ? "strong"
      : variant === "ghost" || variant === "muted"
        ? "subtle"
        : "default"

  const showSheen = !iconOnly && (variant === "brand" || variant === "outline")
  const useSplit = splitLabel && !iconOnly && typeof children === "string"

  const labelContent = useSplit ? (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden"
      style={{ lineHeight: 1.2 }}
    >
      <span
        data-button-label="true"
        className="inline-block"
        style={{ willChange: "transform" }}
      >
        {children}
      </span>
      <span
        data-button-label-ghost="true"
        aria-hidden="true"
        className="absolute inset-0 inline-flex items-center justify-center"
        style={{ transform: "translateY(110%)", willChange: "transform" }}
      >
        {children}
      </span>
    </span>
  ) : (
    children
  )

  return (
    <ButtonPrimitive
      data-slot="button"
      data-button-motion="true"
      data-button-motion-level={motionLevel}
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      nativeButton={render ? false : nativeButton}
      {...props}
    >
      {showSheen ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ transform: "skewX(-18deg)" }}
        >
          <span
            data-button-sheen="true"
            className="absolute inset-y-0"
            style={{
              left: 0,
              width: "40%",
              transform: "translateX(-120%)",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
              opacity: 0,
              mixBlendMode: "screen",
              willChange: "transform, opacity",
            }}
          />
        </span>
      ) : null}
      {labelContent}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
