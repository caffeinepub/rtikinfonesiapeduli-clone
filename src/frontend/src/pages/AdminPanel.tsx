import {
  StatusBantuanBadge,
  StatusPengaduanBadge,
} from "@/components/shared/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddFooterLink,
  useAddPenerimaBantuan,
  useAddPengaduan,
  useAddPublikasi,
  useAddValidator,
  useDeleteFooterLink,
  useDeletePenerimaBantuan,
  useDeletePengaduan,
  useDeletePublikasi,
  useDeleteValidator,
  useGetAllFooterLinks,
  useGetAllPenerimaBantuan,
  useGetAllPengaduan,
  useGetAllPublikasi,
  useGetAllValidators,
  useSeedSampleData,
  useUpdateFooterLink,
  useUpdatePenerimaBantuan,
  useUpdatePengaduan,
  useUpdatePublikasi,
  useUpdateValidator,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  Database,
  Edit2,
  Link2,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Status, type Status__1, type Topik } from "../backend.d";
import type { T, T__1, T__2, T__3, T__4 } from "../backend.d";

type TabId =
  | "penerima"
  | "pengaduan"
  | "publikasi"
  | "footer"
  | "validator"
  | "laporan";

function formatCurrency(amount: bigint) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("penerima");

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("rtik_admin");
    if (!isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("rtik_admin");
    toast.success("Berhasil logout");
    navigate({ to: "/" });
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: "penerima",
      label: "Penerima Bantuan",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "pengaduan",
      label: "Pengaduan",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "publikasi",
      label: "Publikasi",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "footer",
      label: "Footer Links",
      icon: <Link2 className="w-4 h-4" />,
    },
    {
      id: "validator",
      label: "Validator",
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      id: "laporan",
      label: "Laporan",
      icon: <BarChart2 className="w-4 h-4" />,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
            <Shield className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-xs">
              RTIK Indonesia Peduli
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
          data-ocid="admin_panel.logout.button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-ocid={`admin_panel.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-white text-navy shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-white/60",
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "penerima" && <PenerimaTab />}
      {activeTab === "pengaduan" && <PengaduanTab />}
      {activeTab === "publikasi" && <PublikasiTab />}
      {activeTab === "footer" && <FooterLinksTab />}
      {activeTab === "validator" && <ValidatorTab />}
      {activeTab === "laporan" && <LaporanTab />}
    </main>
  );
}

// ─── Penerima Bantuan Tab ─────────────────────────────────────────────────────

function PenerimaTab() {
  const { data: penerima, isLoading } = useGetAllPenerimaBantuan();
  const addMutation = useAddPenerimaBantuan();
  const updateMutation = useUpdatePenerimaBantuan();
  const deleteMutation = useDeletePenerimaBantuan();

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<T__3 | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const defaultForm = {
    nama: "",
    alamat: "",
    wilayah: "",
    jenisBantuan: "Sembako",
    jumlahBantuan: "",
    keperluanBantuan: "",
    status: "menunggu" as Status__1,
    koordinatLat: "",
    koordinatLng: "",
    tanggal: new Date().toISOString().split("T")[0],
    catatan: "",
    sudahDivalidasi: false,
    validatorId: "",
  };
  const [form, setForm] = useState(defaultForm);

  const openAdd = () => {
    setEditItem(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (item: T__3) => {
    setEditItem(item);
    setForm({
      nama: item.nama,
      alamat: item.alamat,
      wilayah: item.wilayah,
      jenisBantuan: item.jenisBantuan,
      jumlahBantuan: item.jumlahBantuan.toString(),
      keperluanBantuan: item.keperluanBantuan,
      status: item.status,
      koordinatLat: item.koordinatLat?.toString() ?? "",
      koordinatLng: item.koordinatLng?.toString() ?? "",
      tanggal: item.tanggal,
      catatan: item.catatan,
      sudahDivalidasi: item.sudahDivalidasi,
      validatorId: item.validatorId ?? "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editItem?.id ?? BigInt(Date.now()),
      nama: form.nama,
      alamat: form.alamat,
      wilayah: form.wilayah,
      jenisBantuan: form.jenisBantuan,
      jumlahBantuan: BigInt(form.jumlahBantuan || "0"),
      keperluanBantuan: form.keperluanBantuan,
      status: form.status,
      koordinatLat: Number.parseFloat(form.koordinatLat || "0"),
      koordinatLng: Number.parseFloat(form.koordinatLng || "0"),
      tanggal: form.tanggal,
      catatan: form.catatan,
      sudahDivalidasi: form.sudahDivalidasi,
      validatorId: form.validatorId || undefined,
    };

    try {
      if (editItem) {
        await updateMutation.mutateAsync(payload);
        toast.success("Data penerima berhasil diperbarui");
      } else {
        await addMutation.mutateAsync(payload);
        toast.success("Data penerima berhasil ditambahkan");
      }
      setShowForm(false);
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Data berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus data");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">
          Manajemen Penerima Bantuan
        </h2>
        <Button
          size="sm"
          className="bg-navy text-white hover:bg-navy-dark gap-2"
          onClick={openAdd}
          data-ocid="admin_panel.penerima.add_button"
        >
          <Plus className="w-4 h-4" /> Tambah Data
        </Button>
      </div>

      <Card>
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
                      "Jenis",
                      "Jumlah",
                      "Status",
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
                  {penerima && penerima.length > 0 ? (
                    penerima.map((p, idx) => (
                      <tr
                        key={p.id.toString()}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`admin_panel.penerima.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">{p.nama}</td>
                        <td className="px-4 py-3">{p.wilayah}</td>
                        <td className="px-4 py-3">{p.jenisBantuan}</td>
                        <td className="px-4 py-3">
                          {formatCurrency(p.jumlahBantuan)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBantuanBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                              onClick={() => openEdit(p)}
                              data-ocid={`admin_panel.penerima.edit_button.${idx + 1}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => setDeleteId(p.id)}
                              data-ocid={`admin_panel.penerima.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-muted-foreground"
                        data-ocid="admin_panel.penerima.empty_state"
                      >
                        Belum ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin_panel.penerima.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editItem ? "Edit Penerima Bantuan" : "Tambah Penerima Bantuan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama" required>
                <Input
                  value={form.nama}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nama: e.target.value }))
                  }
                  placeholder="Nama lengkap"
                  required
                />
              </FormField>
              <FormField label="Wilayah" required>
                <Input
                  value={form.wilayah}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, wilayah: e.target.value }))
                  }
                  placeholder="Kab./Kota..."
                  required
                />
              </FormField>
            </div>
            <FormField label="Alamat">
              <Input
                value={form.alamat}
                onChange={(e) =>
                  setForm((p) => ({ ...p, alamat: e.target.value }))
                }
                placeholder="Alamat lengkap"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Jenis Bantuan" required>
                <Select
                  value={form.jenisBantuan}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, jenisBantuan: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Sembako",
                      "Pakaian",
                      "Obat-obatan",
                      "Uang Tunai",
                      "Peralatan",
                      "Lainnya",
                    ].map((j) => (
                      <SelectItem key={j} value={j}>
                        {j}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Jumlah Bantuan (Rp)">
                <Input
                  type="number"
                  value={form.jumlahBantuan}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, jumlahBantuan: e.target.value }))
                  }
                  placeholder="0"
                />
              </FormField>
            </div>
            <FormField label="Keperluan Bantuan">
              <Input
                value={form.keperluanBantuan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, keperluanBantuan: e.target.value }))
                }
                placeholder="Keperluan spesifik..."
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Status" required>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, status: v as Status__1 }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menunggu">Menunggu</SelectItem>
                    <SelectItem value="diproses">Diproses</SelectItem>
                    <SelectItem value="didistribusikan">
                      Didistribusikan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Tanggal">
                <Input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tanggal: e.target.value }))
                  }
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Koordinat Lat">
                <Input
                  type="number"
                  step="any"
                  value={form.koordinatLat}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, koordinatLat: e.target.value }))
                  }
                  placeholder="-6.9147"
                />
              </FormField>
              <FormField label="Koordinat Lng">
                <Input
                  type="number"
                  step="any"
                  value={form.koordinatLng}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, koordinatLng: e.target.value }))
                  }
                  placeholder="107.6098"
                />
              </FormField>
            </div>
            <FormField label="Catatan">
              <Textarea
                value={form.catatan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, catatan: e.target.value }))
                }
                placeholder="Catatan tambahan..."
                rows={2}
              />
            </FormField>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.sudahDivalidasi}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, sudahDivalidasi: v }))
                }
                data-ocid="admin_panel.penerima.validasi.switch"
              />
              <Label>Sudah Divalidasi</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                data-ocid="admin_panel.penerima.dialog.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-navy text-white hover:bg-navy-dark"
                disabled={addMutation.isPending || updateMutation.isPending}
                data-ocid="admin_panel.penerima.dialog.submit_button"
              >
                {addMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="admin_panel.penerima.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Penerima</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_panel.penerima.delete.cancel_button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              data-ocid="admin_panel.penerima.delete.confirm_button"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Pengaduan Tab ─────────────────────────────────────────────────────────────

function PengaduanTab() {
  const { data: pengaduan, isLoading } = useGetAllPengaduan();
  const addMutation = useAddPengaduan();
  const updateMutation = useUpdatePengaduan();
  const deleteMutation = useDeletePengaduan();

  const [showAdd, setShowAdd] = useState(false);
  const [editStatus, setEditStatus] = useState<T__2 | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const defaultForm = {
    nama: "",
    kontak: "",
    judul: "",
    topik: "bencana" as Topik,
    deskripsi: "",
    status: "baru" as Status,
    catatan: "",
    tanggal: new Date().toISOString().split("T")[0],
  };
  const [form, setForm] = useState(defaultForm);
  const [newStatus, setNewStatus] = useState<Status>(Status.baru);
  const [statusCatatan, setStatusCatatan] = useState("");

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMutation.mutateAsync({ id: BigInt(Date.now()), ...form });
      toast.success("Pengaduan ditambahkan");
      setShowAdd(false);
      setForm(defaultForm);
    } catch {
      toast.error("Gagal menambah pengaduan");
    }
  };

  const handleStatusUpdate = async () => {
    if (!editStatus) return;
    try {
      await updateMutation.mutateAsync({
        ...editStatus,
        status: newStatus,
        catatan: statusCatatan,
      });
      toast.success("Status diperbarui");
      setEditStatus(null);
    } catch {
      toast.error("Gagal memperbarui status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Pengaduan dihapus");
    } catch {
      toast.error("Gagal menghapus pengaduan");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">
          Manajemen Pengaduan
        </h2>
        <Button
          size="sm"
          className="bg-navy text-white hover:bg-navy-dark gap-2"
          onClick={() => setShowAdd(true)}
          data-ocid="admin_panel.pengaduan.add_button"
        >
          <Plus className="w-4 h-4" /> Tambah Pengaduan
        </Button>
      </div>

      <Card>
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
                      "Judul",
                      "Topik",
                      "Status",
                      "Tanggal",
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
                  {pengaduan && pengaduan.length > 0 ? (
                    pengaduan.map((p, idx) => (
                      <tr
                        key={p.id.toString()}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`admin_panel.pengaduan.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">{p.nama}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate">
                          {p.judul}
                        </td>
                        <td className="px-4 py-3 capitalize">{p.topik}</td>
                        <td className="px-4 py-3">
                          <StatusPengaduanBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.tanggal}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                              onClick={() => {
                                setEditStatus(p);
                                setNewStatus(p.status);
                                setStatusCatatan(p.catatan);
                              }}
                              data-ocid={`admin_panel.pengaduan.edit_button.${idx + 1}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => setDeleteId(p.id)}
                              data-ocid={`admin_panel.pengaduan.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-muted-foreground"
                        data-ocid="admin_panel.pengaduan.empty_state"
                      >
                        Belum ada pengaduan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent data-ocid="admin_panel.pengaduan.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Tambah Pengaduan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama">
                <Input
                  value={form.nama}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nama: e.target.value }))
                  }
                  placeholder="Nama pelapor"
                  required
                />
              </FormField>
              <FormField label="Kontak">
                <Input
                  value={form.kontak}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, kontak: e.target.value }))
                  }
                  placeholder="No. HP / email"
                  required
                />
              </FormField>
            </div>
            <FormField label="Judul">
              <Input
                value={form.judul}
                onChange={(e) =>
                  setForm((p) => ({ ...p, judul: e.target.value }))
                }
                placeholder="Judul pengaduan"
                required
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Topik">
                <Select
                  value={form.topik}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, topik: v as Topik }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "bencana",
                      "bantuan",
                      "pengungsian",
                      "infrastruktur",
                      "kesehatan",
                      "lainnya",
                    ].map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Status">
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, status: v as Status }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baru">Baru</SelectItem>
                    <SelectItem value="diproses">Diproses</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Deskripsi">
              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deskripsi: e.target.value }))
                }
                rows={3}
                placeholder="Deskripsi pengaduan..."
                required
              />
            </FormField>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdd(false)}
                data-ocid="admin_panel.pengaduan.add.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-navy text-white hover:bg-navy-dark"
                disabled={addMutation.isPending}
                data-ocid="admin_panel.pengaduan.add.submit_button"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog
        open={!!editStatus}
        onOpenChange={(open) => !open && setEditStatus(null)}
      >
        <DialogContent data-ocid="admin_panel.pengaduan.edit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Ubah Status Pengaduan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{editStatus?.judul}</p>
            <FormField label="Status">
              <Select
                value={newStatus}
                onValueChange={(v) => setNewStatus(v as Status)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baru">Baru</SelectItem>
                  <SelectItem value="diproses">Diproses</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Catatan">
              <Textarea
                value={statusCatatan}
                onChange={(e) => setStatusCatatan(e.target.value)}
                rows={2}
                placeholder="Catatan penanganan..."
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditStatus(null)}
              data-ocid="admin_panel.pengaduan.edit.cancel_button"
            >
              Batal
            </Button>
            <Button
              className="bg-navy text-white hover:bg-navy-dark"
              onClick={handleStatusUpdate}
              disabled={updateMutation.isPending}
              data-ocid="admin_panel.pengaduan.edit.save_button"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengaduan</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus pengaduan ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_panel.pengaduan.delete.cancel_button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              data-ocid="admin_panel.pengaduan.delete.confirm_button"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Publikasi Tab ────────────────────────────────────────────────────────────

function PublikasiTab() {
  const { data: publikasi, isLoading } = useGetAllPublikasi();
  const addMutation = useAddPublikasi();
  const updateMutation = useUpdatePublikasi();
  const deleteMutation = useDeletePublikasi();

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<T__1 | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const defaultForm = {
    judul: "",
    ringkasan: "",
    konten: "",
    kategori: "Berita",
    tanggal: new Date().toISOString().split("T")[0],
    gambarUrl: "",
    penulis: "",
  };
  const [form, setForm] = useState(defaultForm);

  const openAdd = () => {
    setEditItem(null);
    setForm(defaultForm);
    setShowForm(true);
  };
  const openEdit = (item: T__1) => {
    setEditItem(item);
    setForm({
      judul: item.judul,
      ringkasan: item.ringkasan,
      konten: item.konten,
      kategori: item.kategori,
      tanggal: item.tanggal,
      gambarUrl: item.gambarUrl,
      penulis: item.penulis,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { id: editItem?.id ?? BigInt(Date.now()), ...form };
    try {
      if (editItem) {
        await updateMutation.mutateAsync(payload);
        toast.success("Publikasi diperbarui");
      } else {
        await addMutation.mutateAsync(payload);
        toast.success("Publikasi ditambahkan");
      }
      setShowForm(false);
    } catch {
      toast.error("Gagal menyimpan publikasi");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Publikasi dihapus");
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">
          Manajemen Publikasi
        </h2>
        <Button
          size="sm"
          className="bg-navy text-white hover:bg-navy-dark gap-2"
          onClick={openAdd}
          data-ocid="admin_panel.publikasi.add_button"
        >
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </div>
      <Card>
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
                      "Judul",
                      "Kategori",
                      "Penulis",
                      "Tanggal",
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
                  {publikasi && publikasi.length > 0 ? (
                    publikasi.map((p, idx) => (
                      <tr
                        key={p.id.toString()}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`admin_panel.publikasi.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                          {p.judul}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {p.kategori}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{p.penulis}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.tanggal}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                              onClick={() => openEdit(p)}
                              data-ocid={`admin_panel.publikasi.edit_button.${idx + 1}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => setDeleteId(p.id)}
                              data-ocid={`admin_panel.publikasi.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-muted-foreground"
                        data-ocid="admin_panel.publikasi.empty_state"
                      >
                        Belum ada publikasi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin_panel.publikasi.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editItem ? "Edit Publikasi" : "Tambah Publikasi"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Judul">
              <Input
                value={form.judul}
                onChange={(e) =>
                  setForm((p) => ({ ...p, judul: e.target.value }))
                }
                placeholder="Judul artikel..."
                required
              />
            </FormField>
            <FormField label="Ringkasan">
              <Textarea
                value={form.ringkasan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, ringkasan: e.target.value }))
                }
                rows={2}
                placeholder="Ringkasan singkat..."
              />
            </FormField>
            <FormField label="Konten">
              <Textarea
                value={form.konten}
                onChange={(e) =>
                  setForm((p) => ({ ...p, konten: e.target.value }))
                }
                rows={5}
                placeholder="Konten artikel..."
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Kategori">
                <Select
                  value={form.kategori}
                  onValueChange={(v) => setForm((p) => ({ ...p, kategori: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Berita", "Bencana", "Bantuan", "Laporan", "Info"].map(
                      (k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Tanggal">
                <Input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tanggal: e.target.value }))
                  }
                />
              </FormField>
            </div>
            <FormField label="URL Gambar">
              <Input
                value={form.gambarUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, gambarUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </FormField>
            <FormField label="Penulis">
              <Input
                value={form.penulis}
                onChange={(e) =>
                  setForm((p) => ({ ...p, penulis: e.target.value }))
                }
                placeholder="Nama penulis..."
              />
            </FormField>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                data-ocid="admin_panel.publikasi.dialog.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-navy text-white hover:bg-navy-dark"
                disabled={addMutation.isPending || updateMutation.isPending}
                data-ocid="admin_panel.publikasi.dialog.submit_button"
              >
                {addMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Publikasi</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus publikasi ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_panel.publikasi.delete.cancel_button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              data-ocid="admin_panel.publikasi.delete.confirm_button"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Footer Links Tab ─────────────────────────────────────────────────────────

function FooterLinksTab() {
  const { data: links, isLoading } = useGetAllFooterLinks();
  const addMutation = useAddFooterLink();
  const updateMutation = useUpdateFooterLink();
  const deleteMutation = useDeleteFooterLink();

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<T__4 | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const defaultForm = { linkLabel: "", linkUrl: "", order: "1" };
  const [form, setForm] = useState(defaultForm);

  const openEdit = (item: T__4) => {
    setEditItem(item);
    setForm({
      linkLabel: item.linkLabel,
      linkUrl: item.linkUrl,
      order: item.order.toString(),
    });
    setShowForm(true);
  };
  const openAdd = () => {
    setEditItem(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editItem?.id ?? BigInt(Date.now()),
      linkLabel: form.linkLabel,
      linkUrl: form.linkUrl,
      order: BigInt(form.order || "0"),
    };
    try {
      if (editItem) {
        await updateMutation.mutateAsync(payload);
        toast.success("Link diperbarui");
      } else {
        await addMutation.mutateAsync(payload);
        toast.success("Link ditambahkan");
      }
      setShowForm(false);
    } catch {
      toast.error("Gagal menyimpan");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Link dihapus");
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">
          Manajemen Footer Links
        </h2>
        <Button
          size="sm"
          className="bg-navy text-white hover:bg-navy-dark gap-2"
          onClick={openAdd}
          data-ocid="admin_panel.footer.add_button"
        >
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {["No", "Label", "URL", "Order", "Aksi"].map((h) => (
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
                  {links && links.length > 0 ? (
                    links.map((l, idx) => (
                      <tr
                        key={l.id.toString()}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`admin_panel.footer.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">{l.linkLabel}</td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                          {l.linkUrl}
                        </td>
                        <td className="px-4 py-3">{l.order.toString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                              onClick={() => openEdit(l)}
                              data-ocid={`admin_panel.footer.edit_button.${idx + 1}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => setDeleteId(l.id)}
                              data-ocid={`admin_panel.footer.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-muted-foreground"
                        data-ocid="admin_panel.footer.empty_state"
                      >
                        Belum ada footer link
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent data-ocid="admin_panel.footer.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editItem ? "Edit Footer Link" : "Tambah Footer Link"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Label Link">
              <Input
                value={form.linkLabel}
                onChange={(e) =>
                  setForm((p) => ({ ...p, linkLabel: e.target.value }))
                }
                placeholder="Nama mitra..."
                required
              />
            </FormField>
            <FormField label="URL">
              <Input
                value={form.linkUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, linkUrl: e.target.value }))
                }
                placeholder="https://..."
                required
              />
            </FormField>
            <FormField label="Urutan">
              <Input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({ ...p, order: e.target.value }))
                }
                placeholder="1"
              />
            </FormField>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                data-ocid="admin_panel.footer.dialog.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-navy text-white hover:bg-navy-dark"
                disabled={addMutation.isPending || updateMutation.isPending}
                data-ocid="admin_panel.footer.dialog.submit_button"
              >
                {addMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Link</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus footer link ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_panel.footer.delete.cancel_button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              data-ocid="admin_panel.footer.delete.confirm_button"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Validator Tab ─────────────────────────────────────────────────────────────

function ValidatorTab() {
  const { data: validators, isLoading } = useGetAllValidators();
  const addMutation = useAddValidator();
  const updateMutation = useUpdateValidator();
  const deleteMutation = useDeleteValidator();

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const defaultForm = { nama: "", email: "", wilayah: "", aktif: true };
  const [form, setForm] = useState(defaultForm);

  const openEdit = (item: T) => {
    setEditItem(item);
    setForm({
      nama: item.nama,
      email: item.email,
      wilayah: item.wilayah,
      aktif: item.aktif,
    });
    setShowForm(true);
  };
  const openAdd = () => {
    setEditItem(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { id: editItem?.id ?? BigInt(Date.now()), ...form };
    try {
      if (editItem) {
        await updateMutation.mutateAsync(payload);
        toast.success("Validator diperbarui");
      } else {
        await addMutation.mutateAsync(payload);
        toast.success("Validator ditambahkan");
      }
      setShowForm(false);
    } catch {
      toast.error("Gagal menyimpan");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Validator dihapus");
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">
          Manajemen Validator
        </h2>
        <Button
          size="sm"
          className="bg-navy text-white hover:bg-navy-dark gap-2"
          onClick={openAdd}
          data-ocid="admin_panel.validator.add_button"
        >
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </div>
      <Card>
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
                    {["No", "Nama", "Email", "Wilayah", "Status", "Aksi"].map(
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
                  {validators && validators.length > 0 ? (
                    validators.map((v, idx) => (
                      <tr
                        key={v.id.toString()}
                        className="border-b border-border/50 table-row-hover"
                        data-ocid={`admin_panel.validator.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">{v.nama}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {v.email}
                        </td>
                        <td className="px-4 py-3">{v.wilayah}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                              v.aktif
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600",
                            )}
                          >
                            {v.aktif ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                              onClick={() => openEdit(v)}
                              data-ocid={`admin_panel.validator.edit_button.${idx + 1}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => setDeleteId(v.id)}
                              data-ocid={`admin_panel.validator.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-muted-foreground"
                        data-ocid="admin_panel.validator.empty_state"
                      >
                        Belum ada validator
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent data-ocid="admin_panel.validator.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editItem ? "Edit Validator" : "Tambah Validator"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Nama">
              <Input
                value={form.nama}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nama: e.target.value }))
                }
                placeholder="Nama validator..."
                required
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="email@example.com"
                required
              />
            </FormField>
            <FormField label="Wilayah">
              <Input
                value={form.wilayah}
                onChange={(e) =>
                  setForm((p) => ({ ...p, wilayah: e.target.value }))
                }
                placeholder="Wilayah tugas..."
              />
            </FormField>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.aktif}
                onCheckedChange={(v) => setForm((p) => ({ ...p, aktif: v }))}
                data-ocid="admin_panel.validator.aktif.switch"
              />
              <Label>Aktif</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                data-ocid="admin_panel.validator.dialog.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-navy text-white hover:bg-navy-dark"
                disabled={addMutation.isPending || updateMutation.isPending}
                data-ocid="admin_panel.validator.dialog.submit_button"
              >
                {addMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Validator</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus validator ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_panel.validator.delete.cancel_button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              data-ocid="admin_panel.validator.delete.confirm_button"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Laporan Tab ──────────────────────────────────────────────────────────────

function LaporanTab() {
  const { data: penerima } = useGetAllPenerimaBantuan();
  const { data: pengaduan } = useGetAllPengaduan();
  const { data: publikasi } = useGetAllPublikasi();
  const { data: validators } = useGetAllValidators();
  const seedMutation = useSeedSampleData();

  const handleSeed = async () => {
    try {
      await seedMutation.mutateAsync();
      toast.success("Data sample berhasil dimuat!");
    } catch {
      toast.error("Gagal memuat data sample");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display font-semibold text-lg">Laporan & Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Penerima Bantuan",
            value: penerima?.length ?? 0,
            color: "text-navy",
          },
          {
            label: "Pengaduan",
            value: pengaduan?.length ?? 0,
            color: "text-blue-600",
          },
          {
            label: "Publikasi",
            value: publikasi?.length ?? 0,
            color: "text-gold",
          },
          {
            label: "Validator",
            value: validators?.length ?? 0,
            color: "text-green-600",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={cn("text-3xl font-display font-bold", stat.color)}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seed data */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Database className="w-4 h-4" /> Data Sample
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Muat data sample untuk pengujian dan demonstrasi sistem. Ini akan
            menambahkan data penerima bantuan, pengaduan, publikasi, dan
            validator contoh.
          </p>
          <Button
            onClick={handleSeed}
            disabled={seedMutation.isPending}
            className="bg-navy text-white hover:bg-navy-dark"
            data-ocid="admin_panel.laporan.seed.button"
          >
            {seedMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Memuat...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" /> Muat Data Sample
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function FormField({
  label,
  children,
  required,
}: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}
