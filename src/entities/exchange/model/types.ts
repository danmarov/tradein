export type ExchangeStatus = "Pending" | "Accepted" | "Rejected";

export interface Exchange {
  id: number;
  nickname: string;
  date: string;
  amount: number;
  status: ExchangeStatus;
}
