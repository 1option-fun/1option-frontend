import { formatUnits } from "viem";
export const formatAddress = (address: string | undefined) => {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const formatBalance = (
  balanceResult: { value: bigint; decimals: number; symbol: string } | undefined
) => {
  if (!balanceResult) return "";
  const formatted = formatUnits(balanceResult.value, balanceResult.decimals);
  return `${parseFloat(formatted).toFixed(3)} ${balanceResult.symbol}`;
};
