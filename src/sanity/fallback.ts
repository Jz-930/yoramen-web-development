export function textOr(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export function arrayOr<T>(value: T[] | null | undefined, fallback: T[]) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

export function boolOr(value: boolean | null | undefined, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}
