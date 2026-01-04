"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State } from "wagmi";

import { getConfig } from "@/config/wagmi";
import { privyConfig } from "@/config/privyConfig";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PrivyProvider appId="cmjyhbzto01oll40d5786ofpt" config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{props.children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
