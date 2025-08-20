import React, { PropsWithChildren } from "react";
import ReactQueryProvider from "./react-query-provider";

export default function Providers({ children }: PropsWithChildren) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
