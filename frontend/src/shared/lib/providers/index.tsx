import React, { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { QueryProvider } from "./query-provider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <Toaster position="top-center" theme="dark" richColors duration={1000} />
      <QueryProvider>{children}</QueryProvider>
    </>
  );
}
