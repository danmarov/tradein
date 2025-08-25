import { LoginModal } from "@/features/auth";
import { getServerAuth } from "@/features/auth/server";
import { MaintenanceModal } from "@/widgets/sections";
import AuthRequiredModal from "@/widgets/sections/auth-required-modal";
import Image from "next/image";
import Link from "next/link";

export default async function TradePage() {
  const authData = await getServerAuth();

  return (
    <div className="overflow-hidden">
      <div className="main-content relative blur-sm">
        <Image src={"/images/moc/trade.png"} alt="" fill />
      </div>
      <MaintenanceModal />
      {!authData.isAuthenticated || !authData.user ? (
        <AuthRequiredModal />
      ) : null}
      <div className="h-[127px] w-full bg-[#16161d]"></div>
    </div>
  );
}
