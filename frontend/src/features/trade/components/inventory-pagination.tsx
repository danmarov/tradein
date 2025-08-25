import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInventoryContext } from "@/features/trade/context/inventory-context";
import React from "react";

interface InventoryPaginationProps {
  userType: "current" | "target";
  currentPage: number;
  totalPages: number;
}

export default function InventoryPagination({
  userType,
  currentPage,
  totalPages,
}: InventoryPaginationProps) {
  const { setCurrentUserPage, setTargetUserPage } = useInventoryContext();

  const setPage =
    userType === "current" ? setCurrentUserPage : setTargetUserPage;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  return (
    <div className="mt-4 rounded-sm bg-[#16161E] py-2.5">
      <div className="text-muted flex justify-center gap-2.5 text-sm">
        Page number
        <div className="flex items-center gap-1">
          <button
            className="size-4 cursor-pointer disabled:opacity-50"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={14} />
          </button>
          {currentPage} / {totalPages}
          <button
            className="size-4 cursor-pointer disabled:opacity-50"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
