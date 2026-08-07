import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  listOrders, getOrder, updateOrder, deleteOrder,
  ORDER_STATUSES, PAYMENT_STATUSES, SHIPPING_STATUSES, type Order,
} from "@/lib/admin/orders";
import { PageHeader, StatusPill, EmptyState } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/_shell/orders")({ component: OrdersPage });

function OrdersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filters = useMemo(() => ({ search, status, payment_status: payment }), [search, status, payment]);
  const orders = useQuery({ queryKey: ["admin-orders", filters], queryFn: () => listOrders(filters) });

  const remove = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => { toast.success("Order deleted"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = orders.data ?? [];
  const revenue = rows.filter((o) => o.payment_status === "paid").reduce((n, o) => n + Number(o.total), 0);

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${rows.length} orders · ${formatPrice(revenue)} collected`} />

      <div className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="Search order #, name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 max-w-xs" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={payment} onValueChange={setPayment}>
          <SelectTrigger className="h-10 w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            {PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {orders.isLoading ? (
        <EmptyState label="Loading orders…" />
      ) : rows.length === 0 ? (
        <EmptyState label="No orders match these filters yet." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-bold text-primary">
                    <button onClick={() => setOpenId(o.id)} className="hover:text-accent">{o.order_number}</button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{o.customer_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(Number(o.total))}</td>
                  <td className="px-4 py-3"><StatusPill value={o.status} /></td>
                  <td className="px-4 py-3"><StatusPill value={o.payment_status} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Delete ${o.order_number}?`)) remove.mutate(o.id); }}>
                      <Trash2 size={15} className="text-rose-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OrderDrawer id={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}

function OrderDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const qc = useQueryClient();
  const detail = useQuery({ queryKey: ["admin-order", id], queryFn: () => getOrder(id!), enabled: !!id });
  const [note, setNote] = useState("");

  const save = useMutation({
    mutationFn: (patch: Partial<Order>) =>
      updateOrder(id!, patch, detail.data?.order?.status ?? undefined),
    onSuccess: () => {
      toast.success("Order updated");
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const order = detail.data?.order;

  return (
    <Dialog open={!!id} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle>{order ? `Order ${order.order_number}` : "Order"}</DialogTitle></DialogHeader>
        {!order ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Order status">
                <Select value={order.status} onValueChange={(v) => save.mutate({ status: v })}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>{ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Payment">
                <Select value={order.payment_status} onValueChange={(v) => save.mutate({ payment_status: v })}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>{PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Fulfilment">
                <Select value={order.shipping_status} onValueChange={(v) => save.mutate({ shipping_status: v })}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>{SHIPPING_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tracking number">
                <Input
                  defaultValue={order.tracking_number ?? ""}
                  onBlur={(e) => e.target.value !== (order.tracking_number ?? "") && save.mutate({ tracking_number: e.target.value })}
                  className="h-10"
                />
              </Field>
              <Field label="Transaction reference">
                <Input
                  defaultValue={order.transaction_reference ?? ""}
                  onBlur={(e) => e.target.value !== (order.transaction_reference ?? "") && save.mutate({ transaction_reference: e.target.value })}
                  className="h-10"
                />
              </Field>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-primary">Items</h3>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {detail.data?.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-3 text-sm">
                    {it.image_url && <img src={it.image_url} alt="" className="h-10 w-10 rounded-lg object-contain" />}
                    <span className="min-w-0 flex-1 truncate">{it.title}</span>
                    <span className="text-muted-foreground">×{it.quantity}</span>
                    <span className="font-semibold">{formatPrice(Number(it.line_total))}</span>
                  </li>
                ))}
                {!detail.data?.items.length && <li className="p-3 text-sm text-muted-foreground">No line items recorded.</li>}
              </ul>
              <div className="mt-2 flex justify-end gap-6 text-sm">
                <span className="text-muted-foreground">Shipping {formatPrice(Number(order.shipping_total))}</span>
                <span className="font-bold text-primary">Total {formatPrice(Number(order.total))}</span>
              </div>
            </div>

            <Field label="Internal notes">
              <Textarea
                defaultValue={order.internal_notes ?? ""}
                onBlur={(e) => e.target.value !== (order.internal_notes ?? "") && save.mutate({ internal_notes: e.target.value })}
                rows={3}
              />
            </Field>

            <div>
              <h3 className="mb-2 text-sm font-bold text-primary">Status history</h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {detail.data?.history.map((h) => (
                  <li key={h.id}>
                    {new Date(h.created_at).toLocaleString()} — {h.previous_status ?? "new"} → <strong>{h.new_status}</strong>
                    {h.changed_by_email ? ` by ${h.changed_by_email}` : ""}
                  </li>
                ))}
                {!detail.data?.history.length && <li>No changes logged yet.</li>}
              </ul>
              <div className="mt-2 flex gap-2">
                <Input placeholder="Add a timeline note" value={note} onChange={(e) => setNote(e.target.value)} className="h-9" />
                <Button
                  size="sm"
                  disabled={!note.trim()}
                  onClick={() => { save.mutate({ internal_notes: `${order.internal_notes ?? ""}\n${note}`.trim() }); setNote(""); }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
