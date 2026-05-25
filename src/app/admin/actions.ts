'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OrderStatus, ProductStatus } from '@/lib/db/types'
import { sendStatusUpdate } from '@/lib/emails/send'
import { getOrderById } from '@/lib/db/services'
import { assertAdminSession } from '@/lib/auth/assert-admin-session'
import { getProductBySlug } from '@/lib/shop/data'

export async function updateOrderStatus(orderId: string, status: OrderStatus, productSlug: string) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return { success: false, error: auth.error }
  }

  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update order status:', error)
    return { success: false, error: error.message }
  }

  const product = await getProductBySlug(productSlug)
  const productName = product?.name || productSlug

  const orderRecord = await getOrderById(orderId)
  if (orderRecord) {
    try {
      await sendStatusUpdate(orderRecord, productName)
    } catch (emailErr) {
      console.error("Failed to send status update email:", emailErr)
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/orders')
  return { success: true }
}

export async function updateProductStatus(productId: string, status: ProductStatus) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return { success: false, error: auth.error }
  }

  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', productId)

  if (error) {
    console.error('Failed to update product status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true }
}

const MAX_PRODUCT_PRICE_PKR = 10_000_000

export async function updateProductPrice(productId: string, productSlug: string, price: number) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return { success: false as const, error: auth.error }
  }

  if (!Number.isFinite(price) || !Number.isInteger(price) || price <= 0 || price > MAX_PRODUCT_PRICE_PKR) {
    return { success: false as const, error: 'INVALID_PRICE' }
  }

  const supabase = await createServiceClient()

  const { error } = await supabase.from('products').update({ price }).eq('id', productId)

  if (error) {
    console.error('Failed to update product price:', error)
    return { success: false as const, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath(`/shop/${productSlug}`)
  revalidatePath('/')
  return { success: true as const }
}