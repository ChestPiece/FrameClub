'use client'

import { useTransition } from 'react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateOrderStatus } from '@/app/admin/actions'
import type { OrderStatus } from '@/lib/db/types'

const orderStatusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "in_production",
  "shipped",
  "delivered"
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  productSlug,
}: {
  orderId: string
  currentStatus: OrderStatus
  productSlug: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-1">
      <Select
        disabled={isPending}
        defaultValue={currentStatus}
        onValueChange={(value) => {
          setError(null)
          startTransition(async () => {
            const result = await updateOrderStatus(
              orderId,
              value as OrderStatus,
              productSlug
            )

            if (!result.success) {
              setError(result.error ?? "Failed to update order status.")
            }
          })
        }}
      >
        <SelectTrigger className="w-full" data-button-motion="true">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {orderStatusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <p className="text-[10px] text-error">{error}</p> : null}
    </div>
  )
}