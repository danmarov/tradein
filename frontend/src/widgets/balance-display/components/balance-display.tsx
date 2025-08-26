"use client";
import { useBalance } from "@/features/balance/client";
import TopUpBalance from "@/features/balance/components/top-up-balance";
import { formatPrice } from "@/shared/lib/utils";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { useModal } from "@/shared/ui/modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Plus } from "lucide-react";
import React from "react";
import CountUp from "react-countup";
export default function BalanceDisplay() {
  const { balance, invalidateBalance } = useBalance();
  const modal = useModal();

  const handleBalanceClick = () => {
    invalidateBalance();
    modal.toggleModal();
  };
  return (
    <>
      <TopUpBalance open={modal.isOpen} onOpenChange={modal.setIsOpen} />
      <Tooltip>
        <TooltipTrigger
          onClick={handleBalanceClick}
          className="ml-auto mr-4 flex cursor-pointer items-center rounded-sm bg-[#1c1d26] px-2 py-1"
        >
          <span>
            <CustomIcon.Swap />
          </span>
          <div className="ml-2 mr-8 flex flex-col">
            <span className="w-fit text-base font-bold">
              <span className="mr-0.5 text-[#615dfc]">$</span>
              {formatPrice(balance?.balance || 0, {
                hideCurrencySymbol: true,
              })}
              {/* <CountUp
                end={balance?.balance || 0}
                duration={0.8}
                decimals={2}
                decimal="."
                separator=","
                preserveValue 
              /> */}
            </span>
            <span className="text-muted text-xs font-semibold">
              Trade balance
            </span>
          </div>
          <span className="grid h-[30px] w-5 cursor-pointer place-items-center rounded-sm bg-[#3a35fb]">
            <Plus size={16} strokeWidth={2.5} />
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="w-[190px] rounded-sm bg-black px-1.5 py-1 text-sm font-medium"
          arrowClassName="bg-black"
        >
          <p className="text-foreground text-center">Trade balance</p>
          <p className="text-muted text-center leading-tight">
            You can only use this on the <br /> Trade page
          </p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
