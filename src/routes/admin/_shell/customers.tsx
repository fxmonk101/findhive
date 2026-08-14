import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

// @ts-ignore - Temporary ignore until route tree regenerates
export const Route = createFileRoute("/admin/_shell/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers", search],
    queryFn: async () => {
      let query = supabase.from("customers").select("*").order("created_at", { ascending: false });
      
      if (search.trim()) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
      }
      
      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: any }) => {
      const { data, error } = await supabase
        .from("customers")
        .update(values)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Customer updated successfully");
      qc.invalidateQueries({ queryKey: ["admin-customers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleUpdateNotes = (notes: string) => {
    if (selectedCustomer) {
      updateMutation.mutate({
        id: selectedCustomer.id,
        values: { notes },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Customers</h1>
        <p className="text-sm text-muted-foreground">
          Manage customer accounts and information
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading customers...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customers?.map((customer) => (
            <Card
              key={customer.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCustomer(customer)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{customer.full_name || "Unknown"}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail size={14} />
                      {customer.email}
                    </p>
                  </div>
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                    {customer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.phone && (
                  <p className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Phone size={14} />
                    {customer.phone}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <ShoppingBag size={14} className="text-muted-foreground" />
                    <span className="font-medium">View orders</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
          {customers?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No customers found
            </div>
          )}
        </div>
      )}

      <CustomerDetailDialog
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onUpdateNotes={handleUpdateNotes}
      />
    </div>
  );
}

function CustomerDetailDialog({
  customer,
  onClose,
  onUpdateNotes,
}: {
  customer: any;
  onClose: () => void;
  onUpdateNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(customer?.notes || "");

  if (!customer) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
  };

  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{customer.full_name || "Customer Details"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase">Email</Label>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                {customer.email}
              </p>
            </div>
            {customer.phone && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Phone</Label>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  {customer.phone}
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-semibold">{new Date(customer.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {customer.shipping_address && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase">Shipping Address</Label>
              <p className="text-sm flex items-start gap-2">
                <MapPin size={16} className="text-muted-foreground mt-0.5" />
                <span>
                  {typeof customer.shipping_address === "string"
                    ? customer.shipping_address
                    : JSON.stringify(customer.shipping_address)}
                </span>
              </p>
            </div>
          )}

          {customer.billing_address && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase">Billing Address</Label>
              <p className="text-sm flex items-start gap-2">
                <MapPin size={16} className="text-muted-foreground mt-0.5" />
                <span>
                  {typeof customer.billing_address === "string"
                    ? customer.billing_address
                    : JSON.stringify(customer.billing_address)}
                </span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this customer..."
              rows={4}
            />
            <Button onClick={handleSaveNotes} size="sm">
              Save Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
