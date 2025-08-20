import type {
  BaseEntity,
  PaginationParams,
  PaginationResponse,
} from "@/entities/shared/model";
import type { UserBrief } from "@/entities/user/model";
import type { ItemBrief } from "@/entities/item/model";

export type TradeStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "expired";

export interface TradeItem extends ItemBrief {
  steam_item_id?: string;
}

export interface Trade extends BaseEntity {
  sender_id: string;
  recipient_id: string;
  status: TradeStatus;
  items_to_give: TradeItem[];
  items_to_receive: TradeItem[];
  total_value_give: number;
  total_value_receive: number;
  message: string;
  expires_at: string;
}

export interface TradeWithUsers
  extends Omit<Trade, "sender_id" | "recipient_id"> {
  sender: UserBrief;
  recipient: UserBrief;
}

export interface TradeBrief {
  id: string;
  sender: UserBrief;
  recipient: UserBrief;
  status: TradeStatus;
  total_value_give: number;
  total_value_receive: number;
  created_at: string;
  expires_at: string;
}

export interface CreateTradeRequest {
  recipient_id: string;
  items_to_give: string[];
  items_to_receive: string[];
  message?: string;
}

export interface TradeListParams extends PaginationParams {
  type?: "sent" | "received" | "all";
  status?: TradeStatus;
}

export interface TradeListResponse {
  trades: TradeWithUsers[];
  pagination: PaginationResponse;
}

export interface TradeActionResponse {
  success: boolean;
  message: string;
}

export interface DeclineTradeRequest {
  reason?: string;
}

export type TradeAction = "accept" | "decline" | "cancel";

export interface TradeFilters {
  type: "sent" | "received" | "all";
  status: TradeStatus | "all";
  dateRange?: {
    from: string;
    to: string;
  };
  minValue?: number;
  maxValue?: number;
}

export interface TradeStats {
  total_trades: number;
  pending_trades: number;
  completed_trades: number;
  success_rate: number;
  total_volume: number;
}

export interface TradeNotification {
  type: "trade_offer_received" | "trade_offer_updated";
  trade_id: string;
  trade: TradeWithUsers;
  timestamp: string;
}
