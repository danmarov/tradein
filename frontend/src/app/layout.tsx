import type { Metadata } from "next";
import { Sofia_Sans } from "next/font/google";
import "@/styles/globals.css";
import MainLayout from "@/shared/layouts/main-layout";
import Providers from "@/shared/lib/providers";
import { getServerAuth } from "@/features/auth/server";
import { AuthProvider } from "@/features/auth/client";
import { getServerBalance } from "@/features/balance/server";
import { BalanceProvider } from "@/features/balance/client";

const sofiaSans = Sofia_Sans({
  variable: "--font-sofia-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TradeIt",
  description: "Steam items trading platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Получаем auth данные на сервере
  const authData = await getServerAuth();
  const balanceData = await getServerBalance();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${sofiaSans.variable} font-sofia antialiased`}>
        <Providers>
          <AuthProvider initialAuthData={authData}>
            <BalanceProvider initialBalance={balanceData}>
              <MainLayout>{children}</MainLayout>
            </BalanceProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
