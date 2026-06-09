import { useState, useCallback } from "react";
import { API_BASE, VS_CURRENCY } from "../utils/constants";

/**
 * Hook que busca o histórico de preços de uma moeda.
 * Retorna { chartData, loading, error, fetchChart }.
 */
export function useChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const fetchChart = useCallback(async (coinId, days) => {
    setLoading(true);
    setError(null);
    setChartData([]);

    let tentativas = 0;
    const maxTentativas = 3;
    let ultimoErro = null;

    while (tentativas < maxTentativas) {
      try {
        tentativas++;
        const url =
          `${API_BASE}/coins/${coinId}/market_chart` +
          `?vs_currency=${VS_CURRENCY}` +
          `&days=${days}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const mapped = (data.prices || []).map(([ts, price]) => ({ time: ts, price }));
        setChartData(mapped);
        setError(null);
        setLoading(false);
        return;

      } catch (e) {
        ultimoErro = e.message;
        console.warn(`Tentativa ${tentativas} falhou:`, e.message);

        if (tentativas < maxTentativas) {
          await new Promise(resolve => setTimeout(resolve, 1000 * tentativas));
        }
      }
    }

    setError(ultimoErro || "Falha ao carregar gráfico");
    setChartData([]);
    setLoading(false);
  }, []);

  return { chartData, loading, error, fetchChart };
}
