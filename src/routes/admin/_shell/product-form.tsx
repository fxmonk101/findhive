import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "@/lib/categories";
import { createProduct, updateProduct, getAdminProduct, type ProductStatus } from "@/lib/admin/products";
import { ArrowLeft, Save, X, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sku: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  cost_price: z.string().optional(),
  discount_price: z.string().optional(),
  stock_count: z.string().min(1, "Stock quantity is required"),
  low_stock_threshold: z.string().min(1, "Low stock threshold is required"),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  url_slug: z.string().optional(),
  focus_keyword: z.string().optional(),
  // Pokemon-specific fields
  pokemon_set: z.string().optional(),
  card_number: z.string().optional(),
  language: z.string().optional(),
  rarity: z.string().optional(),
  condition: z.string().optional(),
  grade: z.string().optional(),
  grading_company: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

// @ts-ignore - Temporary ignore until route tree regenerates
export const Route = createFileRoute("/admin/_shell/product-form")({
  component: ProductForm,
});

function ProductForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get("id");
  const isEdit = !!productId;

  const [tagInput, setTagInput] = useState("");
  const [mainImage, setMainImage] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const { data: existingProduct, isLoading } = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: () => getAdminProduct(productId!),
    enabled: isEdit,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "draft",
      stock_count: "0",
      low_stock_threshold: "10",
      is_featured: false,
      tags: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => createProduct({
      title: data.title,
      sku: data.sku || null,
      brand: data.brand || null,
      category: data.category,
      subcategory: data.subcategory,
      short_description: data.short_description || null,
      long_description: data.long_description || null,
      price: parseFloat(data.price),
      cost_price: data.cost_price ? parseFloat(data.cost_price) : null,
      discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
      stock_count: parseInt(data.stock_count),
      low_stock_threshold: parseInt(data.low_stock_threshold),
      status: data.status as ProductStatus,
      is_featured: data.is_featured || false,
      tags: data.tags || [],
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      url_slug: data.url_slug || null,
      focus_keyword: data.focus_keyword || null,
      image_url: mainImage || null,
    } as any),
    onSuccess: () => {
      toast.success("Product created successfully");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      navigate({ to: "/admin/products" });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => updateProduct(productId!, {
      title: data.title,
      sku: data.sku || null,
      brand: data.brand || null,
      category: data.category,
      subcategory: data.subcategory,
      short_description: data.short_description || null,
      long_description: data.long_description || null,
      price: parseFloat(data.price),
      cost_price: data.cost_price ? parseFloat(data.cost_price) : null,
      discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
      stock_count: parseInt(data.stock_count),
      low_stock_threshold: parseInt(data.low_stock_threshold),
      status: data.status as ProductStatus,
      is_featured: data.is_featured || false,
      tags: data.tags || [],
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      url_slug: data.url_slug || null,
      focus_keyword: data.focus_keyword || null,
      image_url: mainImage || null,
    } as any, existingProduct?.stock_count),
    onSuccess: () => {
      toast.success("Product updated successfully");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      navigate({ to: "/admin/products" });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter((tag) => tag !== tagToRemove));
  };

  if (isEdit && isLoading) {
    return <div className="p-8">Loading product...</div>;
  }

  const selectedCategory = CATEGORIES.find((c) => c.slug === form.watch("category"));
  const isPokemonCategory = selectedCategory?.slug === "trading-cards" && form.watch("subcategory") === "pokemon-tcg";

  return (
    <div className="max-w-6xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin/products" })}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-black">{isEdit ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? "Update product information" : "Create a new product for your store"}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
            <TabsTrigger value="pokemon">Pokemon Fields</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Enter product title"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      {...form.register("sku")}
                      placeholder="e.g., PROD-001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      {...form.register("brand")}
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={form.watch("category")}
                      onValueChange={(value) => {
                        form.setValue("category", value);
                        form.setValue("subcategory", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory *</Label>
                    <Select
                      value={form.watch("subcategory")}
                      onValueChange={(value) => form.setValue("subcategory", value)}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory?.subcategories.map((sub) => (
                          <SelectItem key={sub.slug} value={sub.slug}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.subcategory && (
                      <p className="text-sm text-destructive">{form.formState.errors.subcategory.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.watch("status")}
                      onValueChange={(value) => form.setValue("status", value as ProductStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    {...form.register("short_description")}
                    placeholder="Brief product summary for cards and listings"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long_description">Long Description</Label>
                  <Textarea
                    id="long_description"
                    {...form.register("long_description")}
                    placeholder="Full product description with details, features, and specifications"
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add a tag and press Enter"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("tags") || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={form.watch("is_featured")}
                    onCheckedChange={(checked) => form.setValue("is_featured", checked)}
                  />
                  <Label htmlFor="is_featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Main Product Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    {mainImage ? (
                      <div className="relative inline-block">
                        <img src={mainImage} alt="Main product" className="max-h-64 mx-auto rounded-lg" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setMainImage("")}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon size={48} className="mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload or enter main image URL</p>
                        <Input
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={mainImage}
                          onChange={(e) => setMainImage(e.target.value)}
                          className="max-w-xs mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image Gallery</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {galleryImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-border rounded-lg p-4 flex items-center justify-center min-h-32">
                      <Button type="button" variant="outline" size="icon">
                        <Plus size={24} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Regular Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...form.register("price")}
                      placeholder="0.00"
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount_price">Sale Price</Label>
                    <Input
                      id="discount_price"
                      type="number"
                      step="0.01"
                      {...form.register("discount_price")}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost_price">Cost Price</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      {...form.register("cost_price")}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Input value="USD" disabled />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock_count">Stock Quantity *</Label>
                    <Input
                      id="stock_count"
                      type="number"
                      {...form.register("stock_count")}
                      placeholder="0"
                    />
                    {form.formState.errors.stock_count && (
                      <p className="text-sm text-destructive">{form.formState.errors.stock_count.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="low_stock_threshold">Low Stock Threshold *</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      {...form.register("low_stock_threshold")}
                      placeholder="10"
                    />
                    {form.formState.errors.low_stock_threshold && (
                      <p className="text-sm text-destructive">{form.formState.errors.low_stock_threshold.message}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Stock Status</p>
                  <p className="text-2xl font-bold mt-1">
                    {parseInt(form.watch("stock_count") || "0") === 0
                      ? "Out of Stock"
                      : parseInt(form.watch("stock_count") || "0") <= parseInt(form.watch("low_stock_threshold") || "10")
                        ? "Low Stock"
                        : "In Stock"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pokemon">
            <Card>
              <CardHeader>
                <CardTitle>Pokémon TCG Specific Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isPokemonCategory ? (
                  <p className="text-sm text-muted-foreground">
                    These fields are only available for Pokémon TCG products. Select "Trading Cards" &gt; "Pokémon TCG" as the category to enable these fields.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pokemon_set">Set Name</Label>
                      <Input
                        id="pokemon_set"
                        {...form.register("pokemon_set")}
                        placeholder="e.g., Base Set, Scarlet & Violet"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card_number">Card Number</Label>
                      <Input
                        id="card_number"
                        {...form.register("card_number")}
                        placeholder="e.g., 4/102"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={form.watch("language")}
                        onValueChange={(value) => form.setValue("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="korean">Korean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rarity">Rarity</Label>
                      <Select
                        value={form.watch("rarity")}
                        onValueChange={(value) => form.setValue("rarity", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="uncommon">Uncommon</SelectItem>
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="ultra-rare">Ultra Rare</SelectItem>
                          <SelectItem value="secret-rare">Secret Rare</SelectItem>
                          <SelectItem value="promo">Promo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={form.watch("condition")}
                        onValueChange={(value) => form.setValue("condition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mint">Mint</SelectItem>
                          <SelectItem value="near-mint">Near Mint</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="played">Played</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grading_company">Grading Company</Label>
                      <Select
                        value={form.watch("grading_company")}
                        onValueChange={(value) => form.setValue("grading_company", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grading company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="psa">PSA</SelectItem>
                          <SelectItem value="cgc">CGC</SelectItem>
                          <SelectItem value="bgs">BGS</SelectItem>
                          <SelectItem value="none">Ungraded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        {...form.register("grade")}
                        placeholder="e.g., 10, 9.5, 9"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    {...form.register("seo_title")}
                    placeholder="Custom SEO title (defaults to product title if empty)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended length: 50-60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description">Meta Description</Label>
                  <Textarea
                    id="seo_description"
                    {...form.register("seo_description")}
                    placeholder="Brief description for search engines"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended length: 150-160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url_slug">URL Slug</Label>
                  <Input
                    id="url_slug"
                    {...form.register("url_slug")}
                    placeholder="product-url-slug"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from title if empty
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus_keyword">Focus Keyword</Label>
                  <Input
                    id="focus_keyword"
                    {...form.register("focus_keyword")}
                    placeholder="Primary keyword for SEO"
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">SEO Quality Score</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-3/4" />
                    </div>
                    <span className="text-sm font-medium">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/admin/products" })}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <Save size={16} className="mr-2" />
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
