import { CustomIcon } from "@/shared/ui/custom-icon";
import { Input } from "@/shared/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { useInventoryContext } from "@/features/trade/context/inventory-context";
import { useInventory } from "@/features/trade/model/use-inventory";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface InventorySearchProps {
  userType: "current" | "target";
  userId: string;
}

export default function InventorySearch({
  userType,
  userId,
}: InventorySearchProps) {
  const {
    currentUserSearch,
    targetUserSearch,
    currentUserPage,
    targetUserPage,
    setCurrentUserSearch,
    setTargetUserSearch,
    setCurrentUserPage,
    setTargetUserPage,
  } = useInventoryContext();

  const search = userType === "current" ? currentUserSearch : targetUserSearch;
  const page = userType === "current" ? currentUserPage : targetUserPage;
  const setSearch =
    userType === "current" ? setCurrentUserSearch : setTargetUserSearch;
  const setPage =
    userType === "current" ? setCurrentUserPage : setTargetUserPage;

  const [inputValue, setInputValue] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // 👈 Состояние ховера

  const queryClient = useQueryClient();
  const { isLoading } = useInventory(userId, page, search);

  // Дебаунс для поиска
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
    setIsSearching(false);
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  // 👈 Очистка инпута
  const handleClear = () => {
    setInputValue("");
    setSearch("");
    setPage(1);
    setIsSearching(false);
  };

  // 👈 Ревалидация (повторный запрос)
  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["inventory", userId, page, search],
    });
  };

  const showLoader = isSearching || isLoading;
  const showClearButton = isHovered && inputValue.length > 0; // 👈 Показываем крестик при ховере и наличии текста

  return (
    <div className="mt-4 flex items-center justify-between rounded-sm bg-[#16161E] p-3">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search inventory"
          prefix={<Search size={16} className="relative -left-0.5" />}
          suffix={
            showClearButton ? (
              <button
                onClick={handleClear}
                className="cursor-pointer rounded p-1"
              >
                <X size={14} />
              </button>
            ) : showLoader ? (
              <Loader2 size={16} className="animate-spin" />
            ) : undefined
          }
          className="w-[314px] text-sm"
        />
      </div>
      <button
        onClick={handleRefresh} // 👈 Теперь ревалидирует
        className="text-foreground grid size-8 cursor-pointer place-items-center rounded-sm bg-[#1C1D27] hover:opacity-90"
      >
        <CustomIcon.Reload />
      </button>
    </div>
  );
}
