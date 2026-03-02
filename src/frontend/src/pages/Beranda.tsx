import { StatusBantuanBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { useGetAllPenerimaBantuan } from "@/hooks/useQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  ChevronRight,
  Clock,
  Package,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CHART_COLORS = [
  "oklch(0.78 0.18 75)",
  "oklch(0.48 0.11 205)",
  "oklch(0.65 0.16 150)",
  "oklch(0.58 0.14 230)",
  "oklch(0.72 0.10 200)",
];

function formatCurrency(amount: bigint) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export default function Beranda() {
  const { data: penerima, isLoading } = useGetAllPenerimaBantuan();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const seedMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.seedSampleData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const seedMutate = seedMutation.mutate;

  // Seed sample data if no data exists
  useEffect(() => {
    if (
      !isFetching &&
      actor &&
      !isLoading &&
      penerima &&
      penerima.length === 0
    ) {
      seedMutate();
    }
  }, [actor, isFetching, isLoading, penerima, seedMutate]);

  const total = penerima?.length ?? 0;
  const didistribusikan =
    penerima?.filter((p) => p.status === "didistribusikan").length ?? 0;
  const menunggu = penerima?.filter((p) => p.status === "menunggu").length ?? 0;
  const diproses = penerima?.filter((p) => p.status === "diproses").length ?? 0;

  // Chart data
  const jenisBantuanData = penerima
    ? Object.entries(
        penerima.reduce<Record<string, number>>((acc, p) => {
          acc[p.jenisBantuan] = (acc[p.jenisBantuan] || 0) + 1;
          return acc;
        }, {}),
      ).map(([name, value]) => ({ name, value }))
    : [];

  const statusData = [
    { name: "Menunggu", value: menunggu },
    { name: "Diproses", value: diproses },
    { name: "Didistribusikan", value: didistribusikan },
  ].filter((d) => d.value > 0);

  const recentPenerima = penerima?.slice(-5).reverse() ?? [];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm text-white/80 backdrop-blur-sm">
              <BadgeCheck className="w-4 h-4 text-gold" />
              <span>
                Tim relawan RTIK sudah survey, data sudah dilaporkan ke BPBD
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transparansi Data
              <br />
              <span className="text-gold">RTIK INDONESIA PEDULI</span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Platform transparan untuk memantau dan mengelola data penerima
              bantuan bencana oleh Relawan TIK Indonesia. Data real-time,
              akurat, dan dapat dipertanggungjawabkan.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/penerima-bantuan">
                <Button
                  data-ocid="hero.lihat_data.button"
                  size="lg"
                  className="btn-gold border-0 shadow-navy-lg"
                >
                  Lihat Data Penerima
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/rekap">
                <Button
                  data-ocid="hero.lihat_rekap.button"
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 bg-transparent"
                >
                  Lihat Rekap
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-5 h-5 text-navy" />}
              label="Total Penerima"
              value={isLoading ? null : total}
              color="navy"
            />
            <StatCard
              icon={
                <CheckCircle
                  className="w-5 h-5"
                  style={{ color: "oklch(0.55 0.16 150)" }}
                />
              }
              label="Didistribusikan"
              value={isLoading ? null : didistribusikan}
              color="green"
            />
            <StatCard
              icon={
                <Clock
                  className="w-5 h-5"
                  style={{ color: "oklch(0.55 0.18 75)" }}
                />
              }
              label="Menunggu"
              value={isLoading ? null : menunggu}
              color="amber"
            />
            <StatCard
              icon={
                <Package
                  className="w-5 h-5"
                  style={{ color: "oklch(0.38 0.14 230)" }}
                />
              }
              label="Diproses"
              value={isLoading ? null : diproses}
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* Tabs: Data Bencana / Bantuan Pasca Bencana */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Tabs defaultValue="bencana">
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger value="bencana" data-ocid="home.bencana.tab">
              Data Bencana
            </TabsTrigger>
            <TabsTrigger value="bantuan" data-ocid="home.bantuan.tab">
              Bantuan Pasca Bencana
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bencana">
            <DataTabContent
              isLoading={isLoading}
              jenisBantuanData={jenisBantuanData}
              statusData={statusData}
              recentPenerima={recentPenerima}
              title="Data Bencana"
            />
          </TabsContent>

          <TabsContent value="bantuan">
            <DataTabContent
              isLoading={isLoading}
              jenisBantuanData={jenisBantuanData}
              statusData={statusData}
              recentPenerima={recentPenerima}
              title="Bantuan Pasca Bencana"
            />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  color: "navy" | "green" | "amber" | "blue";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const borderColors = {
    navy: "border-l-navy",
    green: "border-l-[oklch(0.55_0.16_150)]",
    amber: "border-l-[oklch(0.55_0.18_75)]",
    blue: "border-l-[oklch(0.38_0.14_230)]",
  };

  return (
    <Card className={`border-l-4 ${borderColors[color]} shadow-xs`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2.5 rounded-lg bg-muted flex-shrink-0">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          {value === null ? (
            <Skeleton className="h-7 w-12 mt-1" />
          ) : (
            <p className="text-2xl font-display font-bold text-foreground">
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DataTabContentProps {
  isLoading: boolean;
  jenisBantuanData: { name: string; value: number }[];
  statusData: { name: string; value: number }[];
  recentPenerima: ReturnType<typeof useGetAllPenerimaBantuan>["data"] extends
    | (infer T)[]
    | undefined
    ? T[]
    : never[];
  title: string;
}

function DataTabContent({
  isLoading,
  jenisBantuanData,
  statusData,
  recentPenerima,
  title: _title,
}: DataTabContentProps) {
  return (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-foreground mb-4 text-sm">
              Penerima per Jenis Bantuan
            </h3>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : jenisBantuanData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={jenisBantuanData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {jenisBantuanData.map((entry, index) => (
                      <Cell
                        key={`cell-jenis-${entry.name}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
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

        <Card>
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-foreground mb-4 text-sm">
              Status Distribusi Bantuan
            </h3>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    paddingAngle={3}
                  >
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
                  </Pie>
                  <Tooltip />
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

      {/* Recent Data Table */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">
              Data Terbaru
            </h3>
            <Link to="/penerima-bantuan">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                Lihat Semua <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentPenerima.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground text-sm"
              data-ocid="home.data.empty_state"
            >
              Belum ada data penerima bantuan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                      Nama
                    </th>
                    <th className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs uppercase tracking-wide hidden md:table-cell">
                      Wilayah
                    </th>
                    <th className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                      Jenis Bantuan
                    </th>
                    <th className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs uppercase tracking-wide hidden sm:table-cell">
                      Jumlah
                    </th>
                    <th className="text-left py-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPenerima.map((p, idx) => (
                    <tr
                      key={p.id.toString()}
                      className="border-b border-border/50 table-row-hover"
                      data-ocid={`home.data.item.${idx + 1}`}
                    >
                      <td className="py-3 pr-4 font-medium">{p.nama}</td>
                      <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">
                        {p.wilayah}
                      </td>
                      <td className="py-3 pr-4">{p.jenisBantuan}</td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        {formatCurrency(p.jumlahBantuan)}
                      </td>
                      <td className="py-3">
                        <StatusBantuanBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
