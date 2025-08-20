import type {
  BaseEntity,
  PaginationParams,
  PaginationResponse,
} from "@/entities/shared/model";

export type TransactionType =
  | "deposit"
  | "withdraw"
  | "trade"
  | "bonus"
  | "refund";

export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type PaymentMethod =
  | "card"
  | "crypto"
  | "steam"
  | "paypal"
  | "qiwi"
  | "yoomoney";

export interface Transaction extends BaseEntity {
  user_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method?: PaymentMethod;
  description: string;
  reference_id?: string;
  trade_id?: string;
}

export interface TransactionBrief {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  created_at: string;
}

export interface Balance {
  balance: number;
  currency: string;
  pending_amount?: number;
}

export interface DepositRequest {
  amount: number;
  payment_method: PaymentMethod;
  currency: string;
  return_url?: string;
}

export interface DepositResponse {
  id: string;
  amount: number;
  currency: string;
  payment_url: string;
  status: TransactionStatus;
  expires_at?: string;
  created_at: string;
}

export interface PaymentDetails {
  card_number?: string;
  card_holder?: string;
  crypto_address?: string;
  crypto_network?: string;
  paypal_email?: string;
  qiwi_phone?: string;
  yoomoney_account?: string;
}

export interface WithdrawRequest {
  amount: number;
  payment_method: PaymentMethod;
  payment_details: PaymentDetails;
  currency?: string;
}

export interface WithdrawResponse {
  id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  estimated_completion?: string;
  created_at: string;
}

export interface TransactionListParams extends PaginationParams {
  type?: TransactionType;
  status?: TransactionStatus;
  payment_method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: PaginationResponse;
}

export interface TransactionFilters {
  type: TransactionType | "all";
  status: TransactionStatus | "all";
  payment_method: PaymentMethod | "all";
  dateRange?: {
    from: string;
    to: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface TransactionStats {
  total_deposited: number;
  total_withdrawn: number;
  pending_amount: number;
  transactions_count: number;
  success_rate: number;
}

export interface PaymentMethodInfo {
  method: PaymentMethod;
  name: string;
  fee_percent: number;
  min_amount: number;
  max_amount: number;
  processing_time: string;
  available_for: ("deposit" | "withdraw")[];
}

export interface TransactionNotification {
  type: "transaction_completed" | "transaction_failed" | "balance_updated";
  transaction_id: string;
  transaction: Transaction;
  new_balance?: number;
  timestamp: string;
}
