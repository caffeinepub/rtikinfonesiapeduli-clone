import { StatusBantuanBadge } from "@/components/shared/StatusBadge";
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
import { useGetAllPenerimaBantuan } from "@/hooks/useQueries";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Filter, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Fix default marker icons for Leaflet with bundlers
(L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl =
  undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Color per status
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

function createColoredIcon(color: string) {
  return L.divIcon({
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
}

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
  // Try direct match or partial match
  const directMatch = WILAYAH_COORDS[wilayah];
  if (directMatch) return directMatch;
  const partialKey = Object.keys(WILAYAH_COORDS).find((k) =>
    wilayah.toLowerCase().includes(k.toLowerCase()),
  );
  if (partialKey) return WILAYAH_COORDS[partialKey];
  return null;
}

interface PenerimaItem {
  id: bigint;
  nama: string;
  wilayah: string;
  alamat: string;
  jenisBantuan: string;
  jumlahBantuan: bigint;
  status: string;
  koordinatLat: number;
  koordinatLng: number;
  tanggal: string;
  sudahDivalidasi: boolean;
}

function MapComponent({ items }: { items: PenerimaItem[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;

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

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Remove old markers
    for (const m of markersRef.current) {
      m.remove();
    }
    markersRef.current = [];

    const validItems = items.filter((p) => {
      const coords = getCoords(p.wilayah, p.koordinatLat, p.koordinatLng);
      return coords !== null;
    });

    for (const p of validItems) {
      const coords = getCoords(p.wilayah, p.koordinatLat, p.koordinatLng);
      if (!coords) continue;

      // Add small jitter to avoid perfect overlap
      const jitter: [number, number] = [
        coords[0] + (Math.random() - 0.5) * 0.02,
        coords[1] + (Math.random() - 0.5) * 0.02,
      ];

      const icon = createColoredIcon(getMarkerColor(p.status));
      const marker = L.marker(jitter, { icon })
        .bindPopup(
          `<div style="min-width:180px; font-family:sans-serif; font-size:13px;">
            <div style="font-weight:700; margin-bottom:4px; font-size:14px;">${p.nama}</div>
            <div style="color:#555; margin-bottom:2px;">📍 ${p.wilayah}</div>
            <div style="color:#555; margin-bottom:2px;">📦 ${p.jenisBantuan}</div>
            <div style="margin-top:6px; display:inline-block; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600;
              background:${p.status === "didistribusikan" ? "#dcfce7" : p.status === "diproses" ? "#dbeafe" : "#fef9c3"};
              color:${p.status === "didistribusikan" ? "#15803d" : p.status === "diproses" ? "#1d4ed8" : "#92400e"};">
              ${p.status.charAt(0).toUpperCase() + p.status.slice(1)}
            </div>
            ${p.sudahDivalidasi ? '<div style="color:#16a34a; font-size:11px; margin-top:4px;">✓ Sudah divalidasi</div>' : ""}
          </div>`,
          { maxWidth: 260 },
        )
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [items]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: "480px", zIndex: 0 }}
      data-ocid="peta.map_marker"
    />
  );
}

export default function PetaBencana() {
  const { data: penerima, isLoading } = useGetAllPenerimaBantuan();
  const [search, setSearch] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("all");

  const wilayahList = penerima
    ? [...new Set(penerima.map((p) => p.wilayah).filter(Boolean))]
    : [];

  const filtered = penerima?.filter((p) => {
    const matchSearch =
      !search ||
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.wilayah.toLowerCase().includes(search.toLowerCase());
    const matchWilayah = filterWilayah === "all" || p.wilayah === filterWilayah;
    return matchSearch && matchWilayah;
  });

  // Stats by wilayah
  const byWilayah = penerima
    ? penerima.reduce<
        Record<
          string,
          { total: number; coords: { lat: number; lng: number }[] }
        >
      >((acc, p) => {
        if (!acc[p.wilayah]) acc[p.wilayah] = { total: 0, coords: [] };
        acc[p.wilayah].total++;
        if (p.koordinatLat && p.koordinatLng) {
          acc[p.wilayah].coords.push({
            lat: p.koordinatLat,
            lng: p.koordinatLng,
          });
        }
        return acc;
      }, {})
    : {};

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>Peta Sebaran</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Peta Sebaran Penerima Bantuan
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualisasi distribusi penerima bantuan berdasarkan wilayah dan
          koordinat geografis
        </p>
      </div>

      {/* Interactive Map */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-navy" />
            Peta Interaktif
          </CardTitle>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-2">
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
            <Skeleton className="h-[480px] w-full" />
          ) : (
            <MapComponent
              items={(filtered ?? penerima ?? []) as PenerimaItem[]}
            />
          )}
        </CardContent>
      </Card>

      {/* Sebaran per Wilayah */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Sebaran per Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : Object.keys(byWilayah).length === 0 ? (
            <div
              className="h-48 flex items-center justify-center text-muted-foreground"
              data-ocid="peta.wilayah.empty_state"
            >
              Belum ada data wilayah
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(byWilayah).map(([wilayah, data]) => (
                <div
                  key={wilayah}
                  className="bg-navy/5 border border-navy/20 rounded-lg p-3 hover:bg-navy/10 transition-colors cursor-default"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground leading-tight">
                      {wilayah}
                    </span>
                  </div>
                  <div className="text-2xl font-display font-bold text-navy">
                    {data.total}
                  </div>
                  <div className="text-xs text-muted-foreground">penerima</div>
                  {data.coords.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground/70">
                      {data.coords[0].lat.toFixed(4)},{" "}
                      {data.coords[0].lng.toFixed(4)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau wilayah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="peta.search.input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterWilayah} onValueChange={setFilterWilayah}>
            <SelectTrigger className="w-40" data-ocid="peta.wilayah.select">
              <SelectValue placeholder="Semua Wilayah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Wilayah</SelectItem>
              {wilayahList.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="peta.table">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      No
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Nama
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Wilayah
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium hidden md:table-cell">
                      Alamat
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Koordinat
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered && filtered.length > 0 ? (
                    filtered.map((p, idx) => (
                      <tr
                        key={p.id.toString()}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`peta.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">{p.nama}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-navy" />
                            {p.wilayah}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                          {p.alamat}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {p.koordinatLat
                            ? `${p.koordinatLat.toFixed(4)}, ${p.koordinatLng.toFixed(4)}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBantuanBadge status={p.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-muted-foreground"
                        data-ocid="peta.table.empty_state"
                      >
                        Tidak ada data yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
