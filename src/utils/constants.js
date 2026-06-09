/** Base URL da API pública do InterCoin */
export const API_BASE = "https://api.coingecko.com/api/v3";

/** Moeda de referência */
export const VS_CURRENCY = "usd";

/** IDs exatos das moedas exibidas na listagem */
export const COIN_IDS = ["bitcoin", "ethereum", "solana", "tether"];

/**
 * Períodos disponíveis para o gráfico.
 * @type {{ label: string, days: number }[]}
 */
export const PERIODS = [
  { label: "24H", days: 1 },
  { label: "7D",  days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1A",  days: 365 },
];
