import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllPublikasi } from "@/hooks/useQueries";
import { BookOpen, Calendar, Tag, User, X } from "lucide-react";
import { useState } from "react";
import type { T__2 } from "../backend.d";

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

const KATEGORI_COLORS: Record<string, string> = {
  Bencana: "bg-red-100 text-red-700",
  Bantuan: "bg-blue-100 text-blue-700",
  Laporan: "bg-purple-100 text-purple-700",
  Berita: "bg-green-100 text-green-700",
  Info: "bg-amber-100 text-amber-700",
};

export default function Publikasi() {
  const { data: publikasi, isLoading } = useGetAllPublikasi();
  const [selectedItem, setSelectedItem] = useState<T__2 | null>(null);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Publikasi</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Publikasi & Berita
        </h1>
        <p className="text-muted-foreground mt-2">
          Informasi terkini seputar kegiatan RTIK Indonesia Peduli, laporan
          bencana, dan distribusi bantuan.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full rounded-t-lg rounded-b-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : publikasi && publikasi.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publikasi.map((item, idx) => (
            <PublikasiCard
              key={item.id.toString()}
              item={item}
              index={idx + 1}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="publikasi.list.empty_state"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Belum ada publikasi</p>
          <p className="text-sm mt-1">Konten akan segera tersedia</p>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="publikasi.dialog"
        >
          <DialogHeader>
            <div className="flex items-start gap-3 mb-2">
              {selectedItem?.kategori && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    KATEGORI_COLORS[selectedItem.kategori] ??
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {selectedItem.kategori}
                </span>
              )}
            </div>
            <DialogTitle className="font-display text-xl leading-tight text-left">
              {selectedItem?.judul}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
              {selectedItem?.penulis && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {selectedItem.penulis}
                </span>
              )}
              {selectedItem?.tanggal && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(selectedItem.tanggal)}
                </span>
              )}
            </div>
          </DialogHeader>

          {selectedItem?.gambarUrl && (
            <div className="rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center mb-2">
              <img
                src={selectedItem.gambarUrl}
                alt={selectedItem.judul}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="prose prose-sm max-w-none text-foreground">
            <p className="text-muted-foreground italic mb-4">
              {selectedItem?.ringkasan}
            </p>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedItem?.konten}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedItem(null)}
              data-ocid="publikasi.dialog.close_button"
            >
              <X className="w-3 h-3 mr-1" />
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

interface PublikasiCardProps {
  item: T__2;
  index: number;
  onClick: () => void;
}

function PublikasiCard({ item, index, onClick }: PublikasiCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
      onClick={onClick}
      data-ocid={`publikasi.item.${index}`}
    >
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-navy/10 to-teal/10 flex items-center justify-center overflow-hidden">
        {item.gambarUrl ? (
          <img
            src={item.gambarUrl}
            alt={item.judul}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.classList.add(
                "bg-muted",
              );
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <BookOpen className="w-10 h-10 text-navy/30" />
        )}
      </div>

      <CardContent className="p-4">
        {/* Category */}
        {item.kategori && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-2 ${
              KATEGORI_COLORS[item.kategori] ?? "bg-muted text-muted-foreground"
            }`}
          >
            <Tag className="inline w-2.5 h-2.5 mr-1" />
            {item.kategori}
          </span>
        )}

        <h3 className="font-display font-semibold text-foreground text-sm leading-tight mb-2 line-clamp-2 group-hover:text-navy transition-colors">
          {item.judul}
        </h3>

        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3">
          {item.ringkasan}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground/70">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {item.penulis}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(item.tanggal)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
