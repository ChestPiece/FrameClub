export type ProductStatus = "available" | "preorder" | "unavailable";
export type ProductCategory = "diecast" | "football";
export type ContactIntent = "general" | "notify" | "custom-frame";

export type CustomFrameBrief = {
  team?: string;
  playerName?: string;
  jerseyNumber?: string;
  frameSize?: "small" | "medium" | "large";
  referenceUrl?: string;
};
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_production"
  | "shipped"
  | "delivered";

export type ProductSpec = {
  label: string;
  value: string;
};

export type BackgroundOption = {
  label: string;
  value: string;
  swatch: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  images: string[];
  price: number;
  status: ProductStatus;
  deliveryDays: number;
  years: string;
  specs: ProductSpec[];
  backgrounds: BackgroundOption[];
  category: ProductCategory;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  productId: string;
  productSlug: string;
  price: number;
  customization: {
    background: string;
    notes: string;
  };
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  intent: ContactIntent;
  meta: CustomFrameBrief | null;
  createdAt: string;
};

export type NotifySubscription = {
  id: string;
  email: string;
  productSlug: string;
  createdAt: string;
};
