"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

interface CreateTradeParams {
  recipientId: string;
  itemsToGive: string[];
  itemsToReceive: string[];
  message?: string;
}

interface CreateTradeResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function createTrade({
  recipientId,
  itemsToGive,
  itemsToReceive,
  message,
}: CreateTradeParams): Promise<CreateTradeResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "Unauthorized: Please log in again",
      };
    }

    const response = await fetch(`${BACKEND_URL}/trades`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient_id: recipientId,
        items_to_give: itemsToGive,
        items_to_receive: itemsToReceive,
        message,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to create trade";

      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error.message ||
          `HTTP ${response.status}: ${response.statusText}`;
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const data = await response.json();

    revalidatePath("/p2p");

    return {
      success: true,
      data,
    };
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
