// Shared formatting helpers for public + admin UI.

export function formatPKR(amount: number | null | undefined): string {
  const n = Number(amount) || 0;
  return `PKR ${n.toLocaleString('en-PK')}`;
}

export type PricingTier = { name: string; blurb?: string; price: number; is_popular?: boolean };
export type ItineraryDay = { day_no?: number; day?: number; title?: string; description?: string; activities?: string[] };

// Parse a JSON array of objects (hotels, videos, etc.). Returns [] on any failure.
export function parseJsonObjects<T = Record<string, unknown>>(value?: string | null): T[] {
  if (!value) return [];
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

// Parse the pricing_tiers JSON column into typed tiers (sorted by price ascending).
export function parseTiers(value?: string | null): PricingTier[] {
  if (!value) return [];
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((t) => t && (t.name || t.price != null))
      .map((t) => ({ name: String(t.name || 'Standard'), blurb: t.blurb, price: Number(t.price) || 0, is_popular: !!t.is_popular }));
  } catch {
    return [];
  }
}

// Parse a structured itinerary (itinerary_json). Falls back to plain-text lines if given legacy text.
export function parseItineraryDays(jsonValue?: string | null, textValue?: string | null): ItineraryDay[] {
  if (jsonValue) {
    try {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === 'object') return parsed as ItineraryDay[];
    } catch {
      // fall through
    }
  }
  if (textValue && textValue.trim()) {
    return textValue
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        const [title, ...rest] = line.split(/[:–-]/);
        return { day_no: i + 1, title: rest.length ? title.trim() : `Day ${i + 1}`, description: rest.length ? rest.join('-').trim() : line };
      });
  }
  return [];
}

// The lowest tier price, or 0.
export function lowestTierPrice(tiers: PricingTier[]): number {
  if (!tiers.length) return 0;
  return Math.min(...tiers.map((t) => t.price).filter((p) => p > 0));
}

// Parse a JSON array/object column that may be null, a JSON string, or already parsed.
export function parseJsonArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Fall back to newline / comma separated text.
      return value
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}
