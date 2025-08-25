// features/exchange-history/ui/exchange-history.tsx
import { Table, TableColumn, TableEmptyState } from "@/shared/ui/table";
import { Exchange, ExchangeStatus } from "@/entities/exchange";
import { StatusBadge } from "@/shared/ui/status-bedge";
import { Avatar } from "@/shared/ui/avatar";
import { formatPrice } from "@/shared/lib/utils";

interface ExchangeHistoryProps {
  exchanges: Exchange[];
  className?: string;
}

export function ExchangeHistory({
  exchanges,
  className,
}: ExchangeHistoryProps) {
  // Конфигурация колонок для таблицы
  const columns: TableColumn[] = [
    {
      key: "nickname",
      title: "Nickname",
      width: "w-[35%]",
      render: (nickname: string, record: Exchange) => (
        <div className="flex items-center gap-3 pr-4">
          <Avatar className="size-8" src={record.avatar} name={nickname} />
          <span className="truncate font-medium text-white">{nickname}</span>
        </div>
      ),
    },
    {
      key: "date",
      title: "Date",
      width: "w-[20%]",
      render: (date: string) => (
        <span className="font-mono text-sm text-gray-300">{date}</span>
      ),
    },
    {
      key: "amount",
      title: "Exchange amount",
      width: "w-[25%]",
      render: (amount: number) => (
        <span className="font-semibold text-white">{formatPrice(amount)}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      width: "w-[20%]",
      render: (status: ExchangeStatus) => (
        <span className="space-x-3">
          <StatusBadge status={status} />
          {/* <StatusBadge status={status} /> */}
        </span>
      ),
    },
  ];

  // Пустое состояние
  const emptyState = (
    <TableEmptyState
      title="No exchanges yet"
      description="Your exchange history will appear here"
    />
  );

  return (
    <div className={className}>
      <Table columns={columns} data={exchanges} emptyState={emptyState} />
    </div>
  );
}
