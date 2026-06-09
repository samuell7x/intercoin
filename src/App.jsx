import { useState, useEffect, useCallback } from "react";
import { Header }    from "./components/Header";
import { CoinTable } from "./components/CoinTable";
import { CoinModal } from "./components/CoinModal";
import { useCoins }  from "./hooks/useCoins";
import { useChart }  from "./hooks/useChart";
import { PERIODS }   from "./utils/constants";
import styles        from "./App.module.css";

/**
 * Componente raiz da aplicação.
 * Orquestra estado global: tema, busca, ordenação, moeda selecionada.
 */
export default function App() {
  // ── Tema ──
  const [darkMode, setDarkMode] = useState(true);

  // Aplica classe no <html> para as CSS variables de tema
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  // ── Listagem ──
  const { coins, loading, error, refetch } = useCoins();
  const [lastUpdated, setLastUpdated] = useState(null);

  // Wrapper que atualiza o timestamp após cada fetch bem-sucedido
  const refresh = useCallback(async () => {
    await refetch();
    setLastUpdated(new Date());
  }, [refetch]);

  // Carrega ao montar e auto-atualiza a cada 60 segundos
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  // ── Busca e ordenação ──
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState("market_cap_rank");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = useCallback((key) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return key;
      }
      setSortDir("desc");
      return key;
    });
  }, []);

  // Filtra e ordena antes de passar para a tabela
  const filteredCoins = coins
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const va = a[sortKey] ?? 0;
      const vb = b[sortKey] ?? 0;
      return sortDir === "asc" ? va - vb : vb - va;
    });

  // ── Modal / gráfico ──
  const [selectedCoin, setSelectedCoin]   = useState(null);
  const [activePeriod, setActivePeriod]   = useState(PERIODS[0]);
  const { chartData, loading: chartLoading, error: chartError, fetchChart } = useChart();

  const openCoin = useCallback((coin) => {
    setSelectedCoin(coin);
    setActivePeriod(PERIODS[0]);
    fetchChart(coin.id, PERIODS[0].days);
  }, [fetchChart]);

  const changePeriod = useCallback((period) => {
    setActivePeriod(period);
    if (selectedCoin) fetchChart(selectedCoin.id, period.days);
  }, [selectedCoin, fetchChart]);

  const retryChart = useCallback(() => {
    if (selectedCoin) fetchChart(selectedCoin.id, activePeriod.days);
  }, [selectedCoin, activePeriod, fetchChart]);

  // ── Render ──
  return (
    <div className={styles.app}>
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        search={search}
        onSearch={setSearch}
        onRefresh={refresh}
        loading={loading}
        lastUpdated={lastUpdated}
      />

      <main className={styles.main}>
        <CoinTable
          coins={filteredCoins}
          loading={loading}
          error={error}
          search={search}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onSelectCoin={openCoin}
        />

        <p className={styles.footer}>
          Dados fornecidos pelo InterCoin •
          Clique em qualquer moeda para ver o gráfico
        </p>
      </main>

      {selectedCoin && (
        <CoinModal
          coin={selectedCoin}
          chartData={chartData}
          chartLoading={chartLoading}
          chartError={chartError}
          activePeriod={activePeriod}
          onChangePeriod={changePeriod}
          onRetry={retryChart}
          onClose={() => setSelectedCoin(null)}
        />
      )}
    </div>
  );
}
