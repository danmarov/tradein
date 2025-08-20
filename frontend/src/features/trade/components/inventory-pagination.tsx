import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function InventoryPagination() {
  return (
    <div className="mt-4 rounded-sm bg-[#16161E] py-2.5">
      <div className="text-muted flex justify-center gap-2.5 text-sm">
        Page number
        <div className="flex items-center gap-1">
          <button className="size-4 cursor-pointer">
            <ChevronLeft size={14} />
          </button>
          1
          <button className="size-4 cursor-pointer">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
