import { ExchangeHistory } from "@/features/exchange-history";
import { SendExchangeOffer } from "@/features/send-exchange-offer";
import { getTrades } from "@/features/trade/actions/get-trades";
import { transformTradesToExchanges } from "@/features/trade/lib";
import { getServerAuth } from "@/features/auth/server";
import AuthRequiredModal from "@/widgets/sections/auth-required-modal";

export default async function P2PPage() {
  const authData = await getServerAuth();

  if (!authData.isAuthenticated || !authData.user) {
    return <AuthRequiredModal />;
  }

  try {
    const tradesData = await getTrades({ type: "all" });
    const exchanges = transformTradesToExchanges(
      tradesData.trades,
      authData.user.id,
    );

    return (
      <div className="main-content">
        <div className="container">
          <div className="flex items-center gap-4">
            <div className="grid h-[51px] flex-1 place-items-center rounded-lg bg-[#16161E]">
              History of exchanges
            </div>
            <div className="h-[51px] flex-1">
              <SendExchangeOffer className="size-full text-base" />
            </div>
          </div>
        </div>

        <section className="container mt-4 rounded-lg bg-[#1C1D27] p-6 pb-2">
          <ExchangeHistory exchanges={exchanges} />
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="container">
        <div className="text-center text-red-500">
          Ошибка загрузки истории обменов
        </div>
      </div>
    );
  }
}
