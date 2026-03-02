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
import {
  useGetAllPenerimaBantuan,
  useGetAllValidators,
  useUpdatePenerimaBantuan,
} from "@/hooks/useQueries";
import { CheckCircle, Loader2, Search, UserCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Validasi() {
  const { data: penerima, isLoading } = useGetAllPenerimaBantuan();
  const { data: validators } = useGetAllValidators();
  const updateMutation = useUpdatePenerimaBantuan();

  const [search, setSearch] = useState("");
  const [selectedValidator, setSelectedValidator] = useState("");
  const [validatingId, setValidatingId] = useState<bigint | null>(null);

  const needsValidation = penerima?.filter(
    (p) =>
      !p.sudahDivalidasi &&
      (p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.wilayah.toLowerCase().includes(search.toLowerCase())),
  );

  const handleValidate = async (id: bigint) => {
    const item = penerima?.find((p) => p.id === id);
    if (!item) return;

    setValidatingId(id);
    try {
      await updateMutation.mutateAsync({
        ...item,
        sudahDivalidasi: true,
        validatorId: selectedValidator || undefined,
      });
      toast.success(`${item.nama} berhasil divalidasi`);
    } catch {
      toast.error("Gagal memvalidasi data");
    } finally {
      setValidatingId(null);
    }
  };

  const totalPenerima = penerima?.length ?? 0;
  const validated = penerima?.filter((p) => p.sudahDivalidasi).length ?? 0;
  const notValidated = totalPenerima - validated;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <UserCheck className="w-4 h-4" />
          <span>Validasi</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Validasi Data
        </h1>
        <p className="text-muted-foreground mt-2">
          Verifikasi data penerima bantuan oleh tim relawan RTIK Indonesia
          Peduli.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-l-4 border-l-navy">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Penerima</p>
            {isLoading ? (
              <Skeleton className="h-8 w-12 mt-1" />
            ) : (
              <p className="text-2xl font-display font-bold text-navy">
                {totalPenerima}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[oklch(0.65_0.16_150)]">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Sudah Divalidasi</p>
            {isLoading ? (
              <Skeleton className="h-8 w-12 mt-1" />
            ) : (
              <p
                className="text-2xl font-display font-bold"
                style={{ color: "oklch(0.45 0.16 150)" }}
              >
                {validated}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[oklch(0.78_0.18_75)]">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Belum Divalidasi</p>
            {isLoading ? (
              <Skeleton className="h-8 w-12 mt-1" />
            ) : (
              <p className="text-2xl font-display font-bold text-gold">
                {notValidated}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari penerima atau wilayah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="validasi.search.input"
          />
        </div>
        {validators && validators.length > 0 && (
          <Select
            value={selectedValidator}
            onValueChange={setSelectedValidator}
          >
            <SelectTrigger
              className="w-48"
              data-ocid="validasi.validator.select"
            >
              <SelectValue placeholder="Pilih validator..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Validator</SelectItem>
              {validators
                .filter((v) => v.aktif)
                .map((v) => (
                  <SelectItem key={v.id.toString()} value={v.nama}>
                    {v.nama}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Needs Validation Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">
            Data Menunggu Validasi ({needsValidation?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {[
                      "No",
                      "Nama",
                      "Wilayah",
                      "Jenis Bantuan",
                      "Status",
                      "Validasi",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {needsValidation && needsValidation.length > 0 ? (
                    needsValidation.map((p, idx) => (
                      <tr
                        key={p.id.toString()}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`validasi.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">{p.nama}</td>
                        <td className="px-4 py-3">{p.wilayah}</td>
                        <td className="px-4 py-3">{p.jenisBantuan}</td>
                        <td className="px-4 py-3">
                          <StatusBantuanBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-amber-600 text-xs">
                            <XCircle className="w-3.5 h-3.5" />
                            Belum
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white gap-1"
                            onClick={() => handleValidate(p.id)}
                            disabled={
                              validatingId === p.id || updateMutation.isPending
                            }
                            data-ocid={`validasi.validate_button.${idx + 1}`}
                          >
                            {validatingId === p.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            Validasi
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-muted-foreground"
                        data-ocid="validasi.table.empty_state"
                      >
                        {search
                          ? "Tidak ada data yang ditemukan"
                          : "Semua data sudah divalidasi ✓"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Already Validated */}
      {penerima && penerima.filter((p) => p.sudahDivalidasi).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Sudah Divalidasi ({validated})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {["No", "Nama", "Wilayah", "Jenis Bantuan", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-medium"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {penerima
                    .filter((p) => p.sudahDivalidasi)
                    .map((p, idx) => (
                      <tr
                        key={p.id.toString()}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`validasi.validated.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">{p.nama}</td>
                        <td className="px-4 py-3">{p.wilayah}</td>
                        <td className="px-4 py-3">{p.jenisBantuan}</td>
                        <td className="px-4 py-3">
                          <StatusBantuanBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
