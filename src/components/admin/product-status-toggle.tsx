'use client'

import { useTransition } from 'react'
import { useState } from 'react'
import { updateProductStatus } from '@/app/admin/actions'
import type { ProductStatus } from '@/lib/db/types'

export function ProductStatusToggle({
  productId,
  status,
}: {
  productId: string
  status: ProductStatus
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isAvailable = status === "available"
  const isPreorder = status === "preorder"
  const label = isAvailable ? "Available" : isPreorder ? "Pre-Order" : "Unavailable"

  const toggleStatus = () => {
    // Cycle: available -> preorder -> unavailable -> available
    const nextStatus: ProductStatus = isAvailable
      ? "preorder"
      : isPreorder
      ? "unavailable"
      : "available"

    setError(null)
    startTransition(async () => {
      const result = await updateProductStatus(productId, nextStatus)
      if (!result.success) {
        setError(result.error ?? "Failed to update product status.")
      }
    })
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={toggleStatus}
        disabled={isPending}
        data-button-motion="true"
        data-button-motion-level="subtle"
        className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] outline-none"
      >
        <span className="relative block h-4 w-8 border border-border bg-bg-deep opacity-80 group-hover:opacity-100">
          <span
            className={`absolute top-0 h-full w-4 transition-all duration-300 ${
              isAvailable
                ? "right-0 bg-text-accent"
                : isPreorder
                ? "left-1/2 -translate-x-1/2 bg-text-accent"
                : "left-0 bg-border"
            }`}
          />
        </span>
        <span className={isAvailable ? "text-text-primary" : "text-text-muted"}>
          {label}
        </span>
      </button>
      {error ? <p className="text-[10px] text-error">{error}</p> : null}
    </div>
  )
}