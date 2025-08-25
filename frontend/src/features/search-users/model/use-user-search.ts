// /features/search-users/model/use-user-search.ts
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/hooks/use-debounce";
import type { SearchUsersParams } from "./types";
import { searchUsers } from "../actions/search-users";

export function useUserSearch(
  searchQuery: string,
  options: Omit<SearchUsersParams, "query"> = {},
) {
  const debouncedQuery = useDebounce(searchQuery, 300);

  return useQuery({
    queryKey: ["search-users", debouncedQuery, options],
    queryFn: () => searchUsers({ query: debouncedQuery, ...options }),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => data.users, // Возвращаем только массив пользователей
  });
}
