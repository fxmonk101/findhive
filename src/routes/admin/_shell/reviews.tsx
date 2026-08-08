import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Check, X, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// @ts-ignore - Temporary ignore until route tree regenerates
export const Route = createFileRoute("/admin/_shell/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews", filter],
    queryFn: async () => {
      let query = supabase
        .from("product_reviews")
        .select(`
          *,
          products:product_id (title, image_url)
        `)
        .order("created_at", { ascending: false });
      
      if (filter !== "all") {
        query = query.eq("status", filter);
      }
      
      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("product_reviews")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Review status updated");
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted");
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleApprove = (id: string) => {
    updateMutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: string) => {
    updateMutation.mutate({ id, status: "rejected" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const pendingCount = reviews?.filter((r) => r.status === "pending").length || 0;
  const approvedCount = reviews?.filter((r) => r.status === "approved").length || 0;
  const rejectedCount = reviews?.filter((r) => r.status === "rejected").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Manage customer product reviews
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{reviews?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye size={16} className="text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <X size={16} className="text-red-500" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
      ) : (
        <div className="grid gap-4">
          {reviews?.map((review: any) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.author_name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          review.status === "approved"
                            ? "default"
                            : review.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {review.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium mb-1">{review.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{review.body}</p>
                    
                    {review.products && (
                      <div className="flex items-center gap-2 text-sm">
                        {review.products.image_url && (
                          <img
                            src={review.products.image_url}
                            alt=""
                            className="h-8 w-8 rounded object-cover"
                          />
                        )}
                        <span className="text-muted-foreground">Product:</span>
                        <span className="font-medium">{review.products.title}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {review.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(review.id)}
                        >
                          <Check size={16} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(review.id)}
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {reviews?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No reviews found
            </div>
          )}
        </div>
      )}

      <ReviewDetailDialog
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}

function ReviewDetailDialog({
  review,
  onClose,
}: {
  review: any;
  onClose: () => void;
}) {
  if (!review) return null;

  return (
    <Dialog open={!!review} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-semibold">{review.author_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1">{review.title}</h3>
            <p className="text-muted-foreground">{review.body}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge
                variant={
                  review.status === "approved"
                    ? "default"
                    : review.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {review.status}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Verified Purchase</p>
              <p>{review.verified_purchase ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Review Type</p>
              <p className="capitalize">{review.review_type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Featured</p>
              <p>{review.featured ? "Yes" : "No"}</p>
            </div>
          </div>

          {review.products && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Reviewed Product</p>
              <div className="flex items-center gap-3">
                {review.products.image_url && (
                  <img
                    src={review.products.image_url}
                    alt=""
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <p className="font-medium">{review.products.title}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
