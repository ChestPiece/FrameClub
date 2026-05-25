import { Input } from "@/components/ui/input";
import { login } from "./actions";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawError = params.error;
  const errorCode = typeof rawError === "string" ? rawError : rawError?.[0];
  const errorMessage =
    errorCode === "forbidden"
      ? "Access denied. Sign in with the configured admin account."
      : errorCode === "admin_not_configured"
        ? "Admin email is not configured. Set ADMIN_EMAIL on the server."
        : errorCode
          ? `Error: ${errorCode}`
          : undefined;

  return (
    <main id="main-content" className="grid min-h-svh bg-bg-base lg:grid-cols-[1.05fr_1fr]">
      <section className="flex items-center border-b border-border bg-bg-deep p-8 lg:border-b-0 lg:border-r lg:p-14">
        <div className="max-w-xl">
          <p className="technical-label text-[10px] text-text-muted">Admin Access</p>
          <h1 className="display-kicker mt-4 text-6xl leading-none md:text-8xl">ADMIN CORE</h1>
          <p className="mt-6 text-sm leading-relaxed text-text-muted">
            Protected operational console for orders, status updates, and inventory control.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-8 lg:p-14">
        <article className="w-full max-w-md border border-border bg-bg-surface p-8 md:p-10">
          <p className="technical-label text-[10px] text-text-muted">Sign In</p>
          <h2 className="display-kicker mt-3 text-5xl leading-none">OPERATOR LOGIN</h2>

          <form action={login} className="mt-7 space-y-4">
            <Input name="email" type="email" placeholder="ADMIN EMAIL" required />
            <Input name="password" type="password" placeholder="PASSWORD" required />

            {errorMessage && (
              <p className="text-xs text-text-error">{errorMessage}</p>
            )}

            <button
              type="submit"
              data-button-motion="true"
              data-button-motion-level="strong"
              className="display-kicker inline-flex w-full items-center justify-center border border-brand bg-brand px-5 py-4 text-sm text-text-primary transition-colors hover:bg-brand-mid"
            >
              ENTER ADMIN
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}