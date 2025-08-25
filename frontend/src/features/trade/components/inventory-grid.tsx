import React from "react";
import InventoryItem from "./inventory-item";
import type { InventoryResponse, Item } from "@/entities/item/model";
import { cn } from "@sglara/cn";

interface InventoryGridProps {
  initialInventory: InventoryResponse;
  minSlots?: number;
  columns?: number;
  isLoading?: boolean;
  userType: "current" | "target"; // 👈 Добавляем обязательный проп
}

export default function InventoryGrid({
  initialInventory,
  minSlots = 15,
  columns = 5,
  isLoading = false,
  userType, // 👈 Получаем тип пользователя
}: InventoryGridProps) {
  // Если загружается - показываем скелетон
  if (isLoading) {
    return (
      <div className="mt-1">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {Array.from({ length: minSlots }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className={cn(
                "aspect-[181.52/212.331] w-full rounded-sm border border-dashed border-gray-600/50 bg-[#1C1D27]/30 opacity-60",
                //  className,
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  // Обычная отрисовка данных
  const slotsData = Array.from({ length: minSlots }, (_, index) => {
    const item = initialInventory.items[index];
    return item || null;
  });

  return (
    <div className="mt-1">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {slotsData.map((item, index) => (
          <InventoryItem
            key={index}
            item={item}
            isEmpty={!item}
            userType={userType} // 👈 Передаем тип пользователя
          />
        ))}
      </div>
    </div>
  );
}
