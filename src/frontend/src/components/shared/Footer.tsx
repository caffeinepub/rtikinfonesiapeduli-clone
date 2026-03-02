import { useGetAllFooterLinks } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone, Shield } from "lucide-react";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/peta", label: "Peta Bencana" },
  { to: "/tanggapi", label: "Tanggapi" },
  { to: "/publikasi", label: "Publikasi" },
  { to: "/penerima-bantuan", label: "Penerima Bantuan" },
  { to: "/rekap", label: "Rekap Data" },
];

export function Footer() {
  const { data: footerLinks } = useGetAllFooterLinks();
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-navy" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="text-white font-display font-bold text-sm">
                  RELAWAN TIK
                </div>
                <div className="text-white/60 text-[10px] uppercase tracking-wider">
                  Indonesia
                </div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Sistem Informasi RTIK Indonesia Peduli untuk data penerima bantuan
              bencana. Transparansi dan akuntabilitas dalam pengelolaan bantuan
              bencana.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-display font-semibold text-sm mb-4 uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mitra */}
          <div>
            <h3 className="text-white font-display font-semibold text-sm mb-4 uppercase tracking-wider">
              Mitra
            </h3>
            <ul className="space-y-2">
              {footerLinks && footerLinks.length > 0 ? (
                [...footerLinks]
                  .sort((a, b) => Number(a.order) - Number(b.order))
                  .map((link) => (
                    <li key={link.id.toString()}>
                      <a
                        href={link.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/60 hover:text-gold transition-colors"
                      >
                        {link.linkLabel}
                      </a>
                    </li>
                  ))
              ) : (
                <>
                  <li>
                    <a
                      href="https://bnpb.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-gold transition-colors"
                    >
                      BPBD Nasional
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://bnpb.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-gold transition-colors"
                    >
                      BNPB Indonesia
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.pmi.or.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-gold transition-colors"
                    >
                      PMI Indonesia
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-display font-semibold text-sm mb-4 uppercase tracking-wider">
              Kontak
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold/70" />
                <span>Badan Penanggulangan Bencana Daerah</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 flex-shrink-0 text-gold/70" />
                <span>119 / 021-500-454</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 flex-shrink-0 text-gold/70" />
                <span>info@rtik.or.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>
            © {currentYear} RTIK Indonesia Peduli. Hak cipta dilindungi.
          </span>
          <span>
            Built with <Heart className="inline w-3 h-3 text-gold/70" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold/70 underline transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
