import { TransitionLink } from "@/components/layout/page-transition";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <>
      <main id="main-content" className="pb-24 pt-30">
        <section className="frame-container flex min-h-[60vh] items-center justify-center py-12">
          <article className="w-full max-w-md border border-border bg-bg-surface p-8 md:p-10">
            <p className="technical-label text-[10px] text-text-muted">ERROR CODE: 404</p>
            <h1 className="display-kicker mt-4 text-4xl leading-none">PAGE NOT FOUND</h1>
            <p className="mt-5 text-sm text-text-muted">
              The frame you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <div className="mt-8 space-y-4">
              <Button render={<TransitionLink href="/shop" />} variant="brand" className="display-kicker w-full">
                BACK TO COLLECTION
              </Button>
              <TransitionLink
                href="/contact"
                className="text-xs uppercase tracking-[0.16em] text-text-muted hover:text-text-primary"
              >
                Or contact the workshop
              </TransitionLink>
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
