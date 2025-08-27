// app/api/balance/deposit/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Валидация на фронте (дополнительная к серверной)
    if (!body.amount || typeof body.amount !== "number" || body.amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (
      !body.payment_method ||
      !["card", "crypto", "paypal"].includes(body.payment_method)
    ) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 },
      );
    }

    // Добавляем дефолтную валюту если не передана
    const requestBody = {
      amount: body.amount,
      payment_method: body.payment_method,
      currency: body.currency || "USD",
    };

    const response = await fetch(`${BACKEND_URL}/balance/deposit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to create deposit" },
        { status: response.status },
      );
    }

    const data = await response.json();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Deposit API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
