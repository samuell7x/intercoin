/**
 * Formata um número como string de moeda USD.
 * @param {number} n
 * @param {number} [decimals] - casas decimais fixas (opcional)
 * @returns {string}
 */
export function fmtUSD(n, decimals) {
  if (n == null) return "–";
  if (decimals !== undefined) {
    return (
      "$" +
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    );
  }
  if (Math.abs(n) >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (Math.abs(n) >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (Math.abs(n) >= 1)
    return (
      "$" +
      n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  return (
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })
  );
}

/**
 * Formata percentual com sinal.
 * @param {number} n
 * @returns {string}
 */
export function fmtPct(n) {
  if (n == null) return "–";
  return (n > 0 ? "+" : "") + n.toFixed(2) + "%";
}

/**
 * Formata timestamp para label do eixo X do gráfico.
 * @param {number} ts - timestamp em ms
 * @param {number} days - período selecionado
 * @returns {string}
 */
export function fmtDate(ts, days) {
  const d = new Date(ts);
  if (days <= 1)
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (days <= 30)
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  return d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}
