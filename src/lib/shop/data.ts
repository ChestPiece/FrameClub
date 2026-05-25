import { createPublicClient } from "@/lib/supabase/server";
import { productDiecastImages } from "@/lib/shop/diecast-assets";
import type { Tables } from "@/lib/supabase/database.types";
import type { Product, ProductStatus } from "@/lib/db/types";

type ProductRow = Tables<"products">;
type CustomizationRow = Tables<"customization_options">;

function toProduct(row: ProductRow, backgrounds: CustomizationRow[] = []): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    description: row.description ?? "",
    // Temporary: local diecast shots until per-product media is in Supabase
    images: productDiecastImages(),
    price: row.price,
    status: (row.status as ProductStatus) ?? "available",
    deliveryDays: row.delivery_days ?? 7,
    years: row.years ?? "",
    specs: Array.isArray(row.specs) ? row.specs as Product["specs"] : [],
    backgrounds: backgrounds.map((bg) => ({
      label: bg.label,
      value: bg.value,
      swatch: bg.swatch ?? bg.value,
    })),
  };
}

export async function getProducts(status?: ProductStatus): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  try {
    const { data, error } = await query;
    if (error) {
      console.error(`[getProducts] supabase error: ${error.message}`);
      return [];
    }
    return (data ?? []).map((row) => toProduct(row));
  } catch (err) {
    console.error(`[getProducts] network failure:`, err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createPublicClient();
  try {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();

    if (error) {
      if (error.code === "PGRST116") return undefined;
      console.error(`[getProductBySlug] supabase error: ${error.message}`);
      return undefined;
    }

    const { data: backgrounds, error: backgroundError } = await supabase
      .from("customization_options")
      .select("*")
      .eq("product_id", data.id)
      .eq("type", "background_design");

    if (backgroundError) {
      console.error(`[getProductBySlug] backgrounds error: ${backgroundError.message}`);
      return toProduct(data, []);
    }

    return toProduct(data, backgrounds ?? []);
  } catch (err) {
    console.error(`[getProductBySlug] network failure:`, err);
    return undefined;
  }
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const supabase = createPublicClient();
  try {
    const { data, error } = await supabase.from("products").select("*").neq("slug", slug).limit(3);

    if (error) {
      console.error(`[getRelatedProducts] supabase error: ${error.message}`);
      return [];
    }
    return (data ?? []).map((row) => toProduct(row));
  } catch (err) {
    console.error(`[getRelatedProducts] network failure:`, err);
    return [];
  }
}