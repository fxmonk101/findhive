import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

// @ts-ignore - Temporary ignore until route tree regenerates
export const Route = createFileRoute("/admin/_shell/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-inventory", search, filter],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("id, title, sku, category, subcategory, stock_count, low_stock_threshold, price, image_url")
        .order("stock_count", { ascending: true });
      
      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`);
      }
      
      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data;
    },
  });

  const adjustMutation = useMutation({
    mutationFn: async ({ productId, amount, reason }: { productId: string; amount: number; reason: string }) => {
      const { data: current } = await supabase
        .from("products")
        .select("stock_count")
        .eq("id", productId)
        .single();
      
      const newStock = (current?.stock_count || 0) + amount;
      
      const { data, error } = await supabase
        .from("products")
        .update({ stock_count: newStock })
        .eq("id", productId)
        .select()
        .single();
      
      if (error) throw error;

      // Log the inventory change
      await supabase.from("inventory_logs").insert({
        product_id: productId,
        previous_stock: current?.stock_count || 0,
        new_stock: newStock,
        change: amount,
        reason: reason || "Manual adjustment",
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Inventory adjusted successfully");
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
      setSelectedProduct(null);
      setAdjustmentAmount("");
      setAdjustmentReason("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const filteredProducts = products?.filter((p) => {
    if (filter === "low") return p.stock_count > 0 && p.stock_count <= p.low_stock_threshold;
    if (filter === "out") return p.stock_count === 0;
    return true;
  });

  const lowStockCount = products?.filter((p) => p.stock_count > 0 && p.stock_count <= p.low_stock_threshold).length || 0;
  const outOfStockCount = products?.filter((p) => p.stock_count === 0).length || 0;
  const totalStock = products?.reduce((sum, p) => sum + p.stock_count, 0) || 0;

  const handleAdjustStock = () => {
    if (selectedProduct && adjustmentAmount) {
      adjustMutation.mutate({
        productId: selectedProduct.id,
        amount: parseInt(adjustmentAmount),
        reason: adjustmentReason,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Inventory Management</h1>
        <p className="text-sm text-muted-foreground">
          Monitor and adjust product stock levels
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{products?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalStock.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-500" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-yellow-600">{lowStockCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package size={16} className="text-red-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-600">{outOfStockCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search by name or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading inventory...</div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Threshold</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts?.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt=""
                          className="h-10 w-10 rounded-lg object-contain"
                        />
                      )}
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{product.sku || "—"}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {product.subcategory.replace(/-/g, " ")}
                  </td>
                  <td className="px-4 py-3 font-semibold">{product.stock_count}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        product.stock_count === 0
                          ? "destructive"
                          : product.stock_count <= product.low_stock_threshold
                            ? "secondary"
                            : "default"
                      }
                    >
                      {product.stock_count === 0
                        ? "Out of Stock"
                        : product.stock_count <= product.low_stock_threshold
                          ? "Low Stock"
                          : "In Stock"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{product.low_stock_threshold}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Adjust
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <InventoryAdjustDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        amount={adjustmentAmount}
        setAmount={setAdjustmentAmount}
        reason={adjustmentReason}
        setReason={setAdjustmentReason}
        onAdjust={handleAdjustStock}
        isAdjusting={adjustMutation.isPending}
      />
    </div>
  );
}

function InventoryAdjustDialog({
  product,
  onClose,
  amount,
  setAmount,
  reason,
  setReason,
  onAdjust,
  isAdjusting,
}: {
  product: any;
  onClose: () => void;
  amount: string;
  setAmount: (value: string) => void;
  reason: string;
  setReason: (value: string) => void;
  onAdjust: () => void;
  isAdjusting: boolean;
}) {
  if (!product) return null;

  const newStock = product.stock_count + (parseInt(amount) || 0);

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock - {product.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Current Stock</Label>
              <p className="text-2xl font-black">{product.stock_count}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">New Stock</Label>
              <p className="text-2xl font-black">{newStock}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Adjustment Amount (+/-)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 10 or -5"
            />
            <p className="text-xs text-muted-foreground">
              Use positive numbers to add stock, negative to remove
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Restock, Damage, Return"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onAdjust} disabled={!amount || isAdjusting}>
              {isAdjusting ? "Adjusting..." : "Adjust Stock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
