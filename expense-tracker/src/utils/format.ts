const ZAR_FORMATTER: Intl.NumberFormat | null = (() => {
  try {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return null;
  }
})();

export function formatZar(value: number): string {
  const amount = Number.isFinite(value) ? value : 0;

  if (ZAR_FORMATTER) {
    return ZAR_FORMATTER.format(amount);
  }

  // Fallback for runtimes without Intl support.
  return `R ${amount.toFixed(2)}`;
}
