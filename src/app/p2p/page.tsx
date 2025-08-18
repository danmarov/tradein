import { ExchangeHistory } from "@/features/exchange-history";
import { SendExchangeOffer } from "@/features/send-exchange-offer";
import { Exchange } from "@/entities/exchange";

export default function P2PPage() {
  const exchanges: Exchange[] = [
    {
      id: 1,
      nickname: "JohnDoe",
      date: "2024-08-15",
      amount: 1250.0,
      status: "Accepted",
    },
    {
      id: 2,
      nickname: "CryptoTrader",
      date: "2024-08-14",
      amount: 850.5,
      status: "Pending",
    },
    {
      id: 3,
      nickname: "BitcoinMax",
      date: "2024-08-13",
      amount: 2100.75,
      status: "Rejected",
    },
    {
      id: 4,
      nickname: "EthereumPro",
      date: "2024-08-12",
      amount: 675.25,
      status: "Accepted",
    },
    {
      id: 5,
      nickname: "CoinMaster",
      date: "2024-08-11",
      amount: 1890.0,
      status: "Pending",
    },
    {
      id: 6,
      nickname: "BlockchainKing",
      date: "2024-08-10",
      amount: 425.75,
      status: "Rejected",
    },
    {
      id: 7,
      nickname: "DeFiWizard",
      date: "2024-08-09",
      amount: 3250.5,
      status: "Accepted",
    },
    {
      id: 8,
      nickname: "SatoshiFan",
      date: "2024-08-08",
      amount: 990.25,
      status: "Pending",
    },
  ];

  return (
    <>
      {/* Header с кнопками */}
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

      {/* История обменов */}
      <section className="container mt-4 rounded-lg bg-[#1C1D27] p-6 pb-2">
        <ExchangeHistory exchanges={exchanges} />
      </section>
    </>
  );
}
