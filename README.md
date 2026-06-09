# 🪙 InterCoin - Rastreador de Criptomoedas

Aplicação web em **React + Vite** para monitorar preços de criptomoedas em tempo real.

## Moedas Monitoradas

- **Bitcoin** (BTC)
- **Ethereum** (ETH)
- **Solana** (SOL)
- **Tether** (USDT)

## Recursos

✅ Atualização automática a cada 60 segundos
✅ Gráficos interativos (24H, 7D, 30D, 90D, 1A)
✅ Modo escuro/claro
✅ Busca em tempo real
✅ Dados ao vivo da API CoinGecko

## Instalação & Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse: `http://localhost:5173`

### 3. Build para produção
```bash
npm run build
```

## Estrutura

```
src/
├── components/       # Componentes React
├── hooks/           # Custom hooks (useCoins, useChart)
├── utils/           # Constantes e utilitários
├── App.jsx          # Componente raiz
└── index.css        # Estilos globais (tema dark/light)
```

## Requisitos

- Node.js 16+
- npm ou yarn

## Apresentação

O app está **100% funcional e pronto para apresentação**:
- ✅ Sem erros no console
- ✅ Responsivo
- ✅ Dados sempre atualizados
- ✅ Interface limpa e profissional

---

Powered by CoinGecko API
