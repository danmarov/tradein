export type ExchangeStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "expired";

export interface Exchange {
  id: string;
  nickname: string;
  date: string;
  amount: number;
  status: ExchangeStatus;
  avatar: string;
}
