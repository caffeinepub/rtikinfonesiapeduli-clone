import { StatusPengaduanBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAddPengaduan, useGetAllPengaduan } from "@/hooks/useQueries";
import { CheckCircle, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Status, type Topik } from "../backend.d";

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

const topikLabels: Record<string, string> = {
  bencana: "Bencana",
  bantuan: "Bantuan",
  pengungsian: "Pengungsian",
  infrastruktur: "Infrastruktur",
  kesehatan: "Kesehatan",
  lainnya: "Lainnya",
};

export default function Tanggapi() {
  const { data: pengaduan, isLoading } = useGetAllPengaduan();
  const addMutation = useAddPengaduan();

  const [form, setForm] = useState({
    nama: "",
    kontak: "",
    judul: "",
    topik: "",
    deskripsi: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.nama ||
      !form.kontak ||
      !form.judul ||
      !form.topik ||
      !form.deskripsi
    ) {
      toast.error("Semua field harus diisi");
      return;
    }

    const now = new Date().toISOString().split("T")[0];
    const newId = BigInt(Date.now());

    await addMutation.mutateAsync({
      id: newId,
      nama: form.nama,
      kontak: form.kontak,
      judul: form.judul,
      topik: form.topik as Topik,
      deskripsi: form.deskripsi,
      status: Status.baru,
      tanggal: now,
      catatan: "",
    });

    toast.success("Pengaduan berhasil dikirim!");
    setSubmitted(true);
    setForm({ nama: "", kontak: "", judul: "", topik: "", deskripsi: "" });
  };

  const publicPengaduan = pengaduan?.filter(
    (p) => p.status === "baru" || p.status === "selesai",
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <MessageSquare className="w-4 h-4" />
          <span>Pengaduan</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Sampaikan Pengaduan
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Sampaikan pengaduan, keluhan, atau informasi terkait bencana, bantuan,
          dan pengungsian. Tim RTIK Indonesia akan merespons pengaduan Anda
          secepatnya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-navy" />
                Form Pengaduan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div
                  className="py-12 text-center"
                  data-ocid="tanggapi.success_state"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    Pengaduan Berhasil Dikirim!
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Terima kasih telah menyampaikan pengaduan. Tim kami akan
                    segera merespons.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="bg-navy text-white hover:bg-navy-dark"
                    data-ocid="tanggapi.new.button"
                  >
                    Kirim Pengaduan Lagi
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input
                        id="nama"
                        placeholder="Masukkan nama lengkap"
                        value={form.nama}
                        onChange={(e) => handleChange("nama", e.target.value)}
                        data-ocid="tanggapi.nama.input"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="kontak">Kontak (No. HP / Email)</Label>
                      <Input
                        id="kontak"
                        placeholder="Masukkan kontak"
                        value={form.kontak}
                        onChange={(e) => handleChange("kontak", e.target.value)}
                        data-ocid="tanggapi.kontak.input"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="judul">Judul Pengaduan</Label>
                    <Input
                      id="judul"
                      placeholder="Ringkasan singkat pengaduan"
                      value={form.judul}
                      onChange={(e) => handleChange("judul", e.target.value)}
                      data-ocid="tanggapi.judul.input"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Topik Pengaduan</Label>
                    <Select
                      value={form.topik}
                      onValueChange={(v) => handleChange("topik", v)}
                    >
                      <SelectTrigger data-ocid="tanggapi.topik.select">
                        <SelectValue placeholder="Pilih topik pengaduan..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bencana">Bencana</SelectItem>
                        <SelectItem value="bantuan">Bantuan</SelectItem>
                        <SelectItem value="pengungsian">Pengungsian</SelectItem>
                        <SelectItem value="infrastruktur">
                          Infrastruktur
                        </SelectItem>
                        <SelectItem value="kesehatan">Kesehatan</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="deskripsi">Deskripsi Pengaduan</Label>
                    <Textarea
                      id="deskripsi"
                      placeholder="Jelaskan pengaduan Anda secara detail..."
                      rows={5}
                      value={form.deskripsi}
                      onChange={(e) =>
                        handleChange("deskripsi", e.target.value)
                      }
                      data-ocid="tanggapi.deskripsi.textarea"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-navy text-white hover:bg-navy-dark"
                    disabled={addMutation.isPending}
                    data-ocid="tanggapi.submit.button"
                  >
                    {addMutation.isPending ? (
                      "Mengirim..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Pengaduan
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Pengaduan */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">
                Pengaduan Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : publicPengaduan && publicPengaduan.length > 0 ? (
                publicPengaduan.slice(0, 5).map((p, idx) => (
                  <div
                    key={p.id.toString()}
                    className="border border-border rounded-lg p-3 text-sm"
                    data-ocid={`tanggapi.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-foreground line-clamp-1">
                        {p.judul}
                      </span>
                      <StatusPengaduanBadge status={p.status} />
                    </div>
                    <div className="text-muted-foreground text-xs mb-1">
                      <span className="font-medium">{p.nama}</span>
                      {" · "}
                      <span className="capitalize">
                        {topikLabels[p.topik] ?? p.topik}
                      </span>
                    </div>
                    <div className="text-muted-foreground/70 text-xs">
                      {formatDate(p.tanggal)}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-center py-6 text-muted-foreground text-sm"
                  data-ocid="tanggapi.list.empty_state"
                >
                  Belum ada pengaduan publik
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
