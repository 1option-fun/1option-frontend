"use client";

import { RefreshCw } from "lucide-react";
import { MarketData } from "@/lib/thetanuts";
import Image from "next/image";

interface MarketStatsProps {
  marketData: MarketData | null;
  selectedAsset: "BTC" | "ETH";
  onRefresh: () => void;
}

export function MarketStats({
  marketData,
  selectedAsset,
  onRefresh,
}: MarketStatsProps) {
  const price = selectedAsset === "BTC" ? marketData?.BTC : marketData?.ETH;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#13141b]/50">
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${
              selectedAsset === "BTC" ? "bg-orange-500" : "bg-blue-500"
            }`}
          >
            {selectedAsset === "BTC" ? (
              <Image src="/btc_logo.png" alt="BTC" width={20} height={20} />
            ) : (
              <Image src="/eth_logo.svg" alt="ETH" width={20} height={20} />
            )}
          </div>
          <span className="font-bold text-white">{selectedAsset}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-xs uppercase">Spot Price</span>
          <span className="font-mono font-bold text-white">
            {price
              ? "$" +
                price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "Loading..."}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-600">1h</span>
          <span className="font-mono font-medium text-red-400">-0.11%</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-600">24h</span>
          <span className="font-mono font-medium text-green-400">+1.37%</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-600">7d</span>
          <span className="font-mono font-medium text-green-400">+3.78%</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-600">1m</span>
          <span className="font-mono font-medium text-green-400">+0.95%</span>
        </div>
      </div>

      <button
        onClick={onRefresh}
        className="text-zinc-500 hover:text-white transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}
