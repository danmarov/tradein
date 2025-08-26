"use client";
import { useAuth } from "@/features/auth";
import { Avatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Plus } from "lucide-react";
import React from "react";

export default function AccountControls() {
  const { user, logout } = useAuth();

  return (
    <>
      <Tooltip>
        <TooltipTrigger className="ml-auto mr-4 flex cursor-pointer items-center rounded-sm bg-[#1c1d26] px-2 py-1">
          <span>
            <CustomIcon.Swap />
          </span>
          <div className="ml-2 mr-8 flex flex-col">
            <span className="w-fit text-base font-bold">
              <span className="mr-0.5 text-[#615dfc]">$</span>0
            </span>
            <span className="text-muted text-xs font-semibold">
              Trade balance
            </span>
          </div>
          <span className="grid h-[30px] w-5 cursor-pointer place-items-center rounded-sm bg-[#3a35fb]">
            <Plus size={16} strokeWidth={2.5} />
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="w-[190px] rounded-sm bg-black px-1.5 py-1 text-sm font-medium"
          arrowClassName="bg-black"
        >
          <p className="text-foreground text-center">Trade balance</p>
          <p className="text-muted text-center leading-tight">
            You can only use this on the <br /> Trade page
          </p>
        </TooltipContent>
      </Tooltip>

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
