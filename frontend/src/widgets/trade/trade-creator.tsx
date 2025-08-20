import {
  InventoryGrid,
  InventoryPagination,
  InventorySearch,
  SelectedItemsPreview,
} from "@/features/trade";
import React from "react";

export default function TradeCreator() {
  return (
    <div className="flex size-full items-start p-6 pt-0">
      <div className="w-[calc(50%_-_12px)]">
        <SelectedItemsPreview defaultOpen={false} />
        <InventorySearch />
        <InventoryGrid />
        <InventoryPagination />
      </div>
      <div className="ml-auto w-[calc(50%_-_12px)]">
        <SelectedItemsPreview defaultOpen={false} />
        <InventorySearch />
        <InventoryGrid />
        <InventoryPagination />
      </div>
    </div>
  );
}
