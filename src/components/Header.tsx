"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useBalance } from "wagmi";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutGrid, TrendingUp, ChevronDown, Trophy } from "lucide-react";
import { formatAddress, formatBalance } from "@/lib/helper";
import Image from "next/image";

export default function Header() {
  const { ready, authenticated, login, user, logout } = usePrivy();
  const { address, chain } = useAccount();

  // Use wagmi's useBalance hook to fetch native balance
  const { data: balance } = useBalance({
    address: address,
  });

  const pathname = usePathname();

  const navItems = [
    { name: "Trade", href: "/trade", icon: TrendingUp },
    { name: "Portfolio", href: "/portfolio", icon: LayoutGrid },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0b]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0b]/80">
      <div className="flex h-16 items-center px-4">
        {/* Logo Section */}
        <div className="mr-4 flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <Image
              src="/1Option_logo.png"
              alt="Logo"
              width={160}
              height={48}
              className="w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Dense Tabular Navigation */}
        <nav className="flex items-center space-x-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
                  "hover:bg-white/5 hover:text-white",
                  isActive ? "text-primary bg-primary/10" : "text-zinc-400"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Stats & Auth */}
        <div className="ml-auto flex items-center gap-4">
          {/* Global Stats Ticker (Hyperliquid style) */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-zinc-500 mr-4 border-r border-white/5 pr-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                24h Vol
              </span>
              <span className="text-zinc-300 font-mono">$1.2B</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                Open Interest
              </span>
              <span className="text-zinc-300 font-mono">$450M</span>
            </div>
          </div>

          <Button
            onClick={login}
            variant="neon"
            size="sm"
            className="font-semibold tracking-wide cursor-pointer"
          >
            Create Game
          </Button>

          {!ready ? (
            <div className="h-9 w-32 animate-pulse rounded bg-zinc-800"></div>
          ) : authenticated ? (
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="flex items-center rounded-lg border border-white/10 bg-zinc-900/50 p-1 pl-3 transition-colors hover:border-white/20">
                {/* Chain & Balance (Hidden on mobile) */}
                <div className="hidden sm:flex items-center gap-3  border-white/10 mr-1">
                  {chain && (
                    <div
                      className="flex items-center gap-1.5"
                      title={chain.name}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-2 py-1 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>
                    {address
                      ? formatAddress(address)
                      : formatAddress(user?.wallet?.address)}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              </div>
            </div>
          ) : (
            <Button
              onClick={login}
              variant="neon"
              size="sm"
              className="font-semibold tracking-wide cursor-pointer"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
