export function calcOffset(page: number, pageSize: number): { from: number; to: number } {
  const safePage = Math.max(1, Math.floor(page || 1));
  const safeSize = Math.max(1, Math.floor(pageSize || 10));
  const from = (safePage - 1) * safeSize;
  const to = from + safeSize - 1;
  return { from, to };
}

export function clampPage(total: number, pageSize: number, page: number): number {
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  return Math.min(Math.max(1, page), pages);
}


