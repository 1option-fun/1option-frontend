export interface Greeks {
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  iv: number;
}

// Standard Normal Distribution functions
const N = (x: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign < 0 ? 1 - y : y;
};

const pdf = (x: number): number => {
  return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
};

// Black-Scholes Formula for Vanilla Option
const calculateVanillaGreeks = (
  S: number, // Spot Price
  K: number, // Strike Price
  T: number, // Time to Expiry (years)
  r: number, // Risk-free rate
  v: number, // Volatility
  isCall: boolean
): Greeks => {
  if (T <= 0 || v <= 0 || S <= 0) {
    return { delta: 0, gamma: 0, vega: 0, theta: 0, iv: v * 100 };
  }

  const d1 = (Math.log(S / K) + (r + (v * v) / 2) * T) / (v * Math.sqrt(T));
  const d2 = d1 - v * Math.sqrt(T);

  const delta = isCall ? N(d1) : N(d1) - 1;
  const gamma = pdf(d1) / (S * v * Math.sqrt(T));
  const vega = (S * pdf(d1) * Math.sqrt(T)) / 100; // Divided by 100 to get per 1% vol change
  // Theta per day
  let theta =
    (-1 * S * pdf(d1) * v) / (2 * Math.sqrt(T)) -
    r * K * Math.exp(-r * T) * N(isCall ? d2 : -d2);
  theta = theta / 365;

  return { delta, gamma, vega, theta, iv: v * 100 };
};

// Composite Greeks for Structures
export function getGreeks(
  spotPrice: number,
  strikes: number[],
  expiryTimestamp: number,
  isCall: boolean,
  price?: number // unused for now, assumed volatility
): Greeks {
  const now = Date.now() / 1000;
  const T = Math.max((expiryTimestamp - now) / 31536000, 0.001); // Years
  const r = 0.04; // 4% Risk-free rate
  const v = 0.65; // Assumed 65% Volatility for Crypto

  // Helper to sum greeks
  const sumGreeks = (g1: Greeks, g2: Greeks, weight2: number = 1): Greeks => ({
    delta: g1.delta + g2.delta * weight2,
    gamma: g1.gamma + g2.gamma * weight2,
    vega: g1.vega + g2.vega * weight2,
    theta: g1.theta + g2.theta * weight2,
    iv: v * 100, // Just return assumed vol
  });

  const empty: Greeks = { delta: 0, gamma: 0, vega: 0, theta: 0, iv: v * 100 };

  // Vanilla
  if (strikes.length === 1) {
    return calculateVanillaGreeks(spotPrice, strikes[0], T, r, v, isCall);
  }

  // Spread (Buy K1, Sell K2)
  if (strikes.length === 2) {
    // Assuming Bull Spread for Call (Buy Low, Sell High)
    // Assuming Bear Spread for Put (Buy High, Sell Low)
    const leg1 = calculateVanillaGreeks(spotPrice, strikes[0], T, r, v, isCall);
    const leg2 = calculateVanillaGreeks(spotPrice, strikes[1], T, r, v, isCall);
    return sumGreeks(leg1, leg2, -1);
  }

  // Butterfly (Buy K1, Sell 2*K2, Buy K3)
  if (strikes.length === 3) {
    const leg1 = calculateVanillaGreeks(spotPrice, strikes[0], T, r, v, isCall);
    const leg2 = calculateVanillaGreeks(spotPrice, strikes[1], T, r, v, isCall);
    const leg3 = calculateVanillaGreeks(spotPrice, strikes[2], T, r, v, isCall);

    // Sum: L1 - 2*L2 + L3
    let res = sumGreeks(leg1, leg2, -2);
    res = sumGreeks(res, leg3, 1);
    return res;
  }

  // Condor (Buy K1, Sell K2, Sell K3, Buy K4)
  if (strikes.length === 4) {
    const leg1 = calculateVanillaGreeks(spotPrice, strikes[0], T, r, v, isCall);
    const leg2 = calculateVanillaGreeks(spotPrice, strikes[1], T, r, v, isCall);
    const leg3 = calculateVanillaGreeks(spotPrice, strikes[2], T, r, v, isCall);
    const leg4 = calculateVanillaGreeks(spotPrice, strikes[3], T, r, v, isCall);

    // Sum: L1 - L2 - L3 + L4
    let res = sumGreeks(leg1, leg2, -1);
    res = sumGreeks(res, leg3, -1);
    res = sumGreeks(res, leg4, 1);
    return res;
  }

  return empty;
}
