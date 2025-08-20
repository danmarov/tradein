import TradeCreator from "@/widgets/trade/trade-creator";
import React from "react";

interface TradePageProps {
  params: Promise<{
    recipientId: string;
  }>;
}

export default async function TradePage({ params }: TradePageProps) {
  const { recipientId } = await params;

  return (
    <>
      <TradeCreator />
    </>
  );
}
