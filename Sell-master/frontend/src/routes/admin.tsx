import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getStoredAdminUser, clearStoredAdminUser } from "@/lib/auth";
import { fetchAdminProducts, fetchAdminQuotes, createProduct, deleteProduct, updateQuoteStatus, updateProduct } from "@/lib/catalog";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    const user = getStoredAdminUser();

    if (location.pathname === "/admin/login") {
      if (user) {
        throw redirect({ to: "/admin" });
      }
      return;
    }

    if (!user) {
      throw redirect({ to: "/admin/login", search: { redirect: location.href } });
    }
  },
  component: AdminLayout,
});

type FormState = {
  _id?: string;
  name: string;
  brand: string;
  model: string;
  categoryId: string;
  description: string;
  image: string;
  features: string;
  applications: string;
  availability: "In Stock" | "On Order" | "Limited";
  featured: boolean;
};

const emptyForm: FormState = {
  name: "",
  brand: "",
  model: "",
  categoryId: "industrial-automation",
  description: "",
  image: "",
  features: "",
  applications: "",
  availability: "In Stock",
  featured: false,
};

function AdminLayout() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const user = getStoredAdminUser();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate, user]);

  if (!user) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">Redirecting to login...</div>;
  }

  const productStats = useMemo(
    () => ({
      total: products.length,
      inStock: products.filter((p) => p.availability === "In Stock").length,
      featured: products.filter((p) => p.featured).length,
      quotes: quotes.length,
    }),
    [products, quotes],
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [productData, quoteData] = await Promise.all([fetchAdminProducts(), fetchAdminQuotes()]);
      setProducts(productData as any[]);
      setQuotes(quoteData as any[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleLogout = () => {
    clearStoredAdminUser();
    navigate({ to: "/admin/login" });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const fillForm = (product: any) => {
    setEditingId(product._id || product.id);
    setForm({
      _id: product._id || product.id,
      name: product.name || "",
      brand: product.brand || "",
      model: product.model || "",
      categoryId: product.categoryId || "industrial-automation",
      description: product.description || "",
      image: product.image || "",
      features: Array.isArray(product.features) ? product.features.join("\n") : "",
      applications: Array.isArray(product.applications) ? product.applications.join("\n") : "",
      availability: product.availability || "In Stock",
      featured: Boolean(product.featured),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        features: form.features.split("\n").map((item) => item.trim()).filter(Boolean),
        applications: form.applications.split("\n").map((item) => item.trim()).filter(Boolean),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      if (editingId === id) resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleQuoteStatusUpdate = async (id: string, status: string) => {
    try {
      await updateQuoteStatus(id, status);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-bold">Pacxone Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user?.name}</span>
          <button onClick={handleLogout} className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Products", value: productStats.total },
          { label: "In Stock", value: productStats.inStock },
          { label: "Featured", value: productStats.featured },
          { label: "Quote Requests", value: productStats.quotes },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-background p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{card.label}</div>
            <div className="mt-3 text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-border bg-background p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{editingId ? "Edit Product" : "Add Product"}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-primary">
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" className="h-11 rounded-md border border-border px-3 text-sm" />
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand" className="h-11 rounded-md border border-border px-3 text-sm" />
              <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Model" className="h-11 rounded-md border border-border px-3 text-sm" />
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="h-11 rounded-md border border-border px-3 text-sm">
                <option value="industrial-automation">Industrial Automation</option>
                <option value="power-switchgear">Power & Switchgear</option>
                <option value="drives-motors">Drives & Motors</option>
                <option value="sensors-relays">Sensors & Relays</option>
              </select>
            </div>

            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="h-11 w-full rounded-md border border-border px-3 text-sm" />

            <div className="grid gap-4 sm:grid-cols-2">
              <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features (one per line)" rows={6} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
              <textarea value={form.applications} onChange={(e) => setForm({ ...form, applications: e.target.value })} placeholder="Applications (one per line)" rows={6} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>

            <div className="flex flex-wrap gap-4">
              <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value as FormState["availability"] })} className="h-11 rounded-md border border-border px-3 text-sm">
                <option value="In Stock">In Stock</option>
                <option value="On Order">On Order</option>
                <option value="Limited">Limited</option>
              </select>

              <label className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                <input checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} type="checkbox" />
                Featured product
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground">
                {editingId ? "Update Product" : "Save Product"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-semibold hover:bg-secondary">
                  Clear
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-border bg-background p-6">
          <h2 className="mb-4 text-xl font-semibold">Product Catalog</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading catalog...</p>
          ) : (
            <div className="space-y-3">
              {products.map((product: any) => (
                <div key={product._id || product.id} className="rounded-md border border-border p-3">
                  <div className="flex items-start gap-3">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="h-14 w-14 rounded-md object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">{product.name}</p>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide">{product.availability}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{product.model}</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={() => fillForm(product)} className="text-xs font-medium text-primary">Edit</button>
                        <button type="button" onClick={() => handleDeleteProduct(product._id || product.id)} className="text-xs font-medium text-red-600">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-10 rounded-xl border border-border bg-background p-6">
        <h2 className="mb-4 text-xl font-semibold">Quote Requests</h2>
        <div className="space-y-3">
          {quotes.map((quote: any) => (
            <div key={quote._id} className="rounded-md border border-border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{quote.name}</p>
                  <p className="text-sm text-muted-foreground">{quote.email} • {quote.company || "No company"}</p>
                  <p className="text-xs text-muted-foreground">{quote.productName || "General inquiry"}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={quote.status || "new"}
                    onChange={(e) => handleQuoteStatusUpdate(quote._id, e.target.value)}
                    className="h-9 rounded-md border border-border px-2 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone</div>
                  <div className="mt-1 text-sm">{quote.phone || "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Submitted</div>
                  <div className="mt-1 text-sm">{quote.createdAt ? new Date(quote.createdAt).toLocaleString() : "—"}</div>
                </div>
              </div>

              <div className="mt-4 rounded-md bg-secondary p-3 text-sm text-foreground/80">
                {quote.message}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
