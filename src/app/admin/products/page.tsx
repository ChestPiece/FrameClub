export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProducts as listProductsForAdmin } from "@/lib/shop/data";
import { ProductStatusToggle } from "@/components/admin/product-status-toggle";
import { ProductPriceField } from "@/components/admin/product-price-field";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/db/labels";

export default async function AdminProductsPage() {
  const products = await listProductsForAdmin();

  return (
    <section className="border border-border bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-bg-deep px-6 py-4">
        <h1 className="display-kicker text-5xl leading-none">PRODUCTS</h1>
        <Button
          type="button"
          disabled
          variant="outline"
          size="sm"
          className="display-kicker text-[10px] text-text-muted"
        >
          Add Product
        </Button>
      </div>

      <Table className="min-w-215">
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id} className={index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}>
              <TableCell className="text-xs font-semibold text-text-primary">{product.name}</TableCell>
              <TableCell className="text-xs text-text-muted">{product.brand}</TableCell>
              <TableCell className="text-xs uppercase tracking-[0.2em] text-text-muted">
                <span
                  className={
                    product.category === "football"
                      ? "inline-block border border-brand-bright/60 px-2 py-1 text-text-primary"
                      : "inline-block border border-border px-2 py-1"
                  }
                >
                  {PRODUCT_CATEGORY_LABELS[product.category] ?? product.category}
                </span>
              </TableCell>
              <TableCell className="text-xs text-text-muted align-top py-4">
                {product.category === "football" ? (
                  <span className="font-display uppercase tracking-[0.18em] text-text-muted">Quote</span>
                ) : (
                  <ProductPriceField
                    productId={product.id}
                    productSlug={product.slug}
                    initialPrice={product.price}
                  />
                )}
              </TableCell>
              <TableCell className="text-xs text-text-muted">{product.deliveryDays} days</TableCell>
              <TableCell className="text-xs uppercase tracking-[0.2em] text-text-muted">
                <ProductStatusToggle productId={product.id} status={product.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
