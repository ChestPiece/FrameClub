import { SiteFooter } from "@/components/layout/site-footer";
import { ShopAnimations } from "@/components/shop/shop-animations";
import { ShopClientView } from "@/components/shop/shop-client-view";
import { getProducts } from "@/lib/shop/data";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <main id="main-content">
        <ShopAnimations />
        <ShopClientView products={products} />
      </main>
      <SiteFooter />
    </>
  );
}
