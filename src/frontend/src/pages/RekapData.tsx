import { StatusBantuanBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllPenerimaBantuan } from "@/hooks/useQueries";
import {
  BarChart2,
  FileSpreadsheet,
  FileText,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(amount);
}

const CHART_COLORS = [
  "oklch(0.78 0.18 75)",
  "oklch(0.48 0.11 205)",
  "oklch(0.65 0.16 150)",
  "oklch(0.58 0.14 230)",
  "oklch(0.72 0.10 200)",
  "oklch(0.55 0.18 310)",
];

function formatCurrencyFull(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RekapData() {
  const { data: penerima, isLoading } = useGetAllPenerimaBantuan();

  const stats = useMemo(() => {
    if (!penerima) return null;
    const total = penerima.length;
    const totalNominal = penerima.reduce(
      (sum, p) => sum + Number(p.jumlahBantuan),
      0,
    );
    const menunggu = penerima.filter((p) => p.status === "menunggu").length;
    const diproses = penerima.filter((p) => p.status === "diproses").length;
    const didistribusikan = penerima.filter(
      (p) => p.status === "didistribusikan",
    ).length;
    const sudahDivalidasi = penerima.filter((p) => p.sudahDivalidasi).length;
    return {
      total,
      totalNominal,
      menunggu,
      diproses,
      didistribusikan,
      sudahDivalidasi,
    };
  }, [penerima]);

  const byWilayah = useMemo(() => {
    if (!penerima) return [];
    const map = penerima.reduce<
      Record<string, { count: number; nominal: number }>
    >((acc, p) => {
      if (!acc[p.wilayah]) acc[p.wilayah] = { count: 0, nominal: 0 };
      acc[p.wilayah].count++;
      acc[p.wilayah].nominal += Number(p.jumlahBantuan);
      return acc;
    }, {});
    return Object.entries(map).map(([wilayah, d]) => ({ wilayah, ...d }));
  }, [penerima]);

  const byJenis = useMemo(() => {
    if (!penerima) return [];
    const map = penerima.reduce<Record<string, number>>((acc, p) => {
      acc[p.jenisBantuan] = (acc[p.jenisBantuan] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [penerima]);

  const statusData = useMemo(
    () =>
      [
        { name: "Menunggu", value: stats?.menunggu ?? 0 },
        { name: "Diproses", value: stats?.diproses ?? 0 },
        { name: "Didistribusikan", value: stats?.didistribusikan ?? 0 },
      ].filter((d) => d.value > 0),
    [stats],
  );

  const handleDownloadCSV = useCallback(() => {
    if (!penerima || penerima.length === 0 || !stats) return;

    const rows: string[][] = [];

    // Summary header section
    rows.push(["REKAP DATA BANTUAN - RTIK INDONESIA PEDULI"]);
    rows.push([
      "Tanggal Ekspor",
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    ]);
    rows.push([]);
    rows.push(["=== STATISTIK RINGKASAN ==="]);
    rows.push(["Indikator", "Nilai"]);
    rows.push(["Total Penerima", String(stats.total)]);
    rows.push([
      "Total Nominal Bantuan",
      formatCurrencyFull(stats.totalNominal),
    ]);
    rows.push(["Menunggu", String(stats.menunggu)]);
    rows.push(["Diproses", String(stats.diproses)]);
    rows.push(["Didistribusikan", String(stats.didistribusikan)]);
    rows.push(["Sudah Divalidasi", String(stats.sudahDivalidasi)]);
    rows.push([]);
    rows.push(["=== RINGKASAN PER WILAYAH ==="]);
    rows.push(["Wilayah", "Jumlah Penerima", "Total Nominal", "Persentase"]);

    for (const row of byWilayah) {
      const pct =
        stats.total > 0
          ? `${((row.count / stats.total) * 100).toFixed(1)}%`
          : "0%";
      rows.push([
        row.wilayah,
        String(row.count),
        formatCurrencyFull(row.nominal),
        pct,
      ]);
    }

    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const tanggal = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `rekap-bantuan-${tanggal}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [penerima, stats, byWilayah]);

  const handleDownloadPDF = useCallback(() => {
    document.body.classList.add("print-mode");
    window.print();
    // Remove class after the print dialog closes
    setTimeout(() => {
      document.body.classList.remove("print-mode");
    }, 1000);
  }, []);

  const isExportDisabled = isLoading || !penerima || penerima.length === 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Print-only header (hidden on screen) */}
      <div className="print-header hidden">
        <h1>Rekap &amp; Statistik - RTIK Indonesia Peduli</h1>
        <p>
          Dicetak pada:{" "}
          {new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <BarChart2 className="w-4 h-4" />
          <span>Rekap</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Rekap &amp; Statistik
            </h1>
            <p className="text-muted-foreground mt-2">
              Ringkasan data distribusi bantuan bencana RTIK Indonesia Peduli
              secara keseluruhan.
            </p>
          </div>
          <div className="flex gap-2 no-print shrink-0">
            <Button
              onClick={handleDownloadCSV}
              disabled={isExportDisabled}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              data-ocid="rekap.export_csv.button"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download CSV
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isExportDisabled}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              data-ocid="rekap.export_pdf.button"
            >
              <FileText className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 rekap-stats-cards">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-l-4 border-l-navy">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-navy" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Penerima
                  </p>
                </div>
                <p className="text-3xl font-display font-bold text-navy">
                  {stats?.total ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-gold">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-gold" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Nominal
                  </p>
                </div>
                <p className="text-2xl font-display font-bold text-gold">
                  {formatCurrency(stats?.totalNominal ?? 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[oklch(0.65_0.16_150)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp
                    className="w-4 h-4"
                    style={{ color: "oklch(0.55 0.16 150)" }}
                  />
                  <p className="text-xs text-muted-foreground font-medium">
                    Didistribusikan
                  </p>
                </div>
                <p
                  className="text-3xl font-display font-bold"
                  style={{ color: "oklch(0.45 0.16 150)" }}
                >
                  {stats?.didistribusikan ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[oklch(0.48_0.11_205)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-teal" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Sudah Divalidasi
                  </p>
                </div>
                <p className="text-3xl font-display font-bold text-teal">
                  {stats?.sudahDivalidasi ?? 0}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 rekap-charts-row">
        {/* Bar chart by wilayah */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">
              Penerima per Wilayah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : byWilayah.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byWilayah} margin={{ left: -20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0.02 220)"
                  />
                  <XAxis
                    dataKey="wilayah"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v: string) =>
                      v.replace("Kab. ", "").replace("Kota ", "")
                    }
                  />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number) => [value, "Penerima"]}
                    labelFormatter={(label: string) => `Wilayah: ${label}`}
                  />
                  <Bar
                    dataKey="count"
                    fill="oklch(0.22 0.065 228)"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Belum ada data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie chart by jenis */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">
              Distribusi Jenis Bantuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : byJenis.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={byJenis}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {byJenis.map((entry, index) => (
                      <Cell
                        key={`cell-jenis-${entry.name}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, "Penerima"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Belum ada data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Chart */}
      <Card className="mb-8 rekap-status-chart">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Status Distribusi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={statusData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0.02 220)"
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={100}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {statusData.map((entry, index) => {
                    const colors = [
                      "oklch(0.78 0.18 75)",
                      "oklch(0.48 0.11 205)",
                      "oklch(0.65 0.16 150)",
                    ];
                    return (
                      <Cell
                        key={entry.name}
                        fill={colors[index % colors.length]}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              Belum ada data
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Table by Wilayah */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">
            Ringkasan per Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : byWilayah.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Wilayah
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Jumlah Penerima
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Total Nominal
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Status Terbanyak
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {byWilayah.map((row, idx) => {
                    // Find most common status for this wilayah
                    const wilayahData =
                      penerima?.filter((p) => p.wilayah === row.wilayah) ?? [];
                    const statusCount = wilayahData.reduce<
                      Record<string, number>
                    >((acc, p) => {
                      acc[p.status] = (acc[p.status] || 0) + 1;
                      return acc;
                    }, {});
                    const topStatus = Object.entries(statusCount).sort(
                      (a, b) => b[1] - a[1],
                    )[0];

                    return (
                      <tr
                        key={row.wilayah}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`rekap.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 font-medium">{row.wilayah}</td>
                        <td className="px-4 py-3">{row.count} orang</td>
                        <td className="px-4 py-3">
                          {formatCurrency(row.nominal)}
                        </td>
                        <td className="px-4 py-3">
                          {topStatus ? (
                            <StatusBantuanBadge
                              status={
                                topStatus[0] as
                                  | "menunggu"
                                  | "diproses"
                                  | "didistribusikan"
                              }
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="p-8 text-center text-muted-foreground text-sm"
              data-ocid="rekap.table.empty_state"
            >
              Belum ada data
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
