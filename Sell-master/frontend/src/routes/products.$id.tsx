import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Download, Mail, FileText } from "lucide-react";
import { fetchCategories, fetchProductById, fetchProducts } from "@/lib/catalog";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    const product = await fetchProductById(params.id);
    if (!product) throw notFound();
    const [categories, allProducts] = await Promise.all([fetchCategories(), fetchProducts()]);
    const related = allProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
    return { product: product as Product, categories, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — Pacxone" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Pacxone International` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} — Pacxone` },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${product.id}` },
      ],
      links: [{ rel: "canonical", href: `/products/${product.id}` }],
    };
  },
  component: ProductDetail,
  notFoundComponent: NotFoundView,
  errorComponent: ErrorView,
});

function NotFoundView() {
  return (
    <div className="pt-32 pb-24 mx-auto max-w-2xl text-center px-4">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <p className="mt-3 text-muted-foreground">This product may have been removed or the link is incorrect.</p>
      <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
    </div>
  );
}

function ErrorView({ error }: { error: Error }) {
  return (
    <div className="pt-32 pb-24 mx-auto max-w-2xl text-center px-4">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
    </div>
  );
}

function ProductDetail() {
  const { product, categories, related } = Route.useLoaderData();
  const category = categories.find((c) => c.id === product.categoryId || c.slug === product.categoryId);

  return (
    <>
      <div className="pt-28 pb-8 bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            {category && (
              <>
                <Link to="/products" search={{ category: category.id }} className="hover:text-primary">{category.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary border border-border">
            <img src={product.image} alt={product.name} width={1024} height={768} className="h-full w-full object-cover" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{product.brand}</span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span>Model: <span className="font-mono text-foreground">{product.model}</span></span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.availability === "In Stock" ? "bg-green-500/10 text-green-700" : product.availability === "Limited" ? "bg-amber-500/10 text-amber-700" : "bg-muted text-muted-foreground"}`}>{product.availability}</span>
            </div>
            <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-[oklch(0.42_0.075_335)] transition-colors">
                Request Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`mailto:info@pacxoneinternational.com?subject=Inquiry about ${encodeURIComponent(product.name)}`} className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-5 text-sm font-semibold hover:bg-secondary transition-colors">
                <Mail className="h-4 w-4" /> Email Inquiry
              </a>
              <button className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-5 text-sm font-semibold hover:bg-secondary transition-colors">
                <Download className="h-4 w-4" /> Datasheet
              </button>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f: string) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Applications</h3>
                <ul className="space-y-2">
                  {product.applications.map((a: string) => (
                    <li key={a} className="flex gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-secondary border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">Technical Specifications</h2>
          <div className="rounded-lg overflow-hidden border border-border bg-background">
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((s: { label: string; value: string }, i: number) => (
                  <tr key={s.label} className={i % 2 === 0 ? "bg-background" : "bg-secondary"}>
                    <td className="px-6 py-3 font-medium w-1/3">{s.label}</td>
                    <td className="px-6 py-3 text-muted-foreground">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="group bg-background rounded-lg border border-border overflow-hidden hover:border-primary/40 transition-all">
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img src={p.image} alt={p.name} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{p.brand}</p>
                    <h3 className="mt-1 text-sm font-semibold line-clamp-2">{p.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}