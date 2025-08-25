"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import type { ItemBrief } from "@/entities/item/model";
import type { PaginationResponse } from "@/entities/shared/model";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

export interface TradeUser {
  id: string;
  username: string;
  avatar: string;
}

export interface Trade {
  id: string;
  sender: TradeUser;
  recipient: TradeUser;
  status: string;
  items_to_give: ItemBrief[];
  items_to_receive: ItemBrief[];
  total_value_give: number;
  total_value_receive: number;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface TradesResponse {
  trades: Trade[];
  pagination: PaginationResponse;
}

interface GetTradesParams {
  type?: "sent" | "received" | "all";
  status?: string;
  page?: number;
  limit?: number;
}

async function _getTrades({
  type = "all",
  status,
  page = 1,
  limit = 50,
}: GetTradesParams = {}): Promise<TradesResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const params = new URLSearchParams({
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    const response = await fetch(`${BACKEND_URL}/trades?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trades: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const getTrades = cache(_getTrades);
