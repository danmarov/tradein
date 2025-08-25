import React from "react";
import type { Item } from "@/entities/item/model";
import { cn } from "@sglara/cn";
import Image from "next/image";
import { formatPrice } from "@/shared/lib/utils";
import { useInventoryContext } from "@/features/trade/context/inventory-context";
import { ShoppingCart } from "lucide-react";

interface InventoryItemProps {
  item?: Item | null;
  isEmpty?: boolean;
  className?: string;
  userType?: "current" | "target"; // 👈 Добавляем тип пользователя
}

export default function InventoryItem({
  item,
  isEmpty = false,
  className,
  userType,
}: InventoryItemProps) {
  const {
    toggleCurrentUserItem,
    toggleTargetUserItem,
    isCurrentUserItemSelected,
    isTargetUserItemSelected,
  } = useInventoryContext();

  if (isEmpty || !item || !userType) {
    return (
      <div
        className={cn(
          "aspect-[181.52/212.331] w-full rounded-sm border border-dashed border-gray-600/50 bg-[#1C1D27]/30 opacity-60",
          className,
        )}
      />
    );
  }

  const isSelected =
    userType === "current"
      ? isCurrentUserItemSelected(item.id)
      : isTargetUserItemSelected(item.id);

  const handleClick = () => {
    if (userType === "current") {
      toggleCurrentUserItem(item);
    } else {
      toggleTargetUserItem(item);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative aspect-[181.52/212.331] w-full cursor-pointer rounded-sm bg-[#1C1D27] transition-colors hover:bg-[#1e1f29]",
        isSelected && "bg-[#16181f] hover:bg-[#16181f]", // 👈 Стили для выбранного товара
        className,
      )}
    >
      <div className="relative mx-5 mt-6 aspect-square">
        <Image src={item.image} alt={item.name} fill={true} />
      </div>
      <div className="mx-5">
        <p className="text-muted text-xs font-bold leading-3">
          {item.exterior}
        </p>
        <p className="text-base font-bold leading-5">
          {formatPrice(item.price)}
        </p>
      </div>
      {isSelected && (
        <span className="-translate-1/2 absolute left-1/2 top-1/2 grid h-12 w-11 place-items-center rounded-sm bg-black/90 text-white">
          <ShoppingCart />
        </span>
      )}
    </div>
  );
}
