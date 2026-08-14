import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

// @ts-ignore - Temporary ignore until route tree regenerates
export const Route = createFileRoute("/admin/_shell/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: values.name,
          slug: values.slug,
          description: values.description || null,
          image_url: values.image_url || null,
          meta_title: values.meta_title || null,
          meta_description: values.meta_description || null,
          is_active: values.is_active,
          position: values.position,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: any }) => {
      const { data, error } = await supabase
        .from("categories")
        .update({
          name: values.name,
          slug: values.slug,
          description: values.description || null,
          image_url: values.image_url || null,
          meta_title: values.meta_title || null,
          meta_description: values.meta_description || null,
          is_active: values.is_active,
          position: values.position,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      setOpen(false);
      setEditingCategory(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      meta_title: formData.get("meta_title") as string,
      meta_description: formData.get("meta_description") as string,
      is_active: formData.get("is_active") === "on",
      position: parseInt(formData.get("position") as string) || 0,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? This will also affect products in this category.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage product categories and their settings
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="rounded-xl font-bold">
              <Plus size={16} className="mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingCategory?.name || ""}
                    required
                    placeholder="e.g., Trading Cards"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={editingCategory?.slug || ""}
                    required
                    placeholder="e.g., trading-cards"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingCategory?.description || ""}
                  placeholder="Category description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  defaultValue={editingCategory?.image_url || ""}
                  placeholder="https://example.com/category-image.jpg"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="position">Display Order</Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    defaultValue={editingCategory?.position || 0}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="is_active"
                    name="is_active"
                    defaultChecked={editingCategory?.is_active ?? true}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input
                  id="meta_title"
                  name="meta_title"
                  defaultValue={editingCategory?.meta_title || ""}
                  placeholder="Custom SEO title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  defaultValue={editingCategory?.meta_description || ""}
                  placeholder="SEO meta description"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories?.map((category) => (
                <tr key={category.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <GripVertical className="text-muted-foreground" size={16} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        category.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{category.position}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit size={15} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        <Trash2 size={15} className="text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No categories yet. Add your first category to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
