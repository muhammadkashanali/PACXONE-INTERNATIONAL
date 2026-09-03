import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Heart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us — Pacxone International" },
      { name: "description", content: "Pacxone International supplies premium industrial electrical and automation products worldwide, backed by engineering expertise and dependable service." },
      { property: "og:title", content: "About — Pacxone International" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  return (
    <>
      <section className="pt-32 pb-16 bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About Pacxone</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">
            Reliable electrical solutions for the industries powering tomorrow.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            We supply the components and systems that keep factories, infrastructure, and industrial operations running — with the engineering depth to make them work.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Who we are</h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>Pacxone International is a specialist supplier of industrial electrical and automation products. We work with manufacturers, EPC contractors, panel builders, and industrial operators across multiple sectors — supplying PLCs, drives, switchgear, sensors, and control components from a curated portfolio.</p>
              <p>Our value isn't just the products. It's the engineering support, technical depth, and consistent supply that turn a component list into a working system.</p>
            </div>
          </div>
          <div className="grid gap-6">
            {[
              { icon: Target, title: "Mission", text: "Deliver dependable electrical and automation solutions that let our customers build, run, and grow their operations." },
              { icon: Eye, title: "Vision", text: "Be the trusted regional partner for industrial technology — known for quality, honesty, and engineering support." },
              { icon: Heart, title: "Values", text: "Reliability, technical rigor, long-term partnership, and doing what we say we'll do." },
            ].map((v) => (
              <div key={v.title} className="p-6 rounded-lg border border-border bg-background flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-primary flex-shrink-0">
                  <v.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight mb-14 text-center">Our journey</h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            {[
              { year: "Founded", text: "Established with a focus on industrial electrical supply." },
              { year: "Growth", text: "Expanded into automation, drives, and control systems." },
              { year: "Partnerships", text: "Built long-term relationships with leading global manufacturers." },
              { year: "Today", text: "Serving industrial customers across manufacturing, energy, and infrastructure." },
            ].map((m, i) => (
              <div key={i} className="relative pl-14 pb-10 last:pb-0">
                <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{i + 1}</div>
                <h3 className="font-semibold">{m.year}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Let's build something reliable together.</h2>
          <p className="mt-4 text-muted-foreground">Talk to our team about your next project.</p>
          <Link to="/contact" className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-[oklch(0.42_0.075_335)] transition-colors">
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}