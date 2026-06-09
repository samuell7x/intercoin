import { useState, useCallback } from "react";
import { API_BASE, VS_CURRENCY, COIN_IDS } from "../utils/constants";

/**
 * Hook que busca apenas as moedas definidas em COIN_IDS do InterCoin.
 * Retorna { coins, loading, error, refetch }.
 */
export function useCoins() {
  const [coins, setCoins]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    let tentativas = 0;
    const maxTentativas = 3;
    let ultimoErro = null;

    while (tentativas < maxTentativas) {
      try {
        tentativas++;
        const ids = COIN_IDS.join(",");
        const url =
          `${API_BASE}/coins/markets` +
          `?vs_currency=${VS_CURRENCY}` +
          `&ids=${ids}` +
          `&order=market_cap_desc` +
          `&sparkline=true` +
          `&price_change_percentage=1h,24h,7d`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout 10s

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setCoins(data);
        setError(null);
        setLoading(false);
        return; // Sucesso!

      } catch (e) {
        ultimoErro = e.message;
        console.warn(`Tentativa ${tentativas} falhou:`, e.message);
        
        if (tentativas < maxTentativas) {
          // Espera um pouco antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000 * tentativas));
        }
      }
    }

    // Falhou todas as tentativas
    setError(ultimoErro || "Falha ao conectar à API");
    setCoins([]);
    setLoading(false);
  }, []);

  return { coins, loading, error, refetch };
}
