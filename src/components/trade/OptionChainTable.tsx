"use client";

import { cn } from "@/lib/utils";
import {
  ApiOrder,
  formatStrike,
  formatPrice,
  MarketData,
} from "@/lib/thetanuts";
import { useMemo } from "react";
import { getGreeks, Greeks } from "@/lib/greeks";

interface OptionChainTableProps {
  orders: ApiOrder[];
  marketData: MarketData | null;
  selectedAsset: "BTC" | "ETH";
}

interface RowData {
  strike: number;
  callBid?: ApiOrder;
  callAsk?: ApiOrder;
  putBid?: ApiOrder;
  putAsk?: ApiOrder;
  callGreeks?: Greeks;
  putGreeks?: Greeks;
}

export function OptionChainTable({
  orders,
  marketData,
  selectedAsset,
}: OptionChainTableProps) {
  const spotPrice = selectedAsset === "BTC" ? marketData?.BTC : marketData?.ETH;

  // Transform flat list of orders into Strike-based rows
  const { rows, expiryLabel } = useMemo(() => {
    const strikeMap = new Map<number, RowData>();
    let expiry = "";

    if (!spotPrice) return { rows: [], expiryLabel: "" };

    orders.forEach((order) => {
      // Capture expiry from the first order
      if (!expiry) {
        expiry = new Date(order.order.expiry * 1000)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })
          .toUpperCase()
          .replace(/ /g, "");
      }

      const primaryStrike = formatStrike(order.order.strikes[0]);

      if (!strikeMap.has(primaryStrike)) {
        strikeMap.set(primaryStrike, { strike: primaryStrike });
      }

      const row = strikeMap.get(primaryStrike)!;

      // Logic:
      // isCall = CALL side
      // isLong = Maker is Long (Buying) -> BID
      // !isLong = Maker is Short (Selling) -> ASK

      if (order.order.isCall) {
        if (order.order.isLong) {
          // Bid (Maker Buy)
          if (
            !row.callBid ||
            Number(order.order.price) > Number(row.callBid.order.price)
          ) {
            row.callBid = order; // Higher bid is better
          }
        } else {
          // Ask (Maker Sell)
          if (
            !row.callAsk ||
            Number(order.order.price) < Number(row.callAsk.order.price)
          ) {
            row.callAsk = order; // Lower ask is better
          }
        }
      } else {
        if (order.order.isLong) {
          // Bid (Maker Buy)
          if (
            !row.putBid ||
            Number(order.order.price) > Number(row.putBid.order.price)
          ) {
            row.putBid = order;
          }
        } else {
          // Ask (Maker Sell)
          if (
            !row.putAsk ||
            Number(order.order.price) < Number(row.putAsk.order.price)
          ) {
            row.putAsk = order;
          }
        }
      }
    });

    const results = Array.from(strikeMap.values()).sort(
      (a, b) => a.strike - b.strike
    );

    // Calculate Greeks based on available orders (prefer Asks for vol selling context)
    const calculated = results.map((row) => {
      const callRef = row.callAsk || row.callBid;
      const putRef = row.putAsk || row.putBid;

      if (callRef) {
        row.callGreeks = getGreeks(
          spotPrice,
          callRef.order.strikes.map(formatStrike),
          callRef.order.expiry,
          true
        );
      }
      if (putRef) {
        row.putGreeks = getGreeks(
          spotPrice,
          putRef.order.strikes.map(formatStrike),
          putRef.order.expiry,
          false
        );
      }
      return row;
    });

    return { rows: calculated, expiryLabel: expiry };
  }, [orders, spotPrice]);

  if (rows.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-sm">
        No orders found for selected filters
      </div>
    );
  }

  // Price Cell Renderer
  const PriceCell = ({
    order,
    type,
  }: {
    order?: ApiOrder;
    type: "bid" | "ask";
  }) => {
    if (!order || !spotPrice) return <span className="text-zinc-600">-</span>;

    const usdcPrice = formatPrice(order.order.price);
    const assetPrice = usdcPrice / spotPrice; // implied price in BTC/ETH terms

    return (
      <div className="flex flex-col items-center leading-none py-1">
        <span
          className={cn(
            "font-bold text-xs",
            type === "bid" ? "text-[#00ff9d]" : "text-[#ff3b3b]"
          )}
        >
          {assetPrice.toFixed(4)}
        </span>
        <span className="text-[10px] text-zinc-500 font-medium mt-0.5">
          $
          {usdcPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#0a0a0b] text-[10px] sm:text-xs font-mono relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      <div className="min-w-[1200px]">
        {/* Table Header Wrapper */}
        <div className="sticky top-0 z-30 bg-[#0a0a0b]">
          {/* Large Expiry Header */}
          {expiryLabel && (
            <div className="bg-[#0a0a0b] py-2 text-center border-b border-white/10">
              <span className="text-xl font-bold text-white tracking-widest">
                {expiryLabel}
              </span>
            </div>
          )}

          {/* Main Header (CALLS || STRIKE || PUTS) */}
          <div className="grid grid-cols-[1fr_80px_1fr] border-b border-white/10 bg-[#0a0a0b]">
            <div className="text-center py-1 text-green-500 font-bold border-r border-white/5 tracking-wider text-xs">
              CALLS
            </div>
            <div className="text-center py-1 text-zinc-400 font-bold bg-[#13141b] text-xs">
              STRIKE
            </div>
            <div className="text-center py-1 text-red-500 font-bold border-l border-white/5 tracking-wider text-xs">
              PUTS
            </div>
          </div>

          {/* Sub Header */}
          <div className="grid grid-cols-[repeat(8,1fr)_80px_repeat(8,1fr)] border-b border-white/10 bg-[#13141b] text-zinc-500 text-[10px] sm:text-[11px] font-medium uppercase">
            {/* CALLS Side */}
            <div className="py-2 px-1 text-center border-r border-white/5">
              Theta
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Vega
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Gamma
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Delta
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              IV Bid
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Bid
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Ask
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              IV Ask
            </div>

            {/* STRIKE Column Header */}
            <div className="py-2 px-1 text-center font-bold text-zinc-300 bg-[#0a0a0b] border-x border-white/5">
              Strike
            </div>

            {/* PUTS Side */}
            <div className="py-2 px-1 text-center border-r border-white/5">
              IV Bid
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Bid
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Ask
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              IV Ask
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Delta
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Gamma
            </div>
            <div className="py-2 px-1 text-center border-r border-white/5">
              Vega
            </div>
            <div className="py-2 px-1 text-center">Theta</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="relative">
          {rows.map((row, i) => {
            const isPriceBetween =
              spotPrice &&
              i < rows.length - 1 &&
              spotPrice >= row.strike &&
              spotPrice < rows[i + 1].strike;

            // Handle edge case: Prices outside range or just highlight closest?
            // The "Between" logic is good for the line.

            return (
              <div key={row.strike} className="relative group">
                <div
                  className={cn(
                    "grid grid-cols-[repeat(8,1fr)_80px_repeat(8,1fr)] items-center border-b border-white/5 transition-colors hover:bg-white/5",
                    i % 2 === 0 ? "bg-[#0a0a0b]" : "bg-[#0f0f11]"
                  )}
                >
                  {/* CALLS Data */}
                  <div className="py-3 px-1 text-center text-zinc-300">
                    {row.callGreeks?.theta.toFixed(2) || "-"}
                  </div>
                  <div className="py-3 px-1 text-center text-zinc-300">
                    {row.callGreeks?.vega.toFixed(2) || "-"}
                  </div>
                  <div className="py-3 px-1 text-center text-zinc-300">
                    {row.callGreeks?.gamma.toFixed(6) || "-"}
                  </div>
                  <div className="py-3 px-1 text-center text-zinc-300">
                    {row.callGreeks?.delta.toFixed(3) || "-"}
                  </div>
                  <div className="py-3 px-1 text-center text-zinc-400">
                    {row.callGreeks ? row.callGreeks.iv.toFixed(1) + "%" : "-"}
                  </div>

                  {/* Call Bid */}
                  <div className="py-1 px-1 text-center">
                    <PriceCell order={row.callBid} type="bid" />
                  </div>
                  {/* Call Ask */}
                  <div className="py-1 px-1 text-center">
                    <PriceCell order={row.callAsk} type="ask" />
                  </div>

                  <div className="py-3 px-1 text-center text-zinc-400">
                    {row.callGreeks
                      ? (row.callGreeks.iv + 2.5).toFixed(1) + "%"
                      : "-"}
                  </div>

                  {/* STRIKE Column */}
                  <div className="py-4 px-1 text-center font-bold text-white bg-[#13141b] group-hover:bg-[#1a1b23] border-x border-white/5 text-sm h-full flex items-center justify-center">
                    {row.strike.toLocaleString()}
                  </div>

                  {/* PUTS Data */}
                  <div className="py-3 px-1 text-center text-zinc-400">
                    {row.putGreeks
                      ? (row.putGreeks.iv - 1.2).toFixed(1) + "%"
                      : "-"}
                  </div>

                  {/* Put Bid */}
                  <div className="py-1 px-1 text-center">
                    <PriceCell order={row.putBid} type="bid" />
                  </div>
                  {/* Put Ask */}
                  <div className="py-1 px-1 text-center">
                    <PriceCell order={row.putAsk} type="ask" />
                  </div>

                  <div className="py-3 px-1 text-center text-zinc-400">
                    {row.putGreeks ? row.putGreeks.iv.toFixed(1) + "%" : "-"}
                  </div>
                  <div className="py-3 px-1 text-center text-zinc-300">
                    {row.putGreeks?.delta.toFixed(3) || "-"}
                  </div>
                  <div className="py-3 px-1 text-center text-zinc-300">
                    {row.putGreeks?.gamma.toFixed(6) || "-"}
                  </div>
                  <div className="py-3 px-1 text-center text-zinc-300">
                    {row.putGreeks?.vega.toFixed(2) || "-"}
                  </div>
                  <div className="py-3 px-1 text-center text-zinc-300">
                    {row.putGreeks?.theta.toFixed(2) || "-"}
                  </div>
                </div>

                {/* Price Indicator Line (Rendered AFTER rows content to overlay) */}
                {isPriceBetween && (
                  <div className="absolute -bottom-3 left-0 w-full z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-px bg-white/30 absolute top-1/2 -translate-y-1/2"></div>
                    <div className="bg-white text-black text-[10px] font-bold px-3 py-0.5 rounded-full z-10 border border-black shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      {spotPrice?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
