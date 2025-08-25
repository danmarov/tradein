import type { InventoryResponse } from "@/entities/item/model";

export interface UserTradeInfo {
  userId: string;
  username: string;
  avatar: string;
  inventory: InventoryResponse;
  online?: boolean;
  stats?: {
    total_trades: number;
    successful_trades: number;
    items_count: number;
  };
}

export interface TradeData {
  currentUserInventory: InventoryResponse;
  targetUser?: UserTradeInfo;
  canTrade: boolean;
  error?:
    | "TARGET_USER_NOT_FOUND"
    | "NETWORK_ERROR"
    | "INSUFFICIENT_PERMISSIONS"
    | "SELF_TRADE_NOT_ALLOWED"
    | "UNAUTHORIZED";
}

export type TradeError = TradeData["error"];
