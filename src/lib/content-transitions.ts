/** The next explicitly scheduled content change; no periodic polling interval. */
export function secondsUntilTransition(timestamps: readonly number[], now = Date.now()): number | false {
  const future = timestamps.filter(timestamp => Number.isFinite(timestamp) && timestamp > now);
  return future.length ? Math.max(1, Math.ceil((Math.min(...future) - now) / 1000)) : false;
}

export function promotionIsActive(promotion: { startsAt?: string; endsAt?: string }, now = Date.now()): boolean {
  return (!promotion.startsAt || Date.parse(promotion.startsAt) <= now) &&
    (!promotion.endsAt || Date.parse(promotion.endsAt) >= now);
}
