import React from "react";
import InventoryItem from "./inventory-item";

export default function InventoryGrid() {
  return (
    <div className="mt-1">
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-1"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        }}
      >
        {Array.from({ length: 15 }).map((_, index) => (
          <InventoryItem key={index} />
        ))}
      </div>
    </div>
  );
}
