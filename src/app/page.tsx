"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MessageSquare,
  FilterIcon,
  SettingsIcon,
  Gamepad2,
} from "lucide-react";
import { TrendingCarousel } from "@/components/TrendingCarousel";

// Mock Data for Option/Coins
const MOCK_OPTIONS = [
  {
    id: 1,
    ticker: "CHILL",
    name: "Chill Guy",
    creator: "FuxyRy",
    marketCap: "$10.4K",
    change: "+0.00%",
    replies: 104,
    description: "Just a chill guy doing chill things.",
    isLive: true,
  },
  {
    id: 2,
    ticker: "PEPE",
    name: "Pepe Coin",
    creator: "MattFurie",
    marketCap: "$810.4K",
    change: "+12.15%",
    replies: 610,
    description: "Feels good man.",
    isLive: true,
  },
  {
    id: 3,
    ticker: "WIF",
    name: "Dogwifhat",
    creator: "SolanaDev",
    marketCap: "$5.2M",
    change: "+5.37%",
    replies: 1201,
    description: "It's literally a dog wif a hat.",
    isLive: true,
  },
  {
    id: 4,
    ticker: "BONK",
    name: "Bonk",
    creator: "BonkTeam",
    marketCap: "$1.2M",
    change: "-2.4%",
    replies: 89,
    description: "Bonk the bears.",
    isLive: false,
  },
  {
    id: 5,
    ticker: "MOG",
    name: "Mog Coin",
    creator: "JoyBoy",
    marketCap: "$150K",
    change: "+89.2%",
    replies: 420,
    description: "Mogging everyone.",
    isLive: true,
  },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<"explore" | "my-game">(
    "explore"
  );
  const [activeTab, setActiveTab] = useState("new");

  return (
    <main className="min-h-screen bg-[#0a0a0b] pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top-Level Tabs */}
        <TrendingCarousel />
        <div className="flex items-center gap-6 mb-8  border-white/10">
          <button
            onClick={() => setCurrentView("explore")}
            className={`pb-4 text-sm font-medium transition-colors relative cursor-pointer ${
              currentView === "explore"
                ? "text-primary"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Explore
            {currentView === "explore" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"></span>
            )}
          </button>
          <button
            onClick={() => setCurrentView("my-game")}
            className={`pb-4 text-sm font-medium transition-colors relative cursor-pointer ${
              currentView === "my-game"
                ? "text-primary"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            My Game
            {currentView === "my-game" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"></span>
            )}
          </button>
        </div>

        {currentView === "explore" ? (
          <>
            {/* Filter Bar */}
            <div className="sticky top-20 z-40 mb-8 rounded-xl border border-white/5 bg-[#13141b]/95 p-4 backdrop-blur-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    placeholder="Search for options..."
                    className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-ring"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  {["Vanilla", "Spread", "Butterfly", "Condor"].map((label) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      {label}
                    </Button>
                  ))}
                  <div className="h-6 w-px bg-white/10 mx-2"></div>
                  <Button
                    variant={activeTab === "new" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("new")}
                    className={
                      activeTab === "new"
                        ? "bg-primary/10 text-primary"
                        : "text-zinc-400"
                    }
                  >
                    <FilterIcon className="mr-2 h-3 w-3" /> Filter
                  </Button>
                  <Button
                    variant={activeTab === "hot" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("hot")}
                    className={
                      activeTab === "hot"
                        ? "bg-orange-500/10 text-orange-500"
                        : "text-zinc-400"
                    }
                  >
                    <SettingsIcon className=" h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {MOCK_OPTIONS.map((option) => (
                <Card
                  key={option.id}
                  className="group overflow-hidden border-white/5 bg-[#13141b] hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600">
                          IMG
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {option.name}
                            </span>
                            <span className="text-xs font-mono text-zinc-500">
                              /{option.ticker}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Created by{" "}
                            <span className="text-zinc-300 hover:underline cursor-pointer">
                              {option.creator}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-2 space-y-3">
                    <p className="text-xs text-zinc-400 line-clamp-2 min-h-[2.5em]">
                      {option.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-zinc-600 font-bold">
                          Market Cap
                        </span>
                        <span className="text-sm font-mono font-medium text-primary">
                          {option.marketCap}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`border-none bg-zinc-900 ${option.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      >
                        {option.change}
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-black/20 p-3 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer">
                      <MessageSquare className="h-3 w-3" />
                      <span>{option.replies} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {option.isLive && (
                        <div className="flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                          </span>
                          <span className="text-green-500 font-medium">
                            Live
                          </span>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Empty State for My Game */
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <div className="relative h-20 w-20 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10">
                <Gamepad2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Active Games
            </h3>
            <p className="text-zinc-400 max-w-sm mb-8">
              You haven't joined any games yet. Explore the marketplace to find
              your next winning opportunity.
            </p>
            <Button
              onClick={() => setCurrentView("explore")}
              size="lg"
              variant="neon"
              className="font-bold tracking-wide"
            >
              Explore Games
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
