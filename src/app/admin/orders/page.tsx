import { Eye } from "lucide-react";

export const dynamic = "force-dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listOrders } from "@/lib/db/services";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { AdminErrorFallback } from "@/components/admin/admin-error-fallback";

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof listOrders>>;

  try {
    orders = await listOrders();
  } catch {
    return <AdminErrorFallback message="Failed to load orders." />;
  }

  return (
    <section className="border border-border bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-bg-deep px-6 py-4">
        <h1 className="display-kicker text-5xl leading-none">ORDERS</h1>
        <div className="flex items-center gap-4">
          <p className="technical-label text-[10px] text-text-muted">Newest First</p>
          <ExportCsvButton orders={orders} />
        </div>
      </div>

      <Table className="min-w-270">
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Customization</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id} className={index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}>
              <TableCell className="text-xs font-semibold text-text-primary">{order.orderNumber}</TableCell>
              <TableCell className="text-xs text-text-muted">
                <p>{order.customerName}</p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
              </TableCell>
              <TableCell className="text-xs text-text-muted">{order.customerCity}</TableCell>
              <TableCell className="text-xs text-text-muted">{order.productSlug}</TableCell>
              <TableCell className="text-xs text-text-muted">
                <p>Background: {order.customization.background}</p>
                <p>Notes: {order.customization.notes || "None"}</p>
              </TableCell>
              <TableCell className="text-xs text-text-muted">
                <Badge
                  variant={order.paymentStatus === "paid" ? "paid" : "pending"}
                  className="px-2 py-1 text-[9px] tracking-widest"
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-text-muted">
                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.orderStatus}
                  productSlug={order.productSlug}
                />
              </TableCell>
              <TableCell className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-text-muted hover:text-text-primary"
                  aria-label="View order"
                >
                  <Eye className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
