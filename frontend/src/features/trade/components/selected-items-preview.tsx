"use client";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@sglara/cn";

interface SelectedItemsPreviewProps {
  defaultOpen?: boolean;
}

export default function SelectedItemsPreview({
  defaultOpen = true,
}: SelectedItemsPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="flex items-center gap-2 rounded-sm bg-[#16161E] px-3 py-3.5 text-sm font-medium text-white">
        <span className="inline-block size-6 rounded-full bg-amber-50"></span>
        You
      </div>
      <div className="mt-1 rounded-sm bg-[#16161E] px-3 pb-2.5 pt-2">
        <div
          className={cn(
            "flex cursor-pointer select-none items-center justify-between rounded-sm px-1 py-1 transition-colors",
          )}
          role="button"
          onClick={toggleExpanded}
        >
          <span className="text-muted flex items-center gap-0.5 text-sm font-medium">
            <Plus size={15} strokeWidth={3} />
            Added items for exchange
          </span>
          <span className="text-foreground flex items-center gap-0.5 text-sm font-medium">
            Your receive
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
                {Array.from({ length: 14 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[84px] w-[71px] flex-shrink-0 rounded-[2px] bg-[#1C1D27] pb-1"
                  >
                    <Image
                      src="/images/gloves.png"
                      alt=""
                      width={56}
                      height={56}
                      className="mx-auto"
                    />
                    <div className="w-full px-1">
                      <p className="text-muted w-fit text-left text-[7px] font-bold">
                        MW · 0.1465
                      </p>
                      <p className="text-foreground w-fit text-left text-[9px] font-bold">
                        $5,207.26
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
