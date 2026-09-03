import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { submitQuote } from "@/lib/catalog";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Pacxone International" },
      { name: "description", content: "Get in touch with Pacxone International for product inquiries, quotations, and technical support." },
      { property: "og:title", content: "Contact — Pacxone International" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

function Field({ name, label, type = "text", required, error }: { name: string; label: string; type?: string; required?: boolean; error?: string }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        name={name}
        type={type}
        maxLength={255}
        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = schema.safeParse(data);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      setSubmitError("");
      return;
    }
    setErrors({});
    setSubmitError("");

    try {
      await submitQuote({
        name: res.data.name,
        company: res.data.company || "",
        phone: res.data.phone || "",
        email: res.data.email,
        productName: "",
        message: res.data.message,
      });
      setSent(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to send your inquiry right now.");
    }
  };

  return (
    <>
      <section className="pt-32 pb-16 bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Get in touch</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Tell us what you need — pricing, availability, technical guidance, or a full project quote. Our team responds within one business day.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-12">
          <div className="space-y-6">
            {[
              { icon: MapPin, label: "Address", value: "Office 401, Mehdi Tower, 115A, S.M.C.H.S, Shahrah-e-Faisal, Karachi", href: "https://www.google.com/maps/place/Mehdi+Tower/@24.8601414,67.0539185,17z/data=!4m14!1m7!3m6!1s0x3eb33e849a7255ab:0x11cd094961dbc6a9!2sMehdi+Tower!8m2!3d24.8601414!4d67.0564934!16s%2Fg%2F11xsnb3x_!3m5!1s0x3eb33e849a7255ab:0x11cd094961dbc6a9!8m2!3d24.8601414!4d67.0564934!16s%2Fg%2F11xsnb3x_?entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D" },
              { icon: Phone, label: "Phone", value: "", href: "" },
              { icon: MessageCircle, label: "WhatsApp", value: "+92 3002409524", href: "https://wa.me/+923002409524" },
              { icon: Mail, label: "Email", value: "info@pacxoneinternational.com", href: "mailto:info@pacxoneinternational.com" },
              { icon: Mail, label: "Email", value: "pacxoneinternational@gmail.com", href: "mailto:pacxoneinternational@gmail.com" },
            ].map((c) => (
              <div key={c.label} className="p-6 rounded-lg border border-border flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-primary shrink-0">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noreferrer" : undefined} className="mt-1 block font-medium hover:text-primary">{c.value}</a>
                  ) : (
                    <div className="mt-1 font-medium">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-lg overflow-hidden border border-border aspect-video">
              <iframe
                title="Location"
                src="https://www.google.com/maps?q=Mehdi+Tower,+Karachi&output=embed"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border p-8 bg-background">
            {sent ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-2xl font-bold">Message sent</h2>
                <p className="mt-2 text-muted-foreground">Thanks for reaching out — we'll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <h2 className="text-2xl font-bold">Send an inquiry</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field name="name" label="Name" required error={errors.name} />
                  <Field name="company" label="Company" error={errors.company} />
                  <Field name="phone" label="Phone" error={errors.phone} />
                  <Field name="email" label="Email" type="email" required error={errors.email} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message <span className="text-primary">*</span></label>
                  <textarea
                    name="message"
                    rows={5}
                    maxLength={2000}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                    placeholder="Tell us about your project or product requirements…"
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                <button
                  type="submit"
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-[oklch(0.42_0.075_335)] transition-colors"
                >
                  Send Inquiry <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}