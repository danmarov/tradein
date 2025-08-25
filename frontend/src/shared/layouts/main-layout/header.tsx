"use client";

import { Button } from "@/shared/ui/button";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePageConfig } from "./hooks/use-page-config";
import { usePathname } from "next/navigation";
import React from "react";
import { LoginButton } from "@/features/auth/components/login-button";
import { useAuth } from "@/features/auth";

const navigation = [
  { label: "Trade", path: "/trade" },
  { label: "Store", path: "/store" },
  { label: "P2P", path: "/p2p" },
];

interface HeaderProps {
  forceContainer?: boolean;
  variant?: "default" | "compact" | "full";
  className?: string;
}

export default function Header({
  forceContainer,
  variant,
  className,
}: HeaderProps = {}) {
  const pathname = usePathname();
  const pageConfig = usePageConfig();
  const { user, isAuthenticated, logout, login } = useAuth();

  const shouldUseContainer = forceContainer ?? pageConfig.useContainer;
  const headerVariant = variant ?? pageConfig.headerVariant;

  const getHeaderStyles = () => {
    const baseStyles =
      "flex h-[72px] items-center transition-all duration-300 ease-in-out";

    if (shouldUseContainer) {
      return cn(baseStyles, "container");
    }

    return headerVariant === "compact"
      ? cn(baseStyles, "mx-auto max-w-6xl px-6")
      : cn(baseStyles, "mx-auto max-w-full px-6");
  };

  return (
    <header className={cn(getHeaderStyles(), className)}>
      <Link href={"/"}>
        <CustomIcon.Logo />
      </Link>

      <nav className="ml-4 flex h-full">
        {navigation.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "hover:text-foreground relative grid h-full place-items-center px-4 font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted",
              )}
            >
              {item.label}
              {isActive && (
                <span className="bg-primary absolute left-1/2 top-0 h-1 w-5 -translate-x-1/2 rounded-b-lg" />
              )}
            </Link>
          );
        })}
      </nav>
      {/* {isAuthenticated} */}
      {isAuthenticated ? (
        <>
          <span className="ml-auto">Привет, {user?.username}!</span>
          <Button className="ml-4" onClick={logout}>
            Logout
          </Button>
        </>
      ) : (
        <Button
          icon={<CustomIcon.Steam />}
          className="ml-auto"
          onClick={() =>
            login({
              steam_id: "76561198000054364",
              steam_ticket: "test_ticket",
            })
          }
        >
          Log in with steam
        </Button>
      )}
    </header>
  );
}
