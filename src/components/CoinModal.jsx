import { useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { PERIODS } from "../utils/constants";
import { fmtUSD, fmtDate } from "../utils/format";
import styles from "./CoinModal.module.css";

// ── Tooltip customizado do gráfico ────────────────────────────────────────────

function ChartTooltip({ active, payload, days }) {
  if (!active || !payload?.length) return null;
  const { time, price } = payload[0].payload;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDate}>{fmtDate(time, days)}</div>
      <div className={styles.tooltipPrice}>{fmtUSD(price)}</div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

/**
 * Modal exibindo gráfico de preço e estatísticas de uma moeda.
 *
 * @param {{
 *   coin: object,
 *   chartData: { time: number, price: number }[],
 *   chartLoading: boolean,
 *   chartError: string|null,
 *   activePeriod: { label: string, days: number },
 *   onChangePeriod: (period: object) => void,
 *   onRetry: () => void,
 *   onClose: () => void,
 * }} props
 */
export function CoinModal({
  coin,
  chartData,
  chartLoading,
  chartError,
  activePeriod,
  onChangePeriod,
  onRetry,
  onClose,
}) {
  const pct24h = coin.price_change_percentage_24h ?? 0;
  const up24h  = pct24h >= 0;

  // Valores extremos do gráfico
  const chartMin      = chartData.length ? Math.min(...chartData.map((d) => d.price)) : 0;
  const chartMax      = chartData.length ? Math.max(...chartData.map((d) => d.price)) : 0;
  const chartPositive = chartData.length >= 2
    ? chartData[chartData.length - 1].price >= chartData[0].price
    : true;

  const strokeColor = chartPositive ? "var(--green)" : "var(--red)";

  // Fechar ao clicar no overlay
  const handleOverlay = useCallback(
    (e) => { if (e.target === e.currentTarget) onClose(); },
    [onClose]
  );

  const stats = [
    { label: "Mkt Cap",     value: fmtUSD(coin.market_cap) },
    { label: "Volume 24h",  value: fmtUSD(coin.total_volume) },
    { label: "Rank",        value: `#${coin.market_cap_rank}` },
    { label: "Máx. 24h",   value: fmtUSD(coin.high_24h) },
    { label: "Mín. 24h",   value: fmtUSD(coin.low_24h) },
    {
      label: "Fornecimento",
      value: coin.circulating_supply
        ? (coin.circulating_supply / 1e6).toFixed(2) + "M"
        : "–",
    },
  ];

  return (
    <div className={styles.overlay} onClick={handleOverlay}>
      <div className={styles.modal}>

        {/* ── Cabeçalho ── */}
        <div className={styles.modalHeader}>
          <div className={styles.coinInfo}>
            <img src={coin.image} alt={coin.name} className={styles.coinLogo} />
            <div>
              <div className={styles.coinTitle}>
                {coin.name}
                <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.currentPrice}>{fmtUSD(coin.current_price)}</span>
                <span className={up24h ? styles.changeUp : styles.changeDown}>
                  <span>{up24h ? "▲" : "▼"}</span>
                  {Math.abs(pct24h).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ── Seletor de período ── */}
        <div className={styles.periods}>
          {PERIODS.map((p) => (
            <button
              key={p.label}
              className={`${styles.periodBtn} ${activePeriod.label === p.label ? styles.periodActive : ""}`}
              onClick={() => onChangePeriod(p)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── Gráfico ── */}
        <div className={styles.chartArea}>
          {chartLoading ? (
            <div className={styles.chartState}>
              <span className={styles.spinner}>⟳</span>
              <span>Carregando gráfico...</span>
            </div>
          ) : chartError ? (
            <div className={styles.chartState}>
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <span style={{ color: "var(--red)" }}>Erro: {chartError}</span>
              <button className={styles.retryBtn} onClick={onRetry}>
                Tentar novamente
              </button>
            </div>
          ) : chartData.length > 0 ? (
            <>
              <div className={styles.extremes}>
                <span>Mín: <strong style={{ color: "var(--red)" }}>{fmtUSD(chartMin)}</strong></span>
                <span>Máx: <strong style={{ color: "var(--green)" }}>{fmtUSD(chartMax)}</strong></span>
              </div>

              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={strokeColor} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="time"
                    tickFormatter={(ts) => fmtDate(ts, activePeriod.days)}
                    tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={50}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(v) => fmtUSD(v)}
                    tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    content={<ChartTooltip days={activePeriod.days} />}
                    cursor={{ stroke: "var(--text-secondary)", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      stroke: strokeColor,
                      strokeWidth: 2,
                      fill: "var(--surface)",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </>
          ) : null}
        </div>

        {/* ── Stats ── */}
        <div className={styles.statsGrid}>
          {stats.map(({ label, value }) => (
            <div key={label} className={styles.statItem}>
              <div className={styles.statLabel}>{label}</div>
              <div className={styles.statValue}>{value}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
