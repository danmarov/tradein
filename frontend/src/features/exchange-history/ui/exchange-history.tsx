// features/exchange-history/ui/exchange-history.tsx
import { Table, TableColumn, TableEmptyState } from "@/shared/ui/table";
import { Exchange, ExchangeStatus } from "@/entities/exchange";
import { StatusBadge } from "@/shared/ui/status-bedge";

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
      render: (nickname: string) => (
        <div className="flex items-center gap-3 pr-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-600 text-sm font-medium text-white">
            {nickname.charAt(0)}
          </div>
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
        <span className="font-semibold text-white">
          $
          {amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      width: "w-[20%]",
      render: (status: ExchangeStatus) => <StatusBadge status={status} />,
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
