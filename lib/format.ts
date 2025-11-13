export function fmtCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

export function fmtInt(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(Math.floor(value || 0));
}

export function fmtRatio(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(2)}x`;
}


