import { cn } from "@/lib/utils";

type StatusBantuan = "menunggu" | "diproses" | "didistribusikan";
type StatusPengaduan = "baru" | "diproses" | "selesai";

interface StatusBantuanBadgeProps {
  status: StatusBantuan;
  className?: string;
}

interface StatusPengaduanBadgeProps {
  status: StatusPengaduan;
  className?: string;
}

export function StatusBantuanBadge({
  status,
  className,
}: StatusBantuanBadgeProps) {
  const config: Record<StatusBantuan, { label: string; className: string }> = {
    menunggu: {
      label: "Menunggu",
      className: "bg-amber-100 text-amber-800 border border-amber-200",
    },
    diproses: {
      label: "Diproses",
      className: "bg-blue-100 text-blue-800 border border-blue-200",
    },
    didistribusikan: {
      label: "Didistribusikan",
      className: "bg-green-100 text-green-800 border border-green-200",
    },
  };

  const item = config[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        item.className,
        className,
      )}
    >
      {item.label}
    </span>
  );
}

export function StatusPengaduanBadge({
  status,
  className,
}: StatusPengaduanBadgeProps) {
  const config: Record<StatusPengaduan, { label: string; className: string }> =
    {
      baru: {
        label: "Baru",
        className: "bg-blue-100 text-blue-800 border border-blue-200",
      },
      diproses: {
        label: "Diproses",
        className: "bg-amber-100 text-amber-800 border border-amber-200",
      },
      selesai: {
        label: "Selesai",
        className: "bg-green-100 text-green-800 border border-green-200",
      },
    };

  const item = config[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        item.className,
        className,
      )}
    >
      {item.label}
    </span>
  );
}
