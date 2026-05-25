import { Eye } from "lucide-react";
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
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import type { OrderRecord } from "@/lib/db/types";

type LiveOrderPipelineProps = {
  orders: OrderRecord[];
};

export function LiveOrderPipeline({ orders }: LiveOrderPipelineProps) {
  return (
    <section className="border border-border bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-bg-deep px-6 py-4">
        <h2 className="technical-label text-xs text-text-primary">Live Order Pipeline</h2>
        <ExportCsvButton orders={orders} />
      </div>

      <Table className="min-w-245">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Car Model</TableHead>
            <TableHead>Customization</TableHead>
            <TableHead className="text-center">Payment</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id} className={`text-[11px] ${index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}`}>
              <TableCell className="font-semibold text-text-primary">{order.orderNumber}</TableCell>
              <TableCell className="text-text-muted">{order.customerName}</TableCell>
              <TableCell className="text-text-muted">{order.productSlug}</TableCell>
              <TableCell className="text-text-muted">{order.customization.background}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={order.paymentStatus === "paid" ? "paid" : "pending"}
                  className="px-2 py-1 text-[9px] tracking-widest"
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-text-muted">
                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.orderStatus}
                  productSlug={order.productSlug}
                />
              </TableCell>
              <TableCell className="text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
