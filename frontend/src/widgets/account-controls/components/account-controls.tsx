"use client";
import { useAuth } from "@/features/auth";
import { Avatar } from "@/shared/ui/avatar";
import { BalanceDisplay } from "@/widgets/balance-display";
import React from "react";

export default function AccountControls() {
  const { user, logout } = useAuth();

  return (
    <>
      <BalanceDisplay />

      {/* <span className="mx-4">Привет, {user?.username}!</span> */}
      <button className="cursor-pointer" onClick={logout}>
        <Avatar
          src="https://avatars.steamstatic.com/a0ce559006a690e56b8b02baecb967aa76a2c6f6_full.jpg"
          name={user?.username}
          className="size-8"
        />
      </button>
    </>
  );
}
