import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Percent, DollarSign, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

// @ts-ignore - Temporary ignore until route tree regenerates
export const Route = createFileRoute("/admin/_shell/promotions")({
  component: PromotionsPage,
});

function PromotionsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [tab, setTab] = useState<"coupons" | "promotions">("coupons");

  const { data: coupons, isLoading: couponsLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: tab === "coupons",
  });

  const { data: promotions, isLoading: promotionsLoading } = useQuery({
    queryKey: ["admin-promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: tab === "promotions",
  });

  const createCouponMutation = useMutation({
    mutationFn: async (values: any) => {
      const { data, error } = await supabase
        .from("promotions")
        .insert({
          code: values.code.toUpperCase(),
          description: values.description || null,
          discount_type: values.discount_type,
          discount_value: parseFloat(values.discount_value),
          min_order_total: values.minimum_purchase ? parseFloat(values.minimum_purchase) : null,
          starts_at: values.start_date || null,
          ends_at: values.end_date || null,
          is_active: values.is_active,
        } as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Coupon created successfully");
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: any }) => {
      const { data, error } = await supabase
        .from("promotions")
        .update({
          code: values.code.toUpperCase(),
          description: values.description || null,
          discount_type: values.discount_type,
          discount_value: parseFloat(values.discount_value),
          min_order_total: values.minimum_purchase ? parseFloat(values.minimum_purchase) : null,
          starts_at: values.start_date || null,
          ends_at: values.end_date || null,
          is_active: values.is_active,
        } as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Coupon updated successfully");
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      setOpen(false);
      setEditingPromotion(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Coupon deleted successfully");
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmitCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      discount_type: formData.get("discount_type") as string,
      discount_value: formData.get("discount_value") as string,
      minimum_purchase: formData.get("minimum_purchase") as string,
      maximum_discount: formData.get("maximum_discount") as string,
      usage_limit: formData.get("usage_limit") as string,
      user_usage_limit: formData.get("user_usage_limit") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      is_active: formData.get("is_active") === "on",
    };

    if (editingPromotion) {
      updateCouponMutation.mutate({ id: editingPromotion.id, values });
    } else {
      createCouponMutation.mutate(values);
    }
  };

  const handleEdit = (item: any) => {
    setEditingPromotion(item);
    setOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
      deleteCouponMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            Manage discount codes and promotional campaigns
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="rounded-xl font-bold">
              <Plus size={16} className="mr-2" />
              {tab === "coupons" ? "Add Coupon" : "Add Promotion"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? "Edit Coupon" : "Add New Coupon"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitCoupon} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    defaultValue={editingPromotion?.code || ""}
                    required
                    placeholder="e.g., SUMMER2024"
                    className="uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type *</Label>
                  <Select
                    name="discount_type"
                    defaultValue={editingPromotion?.discount_type || "percentage"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="discount_value">Discount Value *</Label>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    step="0.01"
                    defaultValue={editingPromotion?.discount_value || ""}
                    required
                    placeholder="e.g., 10 or 0.10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_purchase">Minimum Purchase</Label>
                  <Input
                    id="minimum_purchase"
                    name="minimum_purchase"
                    type="number"
                    step="0.01"
                    defaultValue={editingPromotion?.minimum_purchase || ""}
                    placeholder="e.g., 50.00"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    name="usage_limit"
                    type="number"
                    defaultValue={editingPromotion?.usage_limit || ""}
                    placeholder="e.g., 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_usage_limit">Per User Limit</Label>
                  <Input
                    id="user_usage_limit"
                    name="user_usage_limit"
                    type="number"
                    defaultValue={editingPromotion?.user_usage_limit || ""}
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="datetime-local"
                    defaultValue={editingPromotion?.start_date || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="datetime-local"
                    defaultValue={editingPromotion?.end_date || ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingPromotion?.description || ""}
                  placeholder="Coupon description"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={editingPromotion?.is_active ?? true}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
                >
                  {editingPromotion ? "Update Coupon" : "Create Coupon"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button
          variant={tab === "coupons" ? "default" : "outline"}
          onClick={() => setTab("coupons")}
        >
          <TagIcon size={16} className="mr-2" />
          Coupons
        </Button>
        <Button
          variant={tab === "promotions" ? "default" : "outline"}
          onClick={() => setTab("promotions")}
        >
          <Percent size={16} className="mr-2" />
          Promotions
        </Button>
      </div>

      {tab === "coupons" ? (
        couponsLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading coupons...</div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Usage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Valid Until</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coupons?.map((coupon: any) => (
                  <tr key={coupon.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono font-bold">{coupon.code}</td>
                    <td className="px-4 py-3 capitalize">{coupon.discount_type?.replace(/_/g, " ") || "—"}</td>
                    <td className="px-4 py-3">
                      {coupon.discount_type === "percentage" ? (
                        <span>{coupon.discount_value}%</span>
                      ) : coupon.discount_type === "fixed_amount" ? (
                        <span>{formatPrice(coupon.discount_value)}</span>
                      ) : (
                        <span>{formatPrice(coupon.discount_value)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">
                      <Badge variant={coupon.is_active ? "default" : "secondary"}>
                        {coupon.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {coupon.ends_at ? new Date(coupon.ends_at).toLocaleDateString() : "No limit"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(coupon)}>
                          <Edit size={15} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                        >
                          <Trash2 size={15} className="text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {coupons?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No coupons yet. Create your first coupon to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Promotions feature coming soon
        </div>
      )}
    </div>
  );
}
