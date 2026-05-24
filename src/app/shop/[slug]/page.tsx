import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductDetailForm } from "@/components/shop/product-detail-form";
import { RelatedProductsSection } from "@/components/shop/related-products-section";
import { getProductBySlug, getRelatedProducts } from "@/lib/shop/data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.slug);

  return (
    <>
      <main
        id="main-content"
        style={{ paddingTop: "calc(7.5rem + 60px)" }}
        className="pb-24"
      >
        <ProductDetailForm product={product} />
        <RelatedProductsSection related={related} />
      </main>
      <SiteFooter />
    </>
  );
}
