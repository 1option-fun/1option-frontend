export type Asset = "BTC" | "ETH";
export type ProductType = "Vanilla" | "Spread" | "Butterfly" | "Condor";

export interface ApiOrder {
  order: {
    maker: string;
    collateral: string;
    isCall: boolean;
    priceFeed: string;
    implementation: string;
    strikes: number[];
    expiry: number;
    price: string;
    maxCollateralUsable: string;
    isLong: boolean;
    orderExpiryTimestamp: number;
    numContracts: string;
    extraOptionData: string;
  };
  nonce: string;
  signature: string;
  optionBookAddress: string;
}

export interface MarketData {
  BTC: number;
  ETH: number;
}

export interface ApiResponse {
  data: {
    orders: ApiOrder[];
    market_data: MarketData;
  };
}

export const CONSTANTS = {
  API_URL: "https://round-snowflake-9c31.devops-118.workers.dev/",
  REFRESH_INTERVAL: 30000,
  BTC_FEED: "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F",
  ETH_FEED: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};

export async function fetchThetanutsData(): Promise<ApiResponse | null> {
  try {
    const response = await fetch(CONSTANTS.API_URL);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Thetanuts data:", error);
    return null;
  }
}

export function filterOrders(
  orders: ApiOrder[],
  asset: Asset,
  product: ProductType,
  expiry?: number
): ApiOrder[] {
  const assetFeed = asset === "BTC" ? CONSTANTS.BTC_FEED : CONSTANTS.ETH_FEED;

  return orders.filter((o) => {
    // 1. Filter by Asset (Price Feed)
    if (o.order.priceFeed.toLowerCase() !== assetFeed.toLowerCase())
      return false;

    // 2. Filter by Product Type (Strike Count)
    const strikeCount = o.order.strikes.length;
    let requiredStrikes = 1; // Default/Unknown
    if (product === "Spread") requiredStrikes = 2;
    if (product === "Butterfly") requiredStrikes = 3;
    if (product === "Condor") requiredStrikes = 4;

    // For "Vanilla", usually 1 strike, but could be specific impl.
    // The guide says: 2=Spread, 3=Butterfly, 4=Condor.
    // Assuming Vanilla isn't clearly defined by strike count based on guide text alone (it implies OptionBook is mostly spreads+),
    // but typically Vanilla = 1 strike. Let's assume strict length check.
    if (
      product !== "Vanilla" && // If vanilla, we might want to be permissive or strict?
      strikeCount !== requiredStrikes
    ) {
      return false;
    }
    // If selecting Vanilla, maybe we show 1-strike?
    // Guide doesn't list Vanilla implementation explicitly in the "Option Product Types" JSON, only Spread/Fly/Condor.
    // But typical OptionBook might support it. We will assume 1 strike for Vanilla if it exists.
    if (product === "Vanilla" && strikeCount !== 1) return false;

    // 3. Filter by Expiry (if selected)
    if (expiry && formatExpiryDate(o.order.expiry) !== formatExpiryDate(expiry))
      return false;

    return true;
  });
}

// Helper to format expiry date DDMMMYY (e.g. 05JAN26)
export const formatExpiryDate = (ts: number) => {
  return new Date(ts * 1000)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .toUpperCase()
    .replace(/ /g, "");
};

// Helper to format large numbers
export const formatStrike = (val: number) => val / 1e8;
export const formatPrice = (val: string) => Number(val) / 1e8;
export const formatUSDC = (val: string) => Number(val) / 1e6;

export function getAvailableExpiries(
  orders: ApiOrder[],
  asset: Asset
): number[] {
  const assetFeed = asset === "BTC" ? CONSTANTS.BTC_FEED : CONSTANTS.ETH_FEED;
  const timestamps = new Set<number>();

  orders.forEach((o) => {
    if (o.order.priceFeed.toLowerCase() === assetFeed.toLowerCase()) {
      timestamps.add(o.order.expiry);
    }
  });

  const sorted = Array.from(timestamps).sort((a, b) => a - b);

  // Deduplicate by Date String
  // Keep the first timestamp for each unique date
  const uniqueDates = new Set<string>();
  const dedupedCtx: number[] = [];

  for (const ts of sorted) {
    const dateStr = formatExpiryDate(ts);
    if (!uniqueDates.has(dateStr)) {
      uniqueDates.add(dateStr);
      dedupedCtx.push(ts);
    }
  }

  return dedupedCtx;
}
