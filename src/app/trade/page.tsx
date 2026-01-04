"use client";

import { TradeHeader } from "@/components/trade/TradeHeader";
import { ExpiryStrip } from "@/components/trade/ExpiryStrip";
import { MarketStats } from "@/components/trade/MarketStats";
import { OptionChainTable } from "@/components/trade/OptionChainTable";
import { PositionsPanel } from "@/components/trade/PositionsPanel";
import TradingViewWidget from "@/components/trade/TradingViewWidget";
import {
  fetchThetanutsData,
  filterOrders,
  getAvailableExpiries,
  Asset,
  ProductType,
  ApiOrder,
  MarketData,
} from "@/lib/thetanuts";
import { useEffect, useState, useMemo, useCallback } from "react";

export default function TradePage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  // Filters
  const [selectedAsset, setSelectedAsset] = useState<Asset>("BTC");
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("Spread"); // Default to Spread as it's common
  const [selectedExpiry, setSelectedExpiry] = useState<number | null>(null);

  // Data Fetching
  const loadData = useCallback(async () => {
    try {
      const data = await fetchThetanutsData();
      if (data) {
        setOrders(data.data.orders);
        setMarketData(data.data.market_data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30s poll
    return () => clearInterval(interval);
  }, [loadData]);

  // Derived Data
  const availableExpiries = useMemo(
    () => getAvailableExpiries(orders, selectedAsset),
    [orders, selectedAsset]
  );

  // Auto-select first expiry if none selected or invalid
  useEffect(() => {
    if (
      availableExpiries.length > 0 &&
      (!selectedExpiry || !availableExpiries.includes(selectedExpiry))
    ) {
      setSelectedExpiry(availableExpiries[0]);
    }
  }, [availableExpiries, selectedExpiry]);

  const filteredOrders = useMemo(
    () =>
      filterOrders(
        orders,
        selectedAsset,
        selectedProduct,
        selectedExpiry || undefined
      ),
    [orders, selectedAsset, selectedProduct, selectedExpiry]
  );

  return (
    <main className="flex flex-col  bg-[#0a0a0b] text-white overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-none bg-[#0a0a0b] z-30 relative">
        <TradeHeader
          selectedAsset={selectedAsset}
          onAssetChange={setSelectedAsset}
          selectedProduct={selectedProduct}
          onProductChange={setSelectedProduct}
        />
        <ExpiryStrip
          expiries={availableExpiries}
          selectedExpiry={selectedExpiry}
          onExpirySelect={setSelectedExpiry}
        />
        <MarketStats
          marketData={marketData}
          selectedAsset={selectedAsset}
          onRefresh={loadData}
        />
        <TradingViewWidget symbol={selectedAsset} />
      </div>

      {/* Scrollable Option Chain - Flex 1 */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <OptionChainTable
          orders={filteredOrders}
          marketData={marketData}
          selectedAsset={selectedAsset}
        />
      </div>

      {/* Fixed Footer */}
      <div className="flex-none z-40 relative">
        <PositionsPanel />
      </div>
    </main>
  );
}
