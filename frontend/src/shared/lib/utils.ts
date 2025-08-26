import { cn } from "@sglara/cn";

export { cn };

export function formatPrice(
  price: number,
  options?: {
    locale?: string;
    currency?: string;
    hideCurrencySymbol?: boolean;
    currencyDisplay?: "symbol" | "code" | "name" | "narrowSymbol";
  },
) {
  const {
    locale = "en-US",
    currency = "USD",
    hideCurrencySymbol = false,
    currencyDisplay = "symbol",
  } = options || {};

  return new Intl.NumberFormat(locale, {
    style: hideCurrencySymbol ? "decimal" : "currency",
    currency: currency,
    currencyDisplay: currencyDisplay,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
