import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight, ChevronDown } from "lucide-react";
import { type Category, type Product } from "@/lib/products";
import { fetchCategories, fetchProducts } from "@/lib/catalog";
import { z } from "zod";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products — Pacxone International" },
      { name: "description", content: "Browse industrial automation, power, drives, sensors and electrical products from Pacxone International." },
      { property: "og:title", content: "Products — Pacxone International" },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const [sort, setSort] = useState<"name" | "category">("name");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, items] = await Promise.all([fetchCategories(), fetchProducts()]);
        setCategories(cats);
        setProducts(items);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeCat = search.category ?? "all";

  const list = useMemo(() => {
    let out = products.slice();
    if (activeCat !== "all") {
      const selectedCategory = categories.find((category) => category.id === activeCat || category.slug === activeCat);
      const childIds = selectedCategory && !selectedCategory.parentCategory
        ? categories.filter((category) => category.parentCategory === selectedCategory._id).map((category) => category.slug || category.id)
        : [];
      const categoryIds = [activeCat, selectedCategory?.slug, ...childIds].filter(Boolean);
      out = out.filter((p) => categoryIds.includes(p.categoryId));
    }
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter((p) =>
        [p.name, p.brand, p.model, p.description].some((f) => f.toLowerCase().includes(s)),
      );
    }
    if (sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
    else out.sort((a, b) => (a.categoryId || "").localeCompare(b.categoryId || ""));
    return out;
  }, [q, activeCat, sort, products, categories]);

  return (
    <>
      <section className="bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Catalog</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Our Products</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Industrial automation, power distribution, drives, sensors and control components — sourced and supported for demanding applications.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[260px_1fr] gap-10">
          <aside className="space-y-8">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                  className="w-full h-10 rounded-md border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Category</label>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => navigate({ search: { q: q || undefined } })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeCat === "all" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.filter((category) => !category.parentCategory).map((parent) => {
                  const children = categories.filter((category) => category.parentCategory === parent._id);
                  const isExpanded = expandedCategories[parent.id];
                  return (
                    <li key={parent.id}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => children.length ? setExpandedCategories((current) => ({ ...current, [parent.id]: !current[parent.id] })) : navigate({ search: { category: parent.id, q: q || undefined } })}
                          className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${activeCat === parent.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                        >
                          {parent.name}
                        </button>
                        {children.length > 0 && (
                          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
                        )}
                      </div>
                      {isExpanded && (
                        <ul className="ml-3 mt-1 space-y-1 border-l border-border pl-2">
                          {children.map((child) => (
                            <li key={child.id}>
                              <button
                                onClick={() => navigate({ search: { category: child.id, q: q || undefined } })}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${activeCat === child.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                              >
                                {child.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "name" | "category")}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="name">Alphabetical</option>
                <option value="category">Category</option>
              </select>
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{loading ? "Loading products..." : `${list.length} product${list.length !== 1 ? "s" : ""}`}</p>
            </div>
            {loading ? (
              <div className="rounded-lg border border-dashed border-border p-16 text-center">
                <p className="text-muted-foreground">Loading catalog...</p>
              </div>
            ) : list.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-16 text-center">
                <p className="text-muted-foreground">No products match your filters.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((p) => (
                  <Link
                    key={p.id}
                    to="/products/$id"
                    params={{ id: p.id }}
                    className="group bg-background rounded-lg border border-border overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_oklch(0.5_0.07_335/0.25)] transition-all"
                  >
                    <div className="aspect-square overflow-hidden bg-secondary">
                      <img src={p.image} alt={p.name} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{p.brand}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.availability === "In Stock" ? "bg-green-500/10 text-green-700" : p.availability === "Limited" ? "bg-amber-500/10 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                          {p.availability}
                        </span>
                      </div>
                      <h3 className="mt-2 font-semibold leading-tight line-clamp-2">{p.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{p.model}</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-70 group-hover:opacity-100 group-hover:gap-2 transition-all">
                        View details <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}