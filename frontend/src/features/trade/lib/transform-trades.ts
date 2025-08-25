// /features/trade/lib/transform-trades.ts
import type { Trade } from "@/features/trade/actions/get-trades";
import type { Exchange, ExchangeStatus } from "@/entities/exchange";

export function transformTradesToExchanges(
  trades: Trade[],
  currentUserId: string,
): Exchange[] {
  return trades.map((trade) => {
    const isCurrentUserSender = trade.sender.id === currentUserId;
    const otherUser = isCurrentUserSender ? trade.recipient : trade.sender;

    return {
      id: trade.id,
      avatar: otherUser.avatar,
      nickname: otherUser.username,
      date: new Date(trade.created_at).toISOString().split("T")[0],
      amount: isCurrentUserSender
        ? trade.total_value_give
        : trade.total_value_receive,
      status: trade.status as ExchangeStatus,
    };
  });
}
