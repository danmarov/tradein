import type {
  BaseEntity,
  PaginationParams,
  PaginationResponse,
  SortOrder,
} from "@/entities/shared/model";

export interface Item extends BaseEntity {
  steam_item_id: string;
  name: string;
  type: string;
  rarity: string;
  image: string;
  price: number;
  market_hash_name: string;
  exterior: string;
  stattrak: boolean;
  tradeable: boolean;
  marketable: boolean;
}

export interface ItemBrief {
  id: string;
  name: string;
  image: string;
  price: number;
  steam_item_id?: string;
}

export type ItemType =
  | "rifle"
  | "pistol"
  | "sniper"
  | "smg"
  | "shotgun"
  | "machinegun"
  | "knife"
  | "gloves"
  | "sticker"
  | "case"
  | "key";

export type ItemRarity =
  | "Consumer Grade"
  | "Industrial Grade"
  | "Mil-Spec"
  | "Restricted"
  | "Classified"
  | "Covert"
  | "Contraband"
  | "Extraordinary";

export type ItemExterior =
  | "Factory New"
  | "Minimal Wear"
  | "Field-Tested"
  | "Well-Worn"
  | "Battle-Scarred";

export type ItemSortType =
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

export interface InventoryParams extends PaginationParams {
  search?: string;
  rarity?: ItemRarity;
  type?: ItemType;
  sort?: ItemSortType;
  exterior?: ItemExterior;
  stattrak?: boolean;
  tradeable?: boolean;
  min_price?: number;
  max_price?: number;
}

export interface InventoryResponse {
  items: Item[];
  pagination: PaginationResponse;
}

export interface InventoryFilters {
  search: string;
  rarity: ItemRarity | "all";
  type: ItemType | "all";
  exterior: ItemExterior | "all";
  stattrak: boolean | null;
  tradeable: boolean | null;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface ItemStats {
  total_items: number;
  average_price: number;
  price_trend: "up" | "down" | "stable";
  last_sale_price?: number;
  last_sale_date?: string;
}
