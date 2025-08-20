import React, { PropsWithChildren } from "react";
import Header from "./header";
import { cn } from "@/shared/lib/utils";
import Footer from "./footer";

interface MainLayoutProps extends PropsWithChildren {
  className?: string;
}

export default function MainLayout({
  children,
  className = "",
}: MainLayoutProps) {
  return (
    <>
      <Header />
      <main className={cn("min-h-[calc(100svh_-_70px)]", className)}>
        {children}
      </main>
      <Footer />
    </>
  );
}
