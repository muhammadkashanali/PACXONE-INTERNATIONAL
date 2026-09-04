import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const hasSolidTheme = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${hasSolidTheme
        ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={hasSolidTheme ? "/pacxone-brand-purple.png" : "/white.ico-removebg-preview.png"}
            alt="Pacxone International"
            width={220}
            height={59}
            className={`h-11 w-auto max-w-[190px] object-contain transition-transform group-hover:scale-[1.02] ${hasSolidTheme ? "" : "mix-blend-screen"}`}
          />
          <span className="flex flex-col leading-none">
            <span
              className={`text-base font-bold tracking-tight ${hasSolidTheme ? "text-[oklch(0.5_0.07_335)]" : "text-white"
                }`}
            >
              Pacxone
            </span>

            <span
              className={`text-[10px] font-medium uppercase tracking-[0.18em] ${hasSolidTheme ? "text-[oklch(0.5_0.07_335)]/80" : "text-white/70"
                }`}
            >
              International
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className={`text-sm font-medium transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full data-[status=active]:text-primary data-[status=active]:after:w-full ${hasSolidTheme
                ? "text-foreground/80"
                : "text-white/90 hover:text-white"
                }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/contact"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[oklch(0.42_0.075_335)] transition-colors"
          >
            Request Quote
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md ${hasSolidTheme ? "text-foreground" : "text-white"
            } hover:bg-secondary`}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary data-[status=active]:text-primary"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Request Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}