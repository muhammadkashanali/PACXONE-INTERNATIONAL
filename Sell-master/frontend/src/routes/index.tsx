import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Truck, Headset, Award, Users, Cpu } from "lucide-react";
import heroImg from "@/assets/hero-industrial.jpg";
import { categories, products } from "@/lib/products";

export const Route = createFileRoute("/")({
  component: Index,
});

const whyUs = [
  { icon: Award, title: "Quality Products", desc: "Engineered to global industrial standards with rigorous QA." },
  { icon: Truck, title: "Reliable Supply", desc: "Deep inventory and dependable global logistics network." },
  { icon: Headset, title: "Technical Support", desc: "Application engineers ready to help you specify and deploy." },
  { icon: ShieldCheck, title: "Industrial Expertise", desc: "Decades of experience across mission-critical industries." },
  { icon: Users, title: "Customer First", desc: "Long-term partnerships built on trust and consistent delivery." },
  { icon: Cpu, title: "Modern Technology", desc: "Latest automation and electrical innovations, ready to integrate." },
];

const clients = [
  { mark: "AS", name: "Al-Sadr Industries" },
  { mark: "MF", name: "MetaForge" },
  { mark: "NE", name: "Northline Energy" },
  { mark: "PC", name: "ProCore Systems" },
  { mark: "VG", name: "Vertex Grid" },
  { mark: "OM", name: "Orion Manufacturing" },
];

const testimonials = [
  { name: "Ahmed R.", role: "Plant Manager, Al-Sadr Industries", quote: "Pacxone has been our go-to for automation components. Their technical team helped us cut commissioning time by 30%." },
  { name: "Priya S.", role: "Procurement Lead, MetaForge", quote: "Consistent quality, on-time delivery, and honest pricing. Rare combination in industrial supply." },
  { name: "Marcus L.", role: "Chief Engineer, Northline Energy", quote: "Their switchgear range and support pulled us through a demanding grid upgrade. Highly recommended." },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 min-h-[92vh] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32 w-full">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-4 py-1.5 text-xs font-medium text-white/90 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Industrial Electrical & Automation
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
              Powering Industries with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[oklch(0.7_0.09_320)]">
                Reliable Electrical
              </span>{" "}
              & Automation Solutions
            </h1>
            <p className="mt-6 text-lg text-white/75 max-w-2xl leading-relaxed">
              High-quality industrial electrical products and automation solutions for
              manufacturing, infrastructure, commercial, and industrial applications.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-[oklch(0.42_0.075_335)] transition-all shadow-[0_10px_40px_-10px_oklch(0.5_0.07_335/0.6)]"
              >
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center rounded-md border border-white/25 bg-white/5 backdrop-blur px-6 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About Pacxone</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
              A trusted partner for industrial electrical excellence.
            </h2>
          </div>
          <div>
            <p className="text-muted-foreground leading-relaxed">
              Pacxone International supplies premium electrical and automation products to
              manufacturers, contractors, and industrial operators worldwide. Our portfolio
              spans PLCs, drives, switchgear, sensors, and control systems — backed by
              application engineering, dependable stock, and long-term partnership.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
              Learn more about us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why Choose Us</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Built on reliability, engineered for performance.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((f) => (
              <div key={f.title} className="group p-8 rounded-lg bg-background border border-border hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_oklch(0.5_0.07_335/0.25)] transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Categories</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Featured product categories</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/products"
                search={{ category: c.id }}
                className="group relative overflow-hidden rounded-lg bg-secondary aspect-4/5 block"
              >
                <img src={c.image} alt={c.name} loading="lazy" width={1024} height={768} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                  <p className="mt-1 text-xs text-white/70 line-clamp-2">{c.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all">
                    Explore <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Featured</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Selected products from our catalog</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.filter((p) => p.featured).map((p) => (
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
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{p.brand}</p>
                  <h3 className="mt-1 font-semibold leading-tight line-clamp-2">{p.name}</h3>
                  <p className="mt-3 text-xs text-muted-foreground">{p.model}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Industries</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Industries we serve</h2>
          </div>
          <div className="mt-16 overflow-hidden border-y border-border py-5" aria-label="Companies we currently serve">
            <div className="flex w-max animate-client-marquee hover:[animation-play-state:paused]">
              {[...clients, ...clients].map((client, index) => (
                <div key={`${client.name}-${index}`} className="flex w-[220px] shrink-0 items-center gap-3 px-6 sm:w-[260px]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-xs font-bold tracking-tight text-primary">
                    {client.mark}
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold text-foreground/75">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - temporarily disabled */}
      {/*
      <section className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Testimonials</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Trusted by industrial leaders</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="p-8 rounded-lg bg-background border border-border">
                <blockquote className="text-sm leading-relaxed text-foreground/80">"{t.quote}"</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl p-12 sm:p-16 bg-[oklch(0.22_0.005_285)] text-white">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to request a quotation?</h2>
                <p className="mt-4 text-white/70 leading-relaxed">Tell us what you need. Our team responds within one business day with pricing, availability, and technical guidance.</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link to="/contact" className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-[oklch(0.42_0.075_335)] transition-colors">
                  Request Quote <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/products" className="inline-flex h-12 items-center rounded-md border border-white/25 px-6 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
