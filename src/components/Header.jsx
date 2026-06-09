import styles from "./Header.module.css";

/**
 * Barra superior com logo, busca, toggle dark/light, botão de atualizar e timestamp.
 *
 * @param {{ darkMode: boolean, onToggleDark: () => void, search: string, onSearch: (v: string) => void, onRefresh: () => void, loading: boolean, lastUpdated: Date|null }} props
 */
export function Header({ darkMode, onToggleDark, search, onSearch, onRefresh, loading, lastUpdated }) {
  const timestamp = lastUpdated
    ? lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.brand}>
        <span className={styles.logo}>🪙</span>
        <div>
          <div className={styles.name}>
            Inter<span className={styles.accent}>Coin</span>
          </div>
          <div className={styles.sub}>MERCADO CRIPTO</div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Timestamp da última atualização */}
        {timestamp && (
          <span className={styles.timestamp} title="Última atualização">
            🕐 {timestamp}
          </span>
        )}

        {/* Busca */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.search}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar moeda..."
          />
        </div>

        {/* Dark/Light */}
        <button className={styles.iconBtn} onClick={onToggleDark} title="Alternar tema">
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Atualizar */}
        <button
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={loading}
          title="Atualizar dados agora"
        >
          <span className={loading ? styles.spinning : ""}>{loading ? "⟳" : "↺"}</span>
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>
    </header>
  );
}
