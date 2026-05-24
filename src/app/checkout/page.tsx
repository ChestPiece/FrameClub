import { SiteFooter } from "@/components/layout/site-footer";
import { getProductBySlug } from "@/lib/shop/data";
import { verifyOrderAccessToken } from "@/lib/payment/order-access-token";
import { getOrderById } from "@/lib/db/services";
import { CheckoutForm } from "@/components/checkout/checkout-form";

type CheckoutPageProps = {
  searchParams: Promise<{
    slug?: string;
    background?: string;
    notes?: string;
    orderId?: string;
    token?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;

  let retryOrder = null;
  if (
    params.orderId &&
    params.token &&
    verifyOrderAccessToken(params.orderId, params.token)
  ) {
    const order = await getOrderById(params.orderId);
    if (order?.paymentStatus === "failed") {
      retryOrder = order;
    }
  }
  const slug = params.slug ?? retryOrder?.productSlug ?? "";
  const background = params.background ?? retryOrder?.customization.background ?? "carbon-grid";
  const notes = params.notes ?? retryOrder?.customization.notes ?? "";
  const product = await getProductBySlug(slug);

  return (
    <>
      <main
        id="main-content"
        style={{ paddingTop: "calc(7.5rem + 60px)", paddingBottom: 80 }}
      >
        <CheckoutForm
          product={product}
          slug={slug}
          background={background}
          notes={notes}
          initialValues={{
            customerName: retryOrder?.customerName,
            customerEmail: retryOrder?.customerEmail,
            customerPhone: retryOrder?.customerPhone,
            customerAddress: retryOrder?.customerAddress,
            customerCity: retryOrder?.customerCity,
          }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
