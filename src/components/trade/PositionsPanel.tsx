"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronUp } from "lucide-react";

export function PositionsPanel() {
  const [activeTab, setActiveTab] = useState("Positions");
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full bg-[#0a0a0b] border-t border-white/10 flex flex-col z-30 shadow-2xl relative">
      {/* Panel Header Tabs */}
      <div className="flex items-center px-4 border-b border-white/10 bg-[#13141b] h-10">
        <div className="flex gap-6">
          {[
            "Positions",
            "Order History",
            "Active",
            "Unfulfilled",
            "Closed",
            "Settled/Expired",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors",
                activeTab === tab
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-zinc-500 hover:text-white"
        >
          <ChevronUp
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded ? "rotate-180" : ""
            )}
          />
        </button>
      </div>

      {/* Content */}
      {/* Panel Content */}
      {isExpanded && (
        <div className="h-52 flex-1 overflow-auto bg-[#0a0a0b] text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#13141b] text-zinc-500 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-medium">Instrument</th>
                <th className="px-4 py-2 font-medium">Side</th>
                <th className="px-4 py-2 font-medium">Size</th>
                <th className="px-4 py-2 font-medium">Entry Price</th>
                <th className="px-4 py-2 font-medium">Mark Price</th>
                <th className="px-4 py-2 font-medium">PNL</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State */}
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-zinc-600"
                >
                  No open positions
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
