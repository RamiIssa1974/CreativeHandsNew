export const asString = (v: unknown): string =>
    typeof v === "string" ? v : v == null ? "" : String(v);

export const asInt = (v: unknown): number =>
    typeof v === "number" && Number.isFinite(v) ? v : parseInt(String(v ?? ""), 10) || 0;