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

const PAGE_CONFIGS = {
  "/": { useContainer: true, headerVariant: "default" },
  "/trade": { useContainer: false, headerVariant: "full" },
  "/store": { useContainer: false, headerVariant: "full" },
  "/p2p": { useContainer: true, headerVariant: "compact" },
  "/about": { useContainer: true, headerVariant: "default" },
} as const;

interface HeaderProps {
  forceContainer?: boolean;
  variant?: "default" | "compact" | "full";
  className?: string;
}

export default function Header({
  forceContainer,
  variant = "default",
  className,
}: HeaderProps = {}) {
  const pathname = usePathname();

  const pageConfig = PAGE_CONFIGS[pathname as keyof typeof PAGE_CONFIGS];
  const shouldUseContainer2 = pageConfig?.useContainer ?? false;
  const headerVariant = pageConfig?.headerVariant ?? variant;

  const shouldUseContainer = forceContainer ?? shouldUseContainer2;

  const getHeaderStyles = () => {
    const baseStyles =
      "flex h-[72px] items-center transition-all duration-300 ease-in-out";

    if (shouldUseContainer) {
      return cn(baseStyles, "container");
    }

    switch (headerVariant) {
      case "compact":
        return cn(baseStyles, "mx-auto max-w-6xl");
      case "full":
        return cn(baseStyles, "mx-auto max-w-full");
      default:
        return cn(baseStyles, "mx-auto max-w-full");
    }
  };

  return (
    <header
      className={cn(getHeaderStyles(), className)}
      suppressHydrationWarning
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
              pathname === item.path ? "text-foreground" : "text-muted",
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
