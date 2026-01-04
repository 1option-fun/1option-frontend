"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { formatExpiryDate } from "@/lib/thetanuts";

interface ExpiryStripProps {
  expiries: number[];
  selectedExpiry: number | null;
  onExpirySelect: (expiry: number) => void;
}

export function ExpiryStrip({
  expiries,
  selectedExpiry,
  onExpirySelect,
}: ExpiryStripProps) {
  // Format: 05JAN26
  const formatDate = formatExpiryDate;

  return (
    <div className="w-full border-b border-white/10 bg-[#0a0a0b]">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Expiry Date
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {expiries.length === 0 && (
            <span className="text-xs text-zinc-600 font-mono italic px-2">
              No expiries available
            </span>
          )}
          {expiries.map((ts) => (
            <button
              key={ts}
              onClick={() => onExpirySelect(ts)}
              className={cn(
                "flex-none px-4 py-2 rounded-md text-xs font-mono font-medium border transition-all whitespace-nowrap",
                selectedExpiry === ts
                  ? "bg-white text-black border-white"
                  : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20 hover:text-zinc-300"
              )}
            >
              {formatDate(ts)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
