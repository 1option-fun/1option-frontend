import { cookieStorage, createStorage, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { createConfig } from "@privy-io/wagmi";

export function getConfig() {
  return createConfig({
    chains: [baseSepolia, base],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
      [base.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
