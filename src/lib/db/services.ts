import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Json, Tables } from "@/lib/supabase/database.types";
import type {
  ContactIntent,
  ContactSubmission,
  CustomFrameBrief,
  NotifySubscription,
  OrderRecord,
  OrderStatus,
  PaymentStatus,
} from "@/lib/db/types";

export type CreateOrderError =
  | "PRODUCT_NOT_FOUND"
  | "ORDER_CREATION_FAILED"
  | "CATEGORY_NOT_ORDERABLE";
export type WebhookError = "ORDER_NOT_FOUND" | "UPDATE_FAILED";
export type ContactError = "CONTACT_SUBMISSION_FAILED";
export type NotifyError = "NOTIFY_SUBSCRIPTION_FAILED";

type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  productSlug: string;
  background: string;
  notes?: string;
};

type WebhookInput = {
  orderId: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
};

type CreateContactInput = {
  name: string;
  email: string;
  message: string;
  intent?: ContactIntent;
  meta?: CustomFrameBrief | null;
};

function parseContactIntent(value: string | null | undefined): ContactIntent {
  if (value === "notify" || value === "custom-frame" || value === "general") return value;
  return "general";
}

function parseCustomFrameBrief(value: Json | null): CustomFrameBrief | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, Json | undefined>;
  const out: CustomFrameBrief = {};
  if (typeof v.team === "string") out.team = v.team;
  if (typeof v.playerName === "string") out.playerName = v.playerName;
  if (typeof v.jerseyNumber === "string") out.jerseyNumber = v.jerseyNumber;
  if (v.frameSize === "small" || v.frameSize === "medium" || v.frameSize === "large") {
    out.frameSize = v.frameSize;
  }
  if (typeof v.referenceUrl === "string") out.referenceUrl = v.referenceUrl;
  return out;
}

type CreateNotifyInput = {
  email: string;
  productSlug: string;
};

type OrderRow = Tables<"orders">;

function makeOrderNumber() {
  return `FC-${Math.floor(Math.random() * 900000 + 100000)}`;
}

function parseCustomization(value: Json | null): OrderRecord["customization"] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const background = value.background;
    const notes = value.notes;
    return {
      background: typeof background === "string" ? background : "",
      notes: typeof notes === "string" ? notes : "",
    };
  }

  return { background: "", notes: "" };
}

export function parsePaymentStatus(value: string | null): PaymentStatus {
  if (value === "paid" || value === "failed" || value === "pending") {
    return value;
  }
  return "pending";
}

export function parseOrderStatus(value: string | null): OrderStatus {
  if (
    value === "pending" ||
    value === "confirmed" ||
    value === "in_production" ||
    value === "shipped" ||
    value === "delivered"
  ) {
    return value;
  }
  return "pending";
}

function toOrderRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    customerCity: row.customer_city,
    productId: row.product_id ?? "",
    productSlug: row.product_slug ?? "",
    price: row.price,
    customization: parseCustomization(row.customization),
    paymentStatus: parsePaymentStatus(row.payment_status),
    orderStatus: parseOrderStatus(row.order_status),
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient();

  // Get product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price, slug, category")
    .eq("slug", input.productSlug)
    .single();

  if (productError || !product) {
    console.error("Product fetch error:", productError);
    return { error: "PRODUCT_NOT_FOUND" as const };
  }

  if (product.category && product.category !== "diecast") {
    return { error: "CATEGORY_NOT_ORDERABLE" as const };
  }

  const maxAttempts = 6;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const orderNumber = makeOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone,
        customer_address: input.customerAddress,
        customer_city: input.customerCity,
        product_id: product.id,
        product_slug: product.slug,
        customization: {
          background: input.background,
          notes: input.notes ?? "",
        },
        price: product.price,
        payment_status: "pending",
        order_status: "pending",
      })
      .select()
      .single();

    if (!orderError && order) {
      return { data: toOrderRecord(order) };
    }

    if (orderError?.code === "23505") {
      continue;
    }

    console.error("Order insertion error:", orderError);
    return { error: "ORDER_CREATION_FAILED" as const };
  }

  return { error: "ORDER_CREATION_FAILED" as const };
}

export async function getOrderById(id: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return toOrderRecord(data);
}

export async function listOrders() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(toOrderRecord);
}

export async function getAdminStats() {
  const supabase = await createServiceClient();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: paidOrders },
    { count: inProduction },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("order_status", "pending"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "paid"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("order_status", "in_production"),
    supabase.from("orders").select("price").eq("payment_status", "paid"),
  ]);

  const revenue = revenueData?.reduce((sum, o) => sum + o.price, 0) ?? 0;

  return {
    totalOrders: totalOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    paidOrders: paidOrders ?? 0,
    inProduction: inProduction ?? 0,
    revenue,
  };
}

export async function applyWebhook(
  input: WebhookInput,
  options?: { supabaseClient?: Awaited<ReturnType<typeof createServiceClient>> }
) {
  const supabase = options?.supabaseClient ?? (await createServiceClient());
  const { data: current, error: fetchError } = await supabase
    .from("orders")
    .select("order_status, payment_status")
    .eq("id", input.orderId)
    .single();

  if (fetchError || !current) {
    return { error: "ORDER_NOT_FOUND" as const };
  }

  const previousPaymentStatus = parsePaymentStatus(current.payment_status);

  const nextOrderStatus: OrderStatus =
    input.paymentStatus === "paid"
      ? current.order_status === "pending"
        ? "confirmed"
        : parseOrderStatus(current.order_status)
      : "pending";

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: input.paymentStatus,
      order_status: nextOrderStatus,
      payfast_payment_id: input.paymentId ?? null,
    })
    .eq("id", input.orderId)
    .select()
    .single();

  if (updateError) {
    return { error: "UPDATE_FAILED" as const };
  }

  return { data: toOrderRecord(updated), previousPaymentStatus };
}

export async function createContactSubmission(input: CreateContactInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .insert({
      name: input.name,
      email: input.email,
      message: input.message,
      intent: input.intent ?? "general",
      meta: (input.meta ?? null) as Json | null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Contact submission error:", error);
    return { error: "CONTACT_SUBMISSION_FAILED" as const };
  }

  const submission: ContactSubmission = {
    id: data.id,
    name: data.name,
    email: data.email,
    message: data.message,
    intent: parseContactIntent(data.intent),
    meta: parseCustomFrameBrief(data.meta),
    createdAt: data.created_at ?? new Date().toISOString(),
  };

  return submission;
}

export async function createNotifySubscription(input: CreateNotifyInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notify_subscriptions")
    .upsert(
      {
        email: input.email,
        product_slug: input.productSlug,
      },
      { onConflict: "email,product_slug" }
    )
    .select("*")
    .single();

  if (error || !data) {
    console.error("Notify subscription error:", error);
    return { error: "NOTIFY_SUBSCRIPTION_FAILED" as const };
  }

  const subscription: NotifySubscription = {
    id: data.id,
    email: data.email,
    productSlug: data.product_slug,
    createdAt: data.created_at ?? new Date().toISOString(),
  };

  return subscription;
}