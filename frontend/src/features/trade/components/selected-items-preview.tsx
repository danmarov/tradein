"use client";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@sglara/cn";
import { Avatar } from "@/shared/ui/avatar";
import { useInventoryContext } from "@/features/trade/context/inventory-context";
import { formatPrice } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

interface SelectedItemsPreviewProps {
  user: {
    name: string;
    avatar: string;
    fallbackName: string;
    online?: boolean;
  };
  userType: "current" | "target"; // 👈 Добавляем тип пользователя
  defaultOpen?: boolean;
}

export default function SelectedItemsPreview({
  defaultOpen = true,
  user,
  userType, // 👈 Получаем тип пользователя
}: SelectedItemsPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  const {
    selectedCurrentUserItems,
    selectedTargetUserItems,
    toggleCurrentUserItem,
    toggleTargetUserItem,
    clearCurrentUserItems,
    clearTargetUserItems,
  } = useInventoryContext();

  // Выбираем нужные товары в зависимости от типа пользователя
  const selectedItems =
    userType === "current" ? selectedCurrentUserItems : selectedTargetUserItems;
  const toggleItem =
    userType === "current" ? toggleCurrentUserItem : toggleTargetUserItem;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем срабатывание toggle

    // Очищаем товары
    if (userType === "current") {
      // Нужно добавить эту функцию в контекст
      selectedCurrentUserItems.forEach((item) => toggleCurrentUserItem(item));
    } else {
      selectedTargetUserItems.forEach((item) => toggleTargetUserItem(item));
    }

    // Закрываем меню
    setIsExpanded(false);
  };
  return (
    <>
      <div className="flex items-center gap-2 rounded-sm bg-[#16161E] px-3 py-3.5 text-sm font-medium text-white">
        <div className="relative size-6">
          <Avatar src={user.avatar} name={user.fallbackName} />
          {user.online && (
            <span className="translate-x-1/5 absolute right-0 size-2 -translate-y-1/4 rounded-full bg-green-500" />
          )}
        </div>
        {user.name}
      </div>
      <div className="mt-1 rounded-sm bg-[#16161E] px-3 pb-2.5 pt-2">
        <div
          className={cn(
            "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-1 py-1 transition-colors",
          )}
          role="button"
          onClick={toggleExpanded}
        >
          <span className="text-muted flex items-center gap-0.5 text-sm font-medium">
            <Plus size={15} strokeWidth={3} />
            Added items for exchange ({selectedItems.length}){" "}
            {/* 👈 Показываем количество */}
          </span>

          <span className="text-foreground relative flex items-center gap-0.5 text-sm font-medium">
            {userType === "current" ? <>You give</> : <>Your receive</>}
            {selectedItems.length > 0 && (
              <button
                onClick={handleClear}
                className="text-muted font-mediu hover:text-foreground/80 absolute left-0 right-9 top-1/2 w-fit -translate-x-[120%] -translate-y-1/2 cursor-pointer rounded-sm bg-[#181921] px-2.5 py-1.5 text-xs transition-colors duration-150"
              >
                Clear
              </button>
            )}
            <motion.div
              animate={{ rotate: !isExpanded ? 0 : 180 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <ChevronDown size={18} strokeWidth={2.5} />
            </motion.div>
          </span>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="overflow-hidden"
            >
              <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto">
                {selectedItems.length === 0 ? (
                  <div className="text-muted py-4 text-center text-sm">
                    No items selected
                  </div>
                ) : (
                  selectedItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item)} // 👈 Клик удаляет товар
                      className="h-[84px] w-[71px] flex-shrink-0 cursor-pointer rounded-[2px] bg-[#1C1D27] pb-1 transition-opacity hover:opacity-80"
                    >
                      <Image
                        src={item.image} // 👈 Потом замени на item.image
                        alt={item.name}
                        width={56}
                        height={56}
                        className="mx-auto"
                      />
                      <div className="w-full px-1">
                        <p className="text-muted w-fit text-left text-[7px] font-bold">
                          {item.exterior}
                        </p>
                        <p className="text-foreground w-fit text-left text-[9px] font-bold">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
