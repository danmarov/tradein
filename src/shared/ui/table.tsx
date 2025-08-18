import { cn } from "@/shared/lib/utils";
import React from "react";

// Типы для таблицы
export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  className?: string;
  emptyState?: React.ReactNode;
}

// Основной компонент Table
export function Table({ columns, data, className, emptyState }: TableProps) {
  if (data.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full table-fixed">
        {/* Настройка ширины колонок */}
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} className={column.width || "w-auto"} />
          ))}
        </colgroup>

        {/* Заголовки */}
        <thead>
          <tr className="border-b border-gray-700/50 text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                className="pb-4 text-sm font-medium text-gray-400"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        {/* Данные */}
        <tbody>
          {data.map((record, index) => (
            <tr
              key={record.id || index}
              className={cn(
                "border-b border-gray-700/30 transition-colors hover:bg-gray-800/20",
                index === data.length - 1 && "border-b-0",
              )}
            >
              {columns.map((column) => (
                <td key={column.key} className="py-4">
                  {column.render
                    ? column.render(record[column.key], record, index)
                    : record[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Вспомогательные компоненты для более удобного использования
export const TableEmptyState = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <div className="py-8 text-center">
    <div className="mb-1 text-base text-gray-400">{title}</div>
    {description && <div className="text-sm text-gray-500">{description}</div>}
  </div>
);
