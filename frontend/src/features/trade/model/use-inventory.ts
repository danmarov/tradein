import { useQuery } from "@tanstack/react-query";
import type { InventoryResponse } from "@/entities/item/model";
import { TRADE_CONFIG } from "@/features/trade/config";

async function fetchInventory(
  userId: string,
  page: number,
  search?: string,
): Promise<InventoryResponse> {
  const params = new URLSearchParams({
    limit: TRADE_CONFIG.ITEMS_PER_PAGE.toString(),
    page: page.toString(),
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const response = await fetch(`/api/inventory/${userId}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch inventory: ${response.statusText}`);
  }

  return response.json();
}

export function useInventory(
  userId: string,
  page: number,
  search: string = "",
  initialData?: InventoryResponse,
) {
  return useQuery({
    queryKey: ["inventory", userId, page, search],
    queryFn: () => fetchInventory(userId, page, search),
    initialData: page === 1 && !search ? initialData : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
