import { StatusBantuanBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { loadLeaflet } from "@/hooks/useLeaflet";
import { useGetAllPenerimaBantuan } from "@/hooks/useQueries";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  List,
  Map as MapIcon,
  MapPin,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const PAGE_SIZE = 10;

// Default coordinates for known Indonesian cities (fallback)
const WILAYAH_COORDS: Record<string, [number, number]> = {
  Jakarta: [-6.2088, 106.8456],
  "Jakarta Selatan": [-6.2615, 106.8106],
  "Jakarta Timur": [-6.2251, 106.9004],
  "Jakarta Pusat": [-6.1801, 106.8283],
  "Jakarta Utara": [-6.1382, 106.8635],
  "Jakarta Barat": [-6.1686, 106.7632],
  Bandung: [-6.9175, 107.6191],
  Surabaya: [-7.2575, 112.7521],
  Yogyakarta: [-7.7971, 110.3688],
  Semarang: [-6.9932, 110.4203],
  Medan: [3.5952, 98.6722],
  Makassar: [-5.1477, 119.4327],
  Palembang: [-2.9761, 104.7754],
  Denpasar: [-8.6705, 115.2126],
  Padang: [-0.9471, 100.4172],
  Manado: [1.4748, 124.8421],
  Pekanbaru: [0.5071, 101.4478],
  Banjarmasin: [-3.3194, 114.5908],
  Pontianak: [-0.0263, 109.3425],
  Balikpapan: [-1.2675, 116.8289],
  Aceh: [4.6951, 96.7494],
  NTT: [-8.6574, 121.0794],
  NTB: [-8.6529, 117.3616],
  Sulawesi: [-1.43, 121.4456],
  Kalimantan: [-1.6815, 113.3824],
  Papua: [-4.2699, 138.0804],
  Maluku: [-3.2385, 130.1453],
};

function getCoords(
  wilayah: string,
  lat?: number,
  lng?: number,
): [number, number] | null {
  if (lat && lng && lat !== 0 && lng !== 0) return [lat, lng];
  const directMatch = WILAYAH_COORDS[wilayah];
  if (directMatch) return directMatch;
  const partialKey = Object.keys(WILAYAH_COORDS).find((k) =>
    wilayah.toLowerCase().includes(k.toLowerCase()),
  );
  if (partialKey) return WILAYAH_COORDS[partialKey];
  return null;
}

function getMarkerColor(status: string): string {
  switch (status) {
    case "didistribusikan":
      return "#16a34a";
    case "diproses":
      return "#2563eb";
    default:
      return "#d97706";
  }
}

interface PenerimaItem {
  id: bigint;
  nama: string;
  wilayah: string;
  alamat: string;
  jenisBantuan: string;
  jumlahBantuan: bigint;
  keperluanBantuan: string;
  status: string;
  koordinatLat: number;
  koordinatLng: number;
  tanggal: string;
  sudahDivalidasi: boolean;
}

interface LeafletMap {
  remove(): void;
}
interface LeafletMarker {
  remove(): void;
}

function MapComponent({ items }: { items: PenerimaItem[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;

    loadLeaflet().then((L) => {
      if (!mapRef.current || leafletMapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [-2.5, 118.0],
        zoom: 5,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      leafletMapRef.current = map;
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !window.L) return;

    const L = window.L;

    // Remove old markers
    for (const m of markersRef.current) {
      m.remove();
    }
    markersRef.current = [];

    for (const p of items) {
      const coords = getCoords(p.wilayah, p.koordinatLat, p.koordinatLng);
      if (!coords) continue;

      const jitter: [number, number] = [
        coords[0] + (Math.random() - 0.5) * 0.02,
        coords[1] + (Math.random() - 0.5) * 0.02,
      ];

      const jumlahFormatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(p.jumlahBantuan));

      const color = getMarkerColor(p.status);
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width: 24px; height: 24px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -26],
      });

      const marker = L.marker(jitter, { icon })
        .bindPopup(
          `<div style="min-width:200px; font-family:sans-serif; font-size:13px;">
            <div style="font-weight:700; margin-bottom:4px; font-size:14px;">${p.nama}</div>
            <div style="color:#555; margin-bottom:2px;">📍 ${p.wilayah}</div>
            <div style="color:#555; margin-bottom:2px;">📦 ${p.jenisBantuan}</div>
            <div style="color:#555; margin-bottom:4px;">💰 ${jumlahFormatted}</div>
            <div style="margin-top:6px; display:inline-block; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600;
              background:${p.status === "didistribusikan" ? "#dcfce7" : p.status === "diproses" ? "#dbeafe" : "#fef9c3"};
              color:${p.status === "didistribusikan" ? "#15803d" : p.status === "diproses" ? "#1d4ed8" : "#92400e"};">
              ${p.status.charAt(0).toUpperCase() + p.status.slice(1)}
            </div>
            ${p.sudahDivalidasi ? '<div style="color:#16a34a; font-size:11px; margin-top:4px;">✓ Sudah divalidasi</div>' : '<div style="color:#9ca3af; font-size:11px; margin-top:4px;">✗ Belum divalidasi</div>'}
          </div>`,
          { maxWidth: 280 },
        )
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [items]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: "520px", zIndex: 0 }}
      data-ocid="penerima.map_marker"
    />
  );
}

function formatCurrency(amount: bigint) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function PenerimaBantuan() {
  const { data: penerima, isLoading } = useGetAllPenerimaBantuan();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJenis, setFilterJenis] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");

  const jenisList = useMemo(
    () =>
      penerima
        ? [...new Set(penerima.map((p) => p.jenisBantuan).filter(Boolean))]
        : [],
    [penerima],
  );

  const filtered = useMemo(() => {
    if (!penerima) return [];
    return penerima.filter((p) => {
      const matchSearch =
        !search ||
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.wilayah.toLowerCase().includes(search.toLowerCase()) ||
        p.jenisBantuan.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchJenis =
        filterJenis === "all" || p.jenisBantuan === filterJenis;
      return matchSearch && matchStatus && matchJenis;
    });
  }, [penerima, search, filterStatus, filterJenis]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExportCSV = () => {
    if (!filtered.length) return;
    const headers = [
      "No",
      "Nama",
      "Alamat",
      "Wilayah",
      "Jenis Bantuan",
      "Jumlah Bantuan",
      "Keperluan",
      "Status",
      "Tanggal",
      "Divalidasi",
    ];
    const rows = filtered.map((p, idx) => [
      idx + 1,
      p.nama,
      p.alamat,
      p.wilayah,
      p.jenisBantuan,
      Number(p.jumlahBantuan),
      p.keperluanBantuan,
      p.status,
      p.tanggal,
      p.sudahDivalidasi ? "Ya" : "Tidak",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "penerima-bantuan.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRekapPDF = () => {
    if (!filtered.length) return;

    const totalNominal = filtered.reduce(
      (sum, p) => sum + Number(p.jumlahBantuan),
      0,
    );
    const menunggu = filtered.filter((p) => p.status === "menunggu").length;
    const diproses = filtered.filter((p) => p.status === "diproses").length;
    const didistribusikan = filtered.filter(
      (p) => p.status === "didistribusikan",
    ).length;
    const sudahDivalidasi = filtered.filter((p) => p.sudahDivalidasi).length;

    const tanggalCetak = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    const formatNum = (n: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(n);

    const statusLabel = (s: string) => {
      if (s === "menunggu") return "Menunggu";
      if (s === "diproses") return "Diproses";
      if (s === "didistribusikan") return "Didistribusikan";
      return s;
    };

    const statusColor = (s: string) => {
      if (s === "didistribusikan") return "#166534";
      if (s === "diproses") return "#1e40af";
      return "#92400e";
    };

    const statusBg = (s: string) => {
      if (s === "didistribusikan") return "#dcfce7";
      if (s === "diproses") return "#dbeafe";
      return "#fef3c7";
    };

    const tableRows = filtered
      .map(
        (p, idx) => `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="padding:7px 10px;border:1px solid #dde3ea;text-align:center;color:#64748b;">${idx + 1}</td>
        <td style="padding:7px 10px;border:1px solid #dde3ea;font-weight:600;color:#1e293b;">${p.nama}</td>
        <td style="padding:7px 10px;border:1px solid #dde3ea;color:#475569;">${p.wilayah}</td>
        <td style="padding:7px 10px;border:1px solid #dde3ea;color:#475569;">${p.jenisBantuan}</td>
        <td style="padding:7px 10px;border:1px solid #dde3ea;text-align:right;color:#1e293b;">${formatCurrency(p.jumlahBantuan)}</td>
        <td style="padding:7px 10px;border:1px solid #dde3ea;text-align:center;">
          <span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;background:${statusBg(p.status)};color:${statusColor(p.status)};">${statusLabel(p.status)}</span>
        </td>
        <td style="padding:7px 10px;border:1px solid #dde3ea;text-align:center;color:${p.sudahDivalidasi ? "#15803d" : "#9ca3af"};">
          ${p.sudahDivalidasi ? "✓ Sudah" : "✗ Belum"}
        </td>
        <td style="padding:7px 10px;border:1px solid #dde3ea;color:#64748b;font-size:12px;">${formatDate(p.tanggal)}</td>
      </tr>
    `,
      )
      .join("");

    const html = `
      <div id="penerima-rekap-overlay" style="
        position:fixed;inset:0;z-index:99999;
        background:#ffffff;overflow:auto;
        padding:32px;box-sizing:border-box;
        font-family:'Segoe UI',Arial,sans-serif;
      ">
        <!-- Header -->
        <div style="border-bottom:3px solid #1a2e4a;padding-bottom:16px;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:8px;">
            <img src="/assets/uploads/v-AbSTb_400x400-1--1.jpg"
              onerror="this.style.display='none'"
              style="width:52px;height:52px;object-fit:contain;border-radius:8px;" />
            <div>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#1a2e4a;letter-spacing:-0.5px;">
                RTIK Indonesia Peduli
              </h1>
              <p style="margin:2px 0 0;font-size:13px;color:#64748b;">Rekap Data Penerima Bantuan</p>
            </div>
          </div>
          <p style="margin:0;font-size:12px;color:#64748b;">Dicetak pada: ${tanggalCetak}</p>
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:24px;">
          <div style="border:1px solid #dde3ea;border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#1a2e4a;">${filtered.length}</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">Total Penerima</div>
          </div>
          <div style="border:1px solid #dde3ea;border-radius:8px;padding:12px;text-align:center;grid-column:span 2;">
            <div style="font-size:18px;font-weight:800;color:#1a2e4a;">${formatNum(totalNominal)}</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">Total Nominal</div>
          </div>
          <div style="border:1px solid #fef3c7;border-radius:8px;padding:12px;text-align:center;background:#fffbeb;">
            <div style="font-size:22px;font-weight:800;color:#92400e;">${menunggu}</div>
            <div style="font-size:11px;color:#92400e;margin-top:2px;">Menunggu</div>
          </div>
          <div style="border:1px solid #dbeafe;border-radius:8px;padding:12px;text-align:center;background:#eff6ff;">
            <div style="font-size:22px;font-weight:800;color:#1e40af;">${diproses}</div>
            <div style="font-size:11px;color:#1e40af;margin-top:2px;">Diproses</div>
          </div>
          <div style="border:1px solid #dcfce7;border-radius:8px;padding:12px;text-align:center;background:#f0fdf4;">
            <div style="font-size:22px;font-weight:800;color:#166534;">${didistribusikan}</div>
            <div style="font-size:11px;color:#166534;margin-top:2px;">Didistribusikan</div>
          </div>
        </div>
        <div style="margin-bottom:20px;padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#166534;">
          ✓ Sudah Divalidasi: <strong>${sudahDivalidasi}</strong> dari ${filtered.length} penerima
        </div>

        <!-- Table -->
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#1a2e4a;color:#ffffff;">
              <th style="padding:9px 10px;border:1px solid #1a2e4a;text-align:center;font-weight:700;width:40px;">No</th>
              <th style="padding:9px 10px;border:1px solid #1a2e4a;text-align:left;font-weight:700;">Nama</th>
              <th style="padding:9px 10px;border:1px solid #1a2e4a;text-align:left;font-weight:700;">Wilayah</th>
              <th style="padding:9px 10px;border:1px solid #1a2e4a;text-align:left;font-weight:700;">Jenis Bantuan</th>
              <th style="padding:9px 10px;border:1px solid #1a2e4a;text-align:right;font-weight:700;">Jumlah Bantuan</th>
              <th style="padding:9px 10px;border:1px solid #1a2e4a;text-align:center;font-weight:700;">Status</th>
              <th style="padding:9px 10px;border:1px solid #1a2e4a;text-align:center;font-weight:700;">Validasi</th>
              <th style="padding:9px 10px;border:1px solid #1a2e4a;text-align:left;font-weight:700;">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <!-- Footer -->
        <div style="margin-top:24px;padding-top:12px;border-top:1px solid #dde3ea;text-align:center;font-size:11px;color:#94a3b8;">
          Dicetak dari sistem RTIK Indonesia Peduli — rtik-indonesia-peduli.id
        </div>
      </div>
    `;

    const overlay = document.createElement("div");
    overlay.innerHTML = html;
    const overlayEl = overlay.firstElementChild as HTMLElement;
    overlayEl.id = "penerima-rekap-overlay";
    document.body.appendChild(overlayEl);

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const cleanup = () => {
      document.body.style.overflow = originalBodyOverflow;
      const el = document.getElementById("penerima-rekap-overlay");
      if (el) el.remove();
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);
    setTimeout(() => {
      window.print();
    }, 120);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Users className="w-4 h-4" />
            <span>Data Penerima</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Data Penerima Bantuan
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportCSV}
            data-ocid="penerima.export.button"
            disabled={!filtered.length}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            onClick={handleRekapPDF}
            data-ocid="penerima.rekap_pdf.button"
            disabled={!filtered.length}
          >
            <FileText className="w-4 h-4" />
            Rekap PDF
          </Button>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm text-blue-700 mb-6 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
        Data diperbarui secara real-time dari sistem RTIK Indonesia Peduli
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 mb-6 bg-muted/50 border border-border rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setViewMode("table")}
          data-ocid="penerima.view_table.tab"
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === "table"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <List className="w-4 h-4" />
          Tabel
        </button>
        <button
          type="button"
          onClick={() => setViewMode("map")}
          data-ocid="penerima.view_map.tab"
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === "map"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          Peta
        </button>
      </div>

      {/* Filters — always visible */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, wilayah, atau jenis bantuan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
            data-ocid="penerima.search.input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="w-36"
              data-ocid="penerima.status_filter.select"
            >
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="menunggu">Menunggu</SelectItem>
              <SelectItem value="diproses">Diproses</SelectItem>
              <SelectItem value="didistribusikan">Didistribusikan</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterJenis}
            onValueChange={(v) => {
              setFilterJenis(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              {jenisList.map((j) => (
                <SelectItem key={j} value={j}>
                  {j}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-navy" />
              Peta Sebaran Penerima Bantuan
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {filtered.length} data ditampilkan
              </span>
            </CardTitle>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-amber-600" />
                Menunggu
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                Diproses
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                Didistribusikan
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[520px] w-full" />
            ) : filtered.length === 0 ? (
              <div
                className="h-[520px] flex flex-col items-center justify-center text-muted-foreground gap-2"
                data-ocid="penerima.map.empty_state"
              >
                <MapPin className="w-8 h-8 opacity-30" />
                <span>Tidak ada data yang sesuai filter</span>
              </div>
            ) : (
              <MapComponent items={filtered as PenerimaItem[]} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-ocid="penerima.table">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium w-10">
                          No
                        </th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                          Nama
                        </th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium hidden md:table-cell">
                          Wilayah
                        </th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                          Jenis Bantuan
                        </th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium hidden lg:table-cell">
                          Jumlah
                        </th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium hidden lg:table-cell">
                          Keperluan
                        </th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium hidden md:table-cell">
                          Tanggal
                        </th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                          Validasi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length > 0 ? (
                        paginated.map((p, idx) => (
                          <tr
                            key={p.id.toString()}
                            className="border-b border-border/50 table-row-hover"
                            data-ocid={`penerima.item.${(page - 1) * PAGE_SIZE + idx + 1}`}
                          >
                            <td className="px-4 py-3 text-muted-foreground">
                              {(page - 1) * PAGE_SIZE + idx + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium">{p.nama}</div>
                              <div className="text-xs text-muted-foreground md:hidden">
                                {p.wilayah}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                              {p.wilayah}
                            </td>
                            <td className="px-4 py-3">{p.jenisBantuan}</td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              {formatCurrency(p.jumlahBantuan)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell max-w-[180px] truncate">
                              {p.keperluanBantuan}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBantuanBadge status={p.status} />
                            </td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                              {formatDate(p.tanggal)}
                            </td>
                            <td className="px-4 py-3">
                              {p.sudahDivalidasi ? (
                                <span className="flex items-center gap-1 text-green-600 text-xs">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Sudah
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Belum
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-4 py-10 text-center text-muted-foreground"
                            data-ocid="penerima.table.empty_state"
                          >
                            {search ||
                            filterStatus !== "all" ||
                            filterJenis !== "all"
                              ? "Tidak ada data yang sesuai filter"
                              : "Belum ada data penerima bantuan"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>
                Menampilkan{" "}
                {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                {Math.min(page * PAGE_SIZE, filtered.length)} dari{" "}
                {filtered.length} data
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  data-ocid="penerima.pagination_prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  data-ocid="penerima.pagination_next"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
