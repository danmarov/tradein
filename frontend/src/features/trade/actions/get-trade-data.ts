import { cache } from "react";
import { cookies } from "next/headers";
import type { InventoryResponse } from "@/entities/item/model";
import type { UserTradeInfo, TradeData } from "@/features/trade/model";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";
import { TRADE_CONFIG } from "@/features/trade/config";

async function _getTradeData(
  currentUserId: string,
  targetUserId: string,
): Promise<TradeData> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return {
      currentUserInventory: {
        items: [],
        pagination: {
          page: 1,
          limit: TRADE_CONFIG.ITEMS_PER_PAGE,
          total: 0,
          pages: 0,
        },
      },
      canTrade: false,
      error: "UNAUTHORIZED",
    };
  }

  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  if (currentUserId === targetUserId) {
    try {
      const currentUserResponse = await fetch(
        `${BACKEND_URL}/inventory/${currentUserId}?limit=${TRADE_CONFIG.ITEMS_PER_PAGE}&page=1`,
        {
          headers: authHeaders,
        },
      );

      if (currentUserResponse.ok) {
        const currentUserInventory: InventoryResponse =
          await currentUserResponse.json();
        return {
          currentUserInventory,
          canTrade: false,
          error: "SELF_TRADE_NOT_ALLOWED",
        };
      }
    } catch (error) {}

    return {
      currentUserInventory: {
        items: [],
        pagination: {
          page: 1,
          limit: TRADE_CONFIG.ITEMS_PER_PAGE,
          total: 0,
          pages: 0,
        },
      },
      canTrade: false,
      error: "SELF_TRADE_NOT_ALLOWED",
    };
  }

  try {
    const [
      currentUserInventoryResponse,
      targetUserProfileResponse,
      targetUserInventoryResponse,
    ] = await Promise.all([
      fetch(
        `${BACKEND_URL}/inventory/${currentUserId}?limit=${TRADE_CONFIG.ITEMS_PER_PAGE}&page=1`,
        {
          headers: authHeaders,
        },
      ),
      fetch(`${BACKEND_URL}/users/${targetUserId}`, {
        headers: authHeaders,
      }),
      fetch(
        `${BACKEND_URL}/inventory/${targetUserId}?limit=${TRADE_CONFIG.ITEMS_PER_PAGE}&page=1`,
        {
          headers: authHeaders,
        },
      ),
    ]);

    let currentUserInventory: InventoryResponse;
    if (currentUserInventoryResponse.ok) {
      currentUserInventory = await currentUserInventoryResponse.json();
    } else {
      currentUserInventory = {
        items: [],
        pagination: {
          page: 1,
          limit: TRADE_CONFIG.ITEMS_PER_PAGE,
          total: 0,
          pages: 0,
        },
      };
    }

    if (!targetUserProfileResponse.ok) {
      if (targetUserProfileResponse.status === 404) {
        return {
          currentUserInventory,
          canTrade: false,
          error: "TARGET_USER_NOT_FOUND",
        };
      }

      if (targetUserProfileResponse.status === 401) {
        return {
          currentUserInventory,
          canTrade: false,
          error: "UNAUTHORIZED",
        };
      }

      return {
        currentUserInventory,
        canTrade: false,
        error: "NETWORK_ERROR",
      };
    }

    if (!targetUserInventoryResponse.ok) {
      if (targetUserInventoryResponse.status === 401) {
        return {
          currentUserInventory,
          canTrade: false,
          error: "UNAUTHORIZED",
        };
      }
      return {
        currentUserInventory,
        canTrade: false,
        error: "NETWORK_ERROR",
      };
    }

    const targetUserProfile = await targetUserProfileResponse.json();
    const targetUserInventory: InventoryResponse =
      await targetUserInventoryResponse.json();

    const targetUser: UserTradeInfo = {
      userId: targetUserProfile.id,
      username: targetUserProfile.username,
      avatar: targetUserProfile.avatar,
      inventory: targetUserInventory,
      online: targetUserProfile.online,
      stats: targetUserProfile.stats,
    };

    const canTrade =
      currentUserInventory.items.some((item) => item.tradeable) &&
      targetUser.inventory.items.some((item) => item.tradeable);

    return {
      currentUserInventory,
      targetUser,
      canTrade,
    };
  } catch (error) {
    return {
      currentUserInventory: {
        items: [],
        pagination: {
          page: 1,
          limit: TRADE_CONFIG.ITEMS_PER_PAGE,
          total: 0,
          pages: 0,
        },
      },
      canTrade: false,
      error: "NETWORK_ERROR",
    };
  }
}

export const getTradeData = cache(_getTradeData);
