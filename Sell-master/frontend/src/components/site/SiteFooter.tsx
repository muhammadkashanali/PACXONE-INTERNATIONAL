import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[oklch(0.22_0.005_285)] text-white/80 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/white.ico" alt="Pacxone International" width={280} height={75} className="h-[60px] w-auto max-w-[240px] object-contain mix-blend-screen" />
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold text-white">Pacxone</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">International</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            Reliable electrical solutions powering modern industries worldwide.
          </p>
          {/* Social links temporarily disabled. */}
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-primary transition-colors">Industrial Automation</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors">Power & Switchgear</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors">Drives & Motors</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors">Sensors & Relays</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><a href="https://www.google.com/maps/place/Mehdi+Tower/@24.8601414,67.0539185,17z/data=!4m14!1m7!3m6!1s0x3eb33e849a7255ab:0x11cd094961dbc6a9!2sMehdi+Tower!8m2!3d24.8601414!4d67.0564934!16s%2Fg%2F11xsnb3x_!3m5!1s0x3eb33e849a7255ab:0x11cd094961dbc6a9!8m2!3d24.8601414!4d67.0564934!16s%2Fg%2F11xsnb3x_?entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="hover:text-primary">Office 401, Mehdi Tower, 115A, S.M.C.H.S, Shahrah-e-Faisal, Karachi</a></li>
            <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><a href="tel:+10000000000" className="hover:text-primary">+92 3002409524</a></li>
            <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><a href="tel:+10000000000" className="hover:text-primary"></a></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><a href="mailto:info@pacxone.com" className="hover:text-primary">info@pacxoneinternational.com</a></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><a href="mailto:info@pacxone.com" className="hover:text-primary">pacxoneinternational@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Pacxone International. All rights reserved.</p>
          <p>Powering industries with reliability.</p>
        </div>
      </div>
    </footer>
  );
}