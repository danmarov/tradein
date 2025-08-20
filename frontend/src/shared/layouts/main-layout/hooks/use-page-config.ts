import { usePathname } from "next/navigation";
import { getPageConfig } from "../config";

export const usePageConfig = () => {
  const pathname = usePathname();
  return getPageConfig(pathname);
};
