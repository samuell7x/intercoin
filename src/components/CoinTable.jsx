import styles from "./CoinTable.module.css";
import { fmtUSD } from "../utils/format";

// ── Sub-componentes internos ──────────────────────────────────────────────────

/** Linha de skeleton enquanto carrega */
function SkeletonRow() {
  return (
    <div className={styles.skeletonRow}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={styles.skeletonCell} style={{ width: i === 2 ? "70%" : "100%" }} />
      ))}
    </div>
  );
}

/** Badge de variação percentual com cor e seta */
function ChangeBadge({ value }) {
  const up = value >= 0;
  return (
    <span className={up ? styles.changeUp : styles.changeDown}>
      <span className={styles.arrow}>{up ? "▲" : "▼"}</span>
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

/** Sparkline de 7 dias desenhada em SVG puro */
function Sparkline({ data, positive }) {
  if (!data || data.length < 2) return null;
  const W = 80, H = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * H,
  ]);
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <path
        d={d}
        fill="none"
        stroke={positive ? "var(--green)" : "var(--red)"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Cabeçalho de coluna com suporte a ordenação */
function ColHeader({ label, sortable, sortKey, activeSortKey, sortDir, onSort }) {
  const active = activeSortKey === sortKey;
  return (
    <div
      className={`${styles.colHeader} ${sortable ? styles.sortable : ""} ${active ? styles.colHeaderActive : ""}`}
      onClick={sortable ? () => onSort(sortKey) : undefined}
    >
      {label}
      {sortable && active && (
        <span className={styles.sortArrow}>{sortDir === "asc" ? "▲" : "▼"}</span>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

/**
 * Tabela de moedas com suporte a carregamento, erro, ordenação e busca.
 *
 * @param {{ coins: object[], loading: boolean, error: string|null, search: string, sortKey: string, sortDir: string, onSort: (key: string) => void, onSelectCoin: (coin: object) => void }} props
 */
export function CoinTable({ coins, loading, error, search, sortKey, sortDir, onSort, onSelectCoin }) {
  const colHeaders = [
    { label: "#",        sk: "market_cap_rank",                             sortable: true  },
    { label: "",         sk: null,                                           sortable: false },
    { label: "Moeda",    sk: null,                                           sortable: false },
    { label: "Preço",    sk: "current_price",                               sortable: true  },
    { label: "1h %",     sk: "price_change_percentage_1h_in_currency",      sortable: true  },
    { label: "24h %",    sk: "price_change_percentage_24h",                 sortable: true  },
    { label: "Vol. 24h", sk: "total_volume",                                sortable: true  },
    { label: "Mkt Cap",  sk: "market_cap",                                  sortable: true  },
    { label: "7 dias",   sk: null,                                           sortable: false },
  ];

  return (
    <div className={styles.card}>
      {/* Cabeçalho da tabela */}
      <div className={styles.tableHeader}>
        {colHeaders.map((h, i) => (
          <ColHeader
            key={i}
            label={h.label}
            sortable={h.sortable}
            sortKey={h.sk}
            activeSortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
          />
        ))}
      </div>

      {/* Linhas */}
      {loading ? (
        Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
      ) : error ? (
        <div className={styles.empty}>
          ⚠️ {error}
          <div style={{ fontSize: "0.75rem", marginTop: "0.5rem", color: "var(--text-secondary)" }}>
            Tentando reconectar automaticamente...
          </div>
        </div>
      ) : coins.length === 0 ? (
        <div className={styles.empty}>
          Nenhuma moeda encontrada para "{search}"
        </div>
      ) : (
        coins.map((coin, idx) => {
          const pct1h  = coin.price_change_percentage_1h_in_currency ?? 0;
          const pct24h = coin.price_change_percentage_24h ?? 0;
          const spark  = coin.sparkline_in_7d?.price;
          const sparkPositive = spark?.length >= 2 ? spark[spark.length - 1] >= spark[0] : true;

          return (
            <div
              key={coin.id}
              className={styles.row}
              onClick={() => onSelectCoin(coin)}
              style={{ animationDelay: `${idx * 0.03}s` }}
            >
              <div className={styles.rank}>{coin.market_cap_rank}</div>
              <img src={coin.image} alt={coin.name} className={styles.logo} />
              <div className={styles.nameCell}>
                <span className={styles.coinName}>{coin.name}</span>
                <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
              </div>
              <div className={styles.price}>{fmtUSD(coin.current_price)}</div>
              <div className={styles.change}><ChangeBadge value={pct1h} /></div>
              <div className={styles.change}><ChangeBadge value={pct24h} /></div>
              <div className={styles.muted}>{fmtUSD(coin.total_volume)}</div>
              <div className={styles.muted}>{fmtUSD(coin.market_cap)}</div>
              <div className={styles.sparkCell}>
                <Sparkline data={spark} positive={sparkPositive} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
