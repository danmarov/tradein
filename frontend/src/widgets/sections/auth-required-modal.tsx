import { LoginModal } from "@/features/auth";
import React from "react";

export default function AuthRequiredModal() {
  return (
    <div className="">
      <div
        className="relative mx-auto h-2 w-[180px] overflow-hidden rounded-sm bg-[#171633]"
        style={{
          position: "relative",
        }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-sm"
          style={{
            background: "#3a35fb",
            width: "0%",
            animation: "moving 1.5s ease-in-out infinite",
          }}
        ></div>
      </div>
      <LoginModal />
    </div>
  );
}
