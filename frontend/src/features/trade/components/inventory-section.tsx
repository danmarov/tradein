"use client";
import { useInventory } from "@/features/trade/model/use-inventory";
import { useInventoryContext } from "@/features/trade/context/inventory-context";
import {
  InventoryGrid,
  InventoryPagination,
  InventorySearch,
  SelectedItemsPreview,
} from "@/features/trade";
import type { InventoryResponse } from "@/entities/item/model";

interface InventorySectionProps {
  userId: string;
  userType: "current" | "target";
  initialInventory: InventoryResponse;
  user: {
    avatar: string;
    fallbackName: string;
    name: string;
    online?: boolean;
  };
}

export function InventorySection({
  userId,
  userType,
  initialInventory,
  user,
}: InventorySectionProps) {
  const {
    currentUserPage,
    targetUserPage,
    currentUserSearch,
    targetUserSearch,
  } = useInventoryContext();

  const page = userType === "current" ? currentUserPage : targetUserPage;
  const search = userType === "current" ? currentUserSearch : targetUserSearch;

  const { data: inventory, isLoading } = useInventory(
    userId,
    page,
    search,
    initialInventory,
  );

  return (
    <>
      <SelectedItemsPreview
        defaultOpen={false}
        user={user}
        userType={userType}
      />
      <InventorySearch userType={userType} userId={userId} />
      <InventoryGrid
        initialInventory={inventory || initialInventory}
        isLoading={isLoading}
        userType={userType}
      />
      <InventoryPagination
        userType={userType}
        currentPage={page}
        totalPages={inventory?.pagination.pages || 1}
      />
    </>
  );
}
