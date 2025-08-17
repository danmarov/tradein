"use client";

import { Button } from "@/shared/ui/button";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navigation = [
  {
    label: "Trade",
    path: "/trade",
  },
  {
    label: "Store",
    path: "/store",
  },
  {
    label: "P2P",
    path: "/p2p",
  },
];

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header
      className={cn(
        "border-primary flex h-[72px] items-center border px-6 transition-all duration-300 ease-in-out",
        isHomePage ? "container" : "mx-auto max-w-full",
      )}
    >
      <Link href={"/"}>
        <CustomIcon.Logo />
      </Link>
      <nav className="ml-4 flex h-full">
        {navigation.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={cn(
              "hover:text-foreground relative grid h-full place-items-center px-4 font-medium transition-colors",
              pathname === item.path ? "text-foreground" : "text-[#777E88]",
            )}
          >
            {item.label}
            {pathname === item.path && (
              <span className="bg-primary absolute top-0 left-1/2 h-1 w-5 -translate-x-1/2 rounded-b-lg"></span>
            )}
          </Link>
        ))}
      </nav>
      <Button icon={<CustomIcon.Steam />} className="ml-auto">
        Log in with steam
      </Button>
    </header>
  );
}
