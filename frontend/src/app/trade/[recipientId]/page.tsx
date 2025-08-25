import { getServerAuth } from "@/features/auth/server";
import { getTradeData } from "@/features/trade/server";
import AuthRequiredModal from "@/widgets/sections/auth-required-modal";
import TradeCreator from "@/widgets/trade/trade-creator";
import React from "react";

interface TradePageProps {
  params: Promise<{
    recipientId: string;
  }>;
}

export default async function TradePage({ params }: TradePageProps) {
  const { recipientId } = await params;
  const authData = await getServerAuth();

  if (!authData.isAuthenticated || !authData.user) {
    return <AuthRequiredModal />;
  }
  const tradeData = await getTradeData(authData.user?.id, recipientId);
  return <TradeCreator currentUser={authData.user} tradeData={tradeData} />;
}
