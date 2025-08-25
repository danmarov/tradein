"use client";
import { Button } from "@/shared/ui/button";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { Modal, useModal } from "@/shared/ui/modal";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth } from "../client";

export default function LoginModal() {
  const { login } = useAuth();
  const modal = useModal({
    defaultOpen: true,
    delay: 250,
  });

  return (
    <Modal
      open={modal.isOpen}
      onOpenChange={(open) => {
        modal.setIsOpen(open);
      }}
      delay={200} // Можно также передать delay напрямую в Modal
      trigger={
        <div style={{ display: "none" }}>
          <Button className={""}>
            Send exchange offer
            <CustomIcon.ArrowLeft />
          </Button>
        </div>
      }
      title="Sign in"
      size="md"
      contentClassName="px-0 pb-0"
      titleClassName="px-6 py-4"
    >
      <>
        <div className="border-y border-[#1f202b] p-0">
          <div className="p-6">
            <Image
              src={"/images/login-popup.svg"}
              alt=""
              width={256}
              height={64}
              className="mx-auto"
            />
            <p className="mt-4 text-center text-2xl font-bold">
              Sign in via Steam
            </p>
            <p className="text-muted text-center text-lg font-medium">
              Log in to unlock this feature. We will redirect you to Steam for
              safe authentication.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            className="text-xs"
            href={"https://www.trustpilot.com/review/tradeit.gg"}
            target="_blank"
          >
            <CustomIcon.TrustPilot2 />
            <p className="mt-1">
              4.9/5{" "}
              <span className="text-muted">
                rating based on 13,000+ reviews
              </span>
            </p>
          </Link>
          <Button
            onClick={() =>
              login({
                steam_id: "9439249832",
                steam_ticket: "9439249832",
              })
            }
          >
            Sign in with Steam
          </Button>
        </div>
      </>
    </Modal>
  );
}
