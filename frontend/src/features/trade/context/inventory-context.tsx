"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { Item } from "@/entities/item/model";

interface InventoryContextType {
  currentUserPage: number;
  targetUserPage: number;
  currentUserSearch: string;
  targetUserSearch: string;
  selectedCurrentUserItems: Item[]; // 👈 Выбранные товары текущего пользователя
  selectedTargetUserItems: Item[]; // 👈 Выбранные товары партнера
  setCurrentUserPage: (page: number) => void;
  setTargetUserPage: (page: number) => void;
  setCurrentUserSearch: (search: string) => void;
  setTargetUserSearch: (search: string) => void;
  toggleCurrentUserItem: (item: Item) => void; // 👈 Добавить/удалить товар текущего пользователя
  toggleTargetUserItem: (item: Item) => void; // 👈 Добавить/удалить товар партнера
  isCurrentUserItemSelected: (itemId: string) => boolean; // 👈 Проверка выбран ли товар
  isTargetUserItemSelected: (itemId: string) => boolean;
  clearCurrentUserItems: () => void; // 👈 Добавь эти функции
  clearTargetUserItems: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [targetUserPage, setTargetUserPage] = useState(1);
  const [currentUserSearch, setCurrentUserSearch] = useState("");
  const [targetUserSearch, setTargetUserSearch] = useState("");
  const [selectedCurrentUserItems, setSelectedCurrentUserItems] = useState<
    Item[]
  >([]);
  const [selectedTargetUserItems, setSelectedTargetUserItems] = useState<
    Item[]
  >([]);

  const toggleCurrentUserItem = (item: Item) => {
    setSelectedCurrentUserItems((prev) => {
      const isSelected = prev.some(
        (selectedItem) => selectedItem.id === item.id,
      );
      if (isSelected) {
        return prev.filter((selectedItem) => selectedItem.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const toggleTargetUserItem = (item: Item) => {
    setSelectedTargetUserItems((prev) => {
      const isSelected = prev.some(
        (selectedItem) => selectedItem.id === item.id,
      );
      if (isSelected) {
        return prev.filter((selectedItem) => selectedItem.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isCurrentUserItemSelected = (itemId: string) => {
    return selectedCurrentUserItems.some((item) => item.id === itemId);
  };

  const isTargetUserItemSelected = (itemId: string) => {
    return selectedTargetUserItems.some((item) => item.id === itemId);
  };

  const clearCurrentUserItems = () => {
    setSelectedCurrentUserItems([]);
  };

  const clearTargetUserItems = () => {
    setSelectedTargetUserItems([]);
  };

  return (
    <InventoryContext.Provider
      value={{
        currentUserPage,
        targetUserPage,
        currentUserSearch,
        targetUserSearch,
        selectedCurrentUserItems,
        selectedTargetUserItems,
        setCurrentUserPage,
        setTargetUserPage,
        setCurrentUserSearch,
        setTargetUserSearch,
        toggleCurrentUserItem,
        toggleTargetUserItem,
        isCurrentUserItemSelected,
        isTargetUserItemSelected,
        clearCurrentUserItems,
        clearTargetUserItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error(
      "useInventoryContext must be used within InventoryProvider",
    );
  }
  return context;
}
