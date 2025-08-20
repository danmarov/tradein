import { ExchangeStatus } from "@/entities/exchange";
import { cn } from "@/shared/lib/utils";

interface StatusBadgeProps {
  status: ExchangeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: ExchangeStatus): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "border-orange-400 bg-orange-400/10 text-orange-400";
      case "accepted":
        return "border-green-400 bg-green-400/10 text-green-400";
      case "rejected":
        return "border-red-400 bg-red-400/10 text-red-400";
      default:
        return "border-gray-400 bg-gray-400/10 text-gray-400";
    }
  };

  return (
    <span
      className={cn(
        "inline-block min-w-[90px] rounded-sm border px-3 py-1 text-center text-sm font-medium",
        getStatusStyles(status),
        className,
      )}
    >
      {status}
    </span>
  );
}
