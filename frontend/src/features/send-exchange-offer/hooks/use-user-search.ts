// features/send-exchange-offer/hooks/use-user-search.ts
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  nickname: string;
  avatar?: string;
  exchangeCount: number;
}

// Мок API функция
const searchUsers = async (query: string): Promise<User[]> => {
  // Имитируем задержку API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockUsers: User[] = [
    { id: "1", nickname: "PlayboyCarti", exchangeCount: 41 },
    { id: "2", nickname: "TraderJoe", exchangeCount: 128 },
    { id: "3", nickname: "CryptoKing", exchangeCount: 89 },
    { id: "4", nickname: "BitcoinMax", exchangeCount: 156 },
    { id: "5", nickname: "EthereumPro", exchangeCount: 73 },
    { id: "6", nickname: "CoinMaster", exchangeCount: 94 },
    { id: "7", nickname: "DeFiWizard", exchangeCount: 62 },
    { id: "8", nickname: "SatoshiFan", exchangeCount: 187 },
    { id: "9", nickname: "BlockchainBro", exchangeCount: 45 },
    { id: "10", nickname: "CryptoNinja", exchangeCount: 213 },
    { id: "11", nickname: "LitecoinLord", exchangeCount: 78 },
    { id: "12", nickname: "AltcoinAce", exchangeCount: 99 },
    { id: "13", nickname: "DogeKnight", exchangeCount: 134 },
    { id: "14", nickname: "ChainMaster", exchangeCount: 167 },
    { id: "15", nickname: "TokenTrader", exchangeCount: 52 },
  ];

  if (!query.trim()) return mockUsers;

  return mockUsers.filter((user) =>
    user.nickname.toLowerCase().includes(query.toLowerCase()),
  );
};

export function useUserSearch(searchQuery: string) {
  const debouncedQuery = useDebounce(searchQuery, 300);

  return useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: true, // Всегда включен, даже для пустого запроса
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут (новое название для cacheTime)
  });
}
