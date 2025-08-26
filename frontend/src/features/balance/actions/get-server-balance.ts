import { cookies } from "next/headers";
import { cache } from "react";
import { BalanceData } from "../model";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

async function _getServerBalance(): Promise<BalanceData | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }

    const response = await fetch(`${BACKEND_URL}/balance`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

export const getServerBalance = cache(_getServerBalance);
