"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bitcoin, Activity } from "lucide-react"; // Using Activity as placeholder for ETH
import Image from "next/image";

interface TradeHeaderProps {
  selectedAsset: "BTC" | "ETH";
  onAssetChange: (asset: "BTC" | "ETH") => void;
  selectedProduct: "Vanilla" | "Spread" | "Butterfly" | "Condor";
  onProductChange: (
    product: "Vanilla" | "Spread" | "Butterfly" | "Condor"
  ) => void;
}

export function TradeHeader({
  selectedAsset,
  onAssetChange,
  selectedProduct,
  onProductChange,
}: TradeHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        {/* Asset Selector */}
        <div className="flex items-start gap-2 flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-2">
            Select Asset
          </span>
          <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => onAssetChange("BTC")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
                selectedAsset === "BTC"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Image src="/btc_logo.png" alt="BTC" width={20} height={20} />
              BTC
            </button>
            <button
              onClick={() => onAssetChange("ETH")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
                selectedAsset === "ETH"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Image src="/eth_logo.svg" alt="ETH" width={20} height={20} />
              ETH
            </button>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5">
          {["Vanilla", "Spread", "Butterfly", "Condor"].map((product) => (
            <button
              key={product}
              onClick={() => onProductChange(product as any)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                selectedProduct === product
                  ? "bg-zinc-800 text-white shadow-sm border border-white/10"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {product}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
