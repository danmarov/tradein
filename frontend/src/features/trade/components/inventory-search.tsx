import { CustomIcon } from "@/shared/ui/custom-icon";
import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";
import React from "react";

// MT-4
export default function InventorySearch() {
  return (
    <div className="mt-4 flex items-center justify-between rounded-sm bg-[#16161E] p-3">
      <Input
        placeholder="Search inventory"
        prefix={<Search size={16} />}
        className="w-[314px] text-sm"
      />
      <button className="text-foreground grid size-8 cursor-pointer place-items-center rounded-sm bg-[#1C1D27] hover:opacity-90">
        <CustomIcon.Reload />
      </button>
    </div>
  );
}
