"use client";

import { useAuth } from "@/features/auth";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { Modal, useModal } from "@/shared/ui/modal";
import { ReactNode } from "react";
import { useBalance } from "../client";
import { formatPrice } from "@/shared/lib/utils";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface TopUpBalanceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TopUpBalance({
  open,
  onOpenChange,
}: TopUpBalanceProps) {
  const { loginWithSteam } = useAuth();
  const { balance } = useBalance();
  return (
    <>
      <Modal
        open={open}
        size="lg"
        titleClassName="p-0 pr-4 items-start pt-4"
        title={
          <div className="flex w-full items-center gap-3 px-6 pb-4">
            <CustomIcon.Swap size={32} />
            <div>
              <p className="text-foreground text-lg font-bold">
                Add funds to trade balance
              </p>
              <p className="text-muted text-sm font-medium">
                Available funds: {formatPrice(balance?.balance || 0)}
              </p>
            </div>
          </div>
        }
        onOpenChange={onOpenChange}
        trigger={
          <button
            style={{
              display: "none",
            }}
          />
        }
        contentClassName="p-0"
      >
        <>
          <div className="border-t border-[#252632] px-6 pt-8">
            <p className="text-muted mb-2 text-sm font-bold uppercase">
              SELECT PAYMENT METHOD
            </p>
            <div className="grid max-h-[310px] grid-cols-2 gap-2 overflow-y-auto">
              <div className="h-[93px] rounded-sm bg-[#252632]"></div>
              <div className="h-[93px] rounded-sm bg-[#252632]"></div>
              <div className="h-[93px] rounded-sm bg-[#252632]"></div>
              <div className="h-[93px] rounded-sm bg-[#252632]"></div>
              <div className="h-[93px] rounded-sm bg-[#252632]"></div>
              <div className="h-[93px] rounded-sm bg-[#252632]"></div>
            </div>
            <div className="relative mb-16 mt-8 aspect-[47/8]">
              <Image src={"/images/popup-topup.webp"} fill alt="banner" />
            </div>
          </div>
          <div className="flex items-center border-t border-[#252632] px-6 py-4">
            <p className="text-muted text-sm font-semibold">
              By clicking Confirm purchase, you agree to our{" "}
              <Link href={"https://tradeit.gg/tos"} className="text-[#615dfc]">
                Terms of Service
              </Link>{" "}
              and that you have read our{" "}
              <Link
                href={"https://tradeit.gg/privacy"}
                className="text-[#615dfc]"
              >
                {" "}
                Privacy Policy
              </Link>
            </p>
            <Button className="ml-auto h-fit shrink-0 opacity-15">
              <Lock size={13} />
              Complete Purchase
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
}
