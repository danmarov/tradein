"use client";
import { User } from "@/entities/user/model";
import { TradeData } from "@/features/trade/model";
import {
  InventoryProvider,
  useInventoryContext,
} from "@/features/trade/context/inventory-context";
import { createTrade } from "@/features/trade/";
import React, { useTransition } from "react";
import { InventorySection } from "@/features/trade/components/inventory-section";
import { Button } from "@/shared/ui/button";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function TradeActions({ targetUserId }: { targetUserId: string }) {
  const { selectedCurrentUserItems, selectedTargetUserItems } =
    useInventoryContext();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateTrade = () => {
    if (
      selectedCurrentUserItems.length === 0 ||
      selectedTargetUserItems.length === 0
    ) {
      toast.error("Select items for exchange");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createTrade({
          recipientId: targetUserId,
          itemsToGive: selectedCurrentUserItems.map((item) => item.id),
          itemsToReceive: selectedTargetUserItems.map((item) => item.id),
          message: "Trade offer from Steam trading platform",
        });

        if (result.success && result.data?.id) {
          toast.success("Trade offer sent successfully");
          router.push("/p2p");
        } else {
          // Обрабатываем случай, когда error - это объект с message
          let errorMessage = "Failed to send trade offer";

          if (result.error) {
            if (typeof result.error === "string") {
              errorMessage = result.error;
            } else if (typeof result.error === "object" && result.error) {
              errorMessage = result.error;
            }
          }

          toast.error(errorMessage);
        }
      } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
          throw error;
        }
        let errorMessage = "Failed to send trade offer";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        } else if (error && typeof error === "object") {
          if ("message" in error && error.message) {
            errorMessage = String(error.message);
          } else if ("error" in error && error.error) {
            errorMessage = String(error.error);
          }
        }

        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="ml-auto mt-4 w-fit">
      <Button
        onClick={handleCreateTrade}
        disabled={
          isPending ||
          selectedCurrentUserItems.length === 0 ||
          selectedTargetUserItems.length === 0
        }
        className=""
      >
        Send exchange offer
        {isPending ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <CustomIcon.ArrowLeft />
        )}
      </Button>
    </div>
  );
}

interface TradeCreatorProps {
  currentUser: User;
  tradeData: TradeData;
}

export default function TradeCreator({
  currentUser,
  tradeData,
}: TradeCreatorProps) {
  if (!tradeData.targetUser) {
    return <>No target user</>;
  }

  return (
    <InventoryProvider>
      <div className="flex size-full items-start p-6 pt-0">
        <div className="w-[calc(50%_-_12px)]">
          <InventorySection
            userId={currentUser.id}
            userType="current"
            initialInventory={tradeData.currentUserInventory}
            user={{
              avatar: currentUser.avatar,
              fallbackName: currentUser.username,
              name: "You",
            }}
          />
        </div>
        <div className="ml-auto w-[calc(50%_-_12px)]">
          <InventorySection
            userId={tradeData.targetUser.userId}
            userType="target"
            initialInventory={tradeData.targetUser.inventory}
            user={{
              avatar: tradeData.targetUser.avatar,
              fallbackName: tradeData.targetUser.username,
              name: tradeData.targetUser.username,
              online: true,
            }}
          />
          <TradeActions targetUserId={tradeData.targetUser.userId} />
        </div>
      </div>
    </InventoryProvider>
  );
}
