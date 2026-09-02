export type MeasurableProduct = {
  c: string;
  n: string;
};

function parseFraction(numerator: number, denominator: number): number {
  if (denominator === 0) return numerator;
  return numerator / denominator;
}

/**
 * Converte tokens do cadastro para polegadas decimais.
 * Ex.: 5/8 → 0.625 · 1.1/4 → 1.25 · 2 → 2
 */
export function parseInchToken(token: string): number | null {
  const value = token.trim().replace(",", ".");
  if (!value) return null;

  const mixed = value.match(/^(\d+)\.(\d+)\/(\d+)$/);
  if (mixed) {
    return (
      Number(mixed[1]) +
      parseFraction(Number(mixed[2]), Number(mixed[3]))
    );
  }

  const fraction = value.match(/^(\d+)\/(\d+)$/);
  if (fraction) {
    return parseFraction(Number(fraction[1]), Number(fraction[2]));
  }

  const numeric = Number(value);
  if (!Number.isNaN(numeric)) return numeric;

  return null;
}

/**
 * Extrai o comprimento principal após " X " na descrição.
 */
export function extractLengthInches(description: string): number | null {
  const match = description.match(/\sX\s+(.+)$/i);
  if (!match) return null;

  const tokens = match[1].trim().split(/\s+/);
  if (tokens.length === 0) return null;

  const first = parseInchToken(tokens[0]);
  if (first !== null) return first;

  if (tokens.length >= 2) {
    const whole = parseInchToken(tokens[0]);
    const fraction = parseInchToken(tokens[1]);
    if (whole !== null && fraction !== null && tokens[1].includes("/")) {
      return whole + fraction;
    }
  }

  return null;
}

/** Prefixo antes do comprimento (agrupa família + diâmetro). */
export function extractMeasurePrefix(description: string): string {
  return description.replace(/\sX\s+.+$/i, "").trim();
}

export function compareProductsByMeasurement(
  a: MeasurableProduct,
  b: MeasurableProduct,
): number {
  const prefixA = extractMeasurePrefix(a.n);
  const prefixB = extractMeasurePrefix(b.n);
  const prefixCmp = prefixA.localeCompare(prefixB, "pt-BR");
  if (prefixCmp !== 0) return prefixCmp;

  const lengthA = extractLengthInches(a.n) ?? Number.POSITIVE_INFINITY;
  const lengthB = extractLengthInches(b.n) ?? Number.POSITIVE_INFINITY;
  if (lengthA !== lengthB) return lengthA - lengthB;

  return a.c.localeCompare(b.c, undefined, { numeric: true });
}

export function sortProductsByMeasurement<T extends MeasurableProduct>(
  products: T[],
): T[] {
  return [...products].sort(compareProductsByMeasurement);
}
