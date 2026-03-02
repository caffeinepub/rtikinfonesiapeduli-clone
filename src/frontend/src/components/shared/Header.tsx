import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Beranda", ocid: "nav.beranda.link" },
  { to: "/peta", label: "Peta", ocid: "nav.peta.link" },
  { to: "/tanggapi", label: "Tanggapi", ocid: "nav.tanggapi.link" },
  { to: "/publikasi", label: "Publikasi", ocid: "nav.publikasi.link" },
  {
    to: "/penerima-bantuan",
    label: "Penerima Bantuan",
    ocid: "nav.penerima_bantuan.link",
  },
  { to: "/rekap", label: "Rekap", ocid: "nav.rekap.link" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-navy-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/uploads/v-AbSTb_400x400-1--1.jpg"
              alt="Relawan TIK Logo"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm"
            />
            <div className="leading-tight">
              <div className="text-white font-display font-bold text-sm tracking-wide">
                RELAWAN TIK INDONESIA
              </div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
                Sistem Informasi RTIK Indonesia Peduli
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                className="nav-link px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                activeProps={{
                  className: "nav-link active px-3 py-2 rounded-md bg-white/10",
                }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              data-ocid="nav.login.button"
              className="hidden md:block"
            >
              <Button
                variant="outline"
                size="sm"
                className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 bg-transparent text-xs"
              >
                Login Admin
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-dark border-t border-white/10">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                className="block nav-link px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                activeProps={{
                  className:
                    "block nav-link active px-3 py-2 rounded-md bg-white/10",
                }}
                activeOptions={{ exact: link.to === "/" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              data-ocid="nav.login.button"
              onClick={() => setMobileOpen(false)}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "mt-2 w-full border-white/40 text-white hover:bg-white/10 hover:border-white/60 bg-transparent",
                )}
              >
                Login Admin
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
