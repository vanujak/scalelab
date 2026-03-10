export function cacheHitRate(totalRequests: number, cacheableRequests: number) {
  if (totalRequests === 0) {
    return 0;
  }

  return Number(((cacheableRequests / totalRequests) * 100).toFixed(1));
}
