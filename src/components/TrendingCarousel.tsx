import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRef } from "react";

const TRENDING_ITEMS = [
  {
    id: 1,
    name: "rainbowfish (fish)",
    marketCap: "$1.8M",
    replies: 184,
    headline: "Rainbow Fish Leaves Prison, Dives Into New Memecoin",
    imageColor: "bg-blue-200", // Placeholder for actual image
  },
  {
    id: 2,
    name: "The Official 67 Coin (67)",
    marketCap: "$14.7M",
    replies: 2432,
    headline: "67 Pushes Past $20M as Onchain Momentum Builds",
    imageColor: "bg-yellow-200",
  },
  {
    id: 3,
    name: "You'll own nothing & be... (NOTHING)",
    marketCap: "$4.3M",
    replies: 1382,
    headline: "Is Owning Nothing & Being Happy the Move in 2026?",
    imageColor: "bg-white",
  },
  {
    id: 4,
    name: "Rainmaker (RAIN)",
    marketCap: "$7.6M",
    replies: 129,
    headline: "AI Meets Sports Betting With Rainmaker",
    imageColor: "bg-gray-200",
  },
  {
    id: 5,
    name: "The White Whale (WhiteWhale)",
    marketCap: "$59.9M",
    replies: 1202,
    headline: "WhiteWhale Passes $65M MC Amid Broader Memecoin Momentum",
    imageColor: "bg-blue-900",
  },
  {
    id: 6,
    name: "Peepo (Peepo)",
    marketCap: "$814.0K",
    replies: 611,
    headline: "Twitch's Beloved Emote Character On-Chain",
    imageColor: "bg-green-200",
  },
];

export function TrendingCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">
          Now trending
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TRENDING_ITEMS.map((item) => (
          <div key={item.id} className="flex-none w-80">
            <Card className="h-full border-none bg-[#13141b]/50 p-3 hover:bg-[#13141b] transition-colors">
              <div className="flex gap-3 mb-2">
                <div
                  className={`h-12 w-12 flex-none rounded ${item.imageColor}`}
                ></div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-white truncate">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500">
                      market cap: {item.marketCap}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    replies: {item.replies}
                  </span>
                </div>
              </div>
              <p className="text-xs font-medium text-zinc-300 line-clamp-2">
                {item.headline}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
