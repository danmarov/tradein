import TradeCreator from "@/widgets/trade/trade-creator";

import React from "react";
interface TradePageProps {
  params: {
    recipientId: string;
  };
}
export default function TradePage({ params: { recipientId } }: TradePageProps) {
  return (
    <>
      <TradeCreator />
    </>
  );
}
