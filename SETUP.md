# 🚀 Como Rodar o InterCoin

## ⚡ OPÇÃO 1: Apresentação Rápida (Sem Node.js necessário)

Se você não tem Node.js instalado e quer rodar **agora** para apresentação:

1. Abra o arquivo **`standalone.html`** direto no navegador
2. Pronto! O app funciona 100% offline e se atualiza a cada 60 segundos

**Vantagem**: Nenhuma instalação, apenas abra e use.

---

## 💻 OPÇÃO 2: Desenvolvimento Full (Com Hot Reload)

Se você tem **Node.js 16+** e quer a experiência completa:

### Passo 1: Instalar dependências
```bash
npm install
```

### Passo 2: Rodar em desenvolvimento
```bash
npm run dev
```

Você verá:
```
  VITE v5.4.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

Abra `http://localhost:5173` no navegador.

**Vantagens**: Hot reload, gráficos interativos (recharts), melhor performance.

### Passo 3: Build para produção (opcional)
```bash
npm run build
```

Isto gera a pasta `dist/` pronta para deploy.

---

## ✅ Checklist de Apresentação

- [x] **Sem erros de console** - Código limpo e otimizado
- [x] **Dados ao vivo** - Atualiza a cada 60 segundos automaticamente
- [x] **4 moedas principais** - Bitcoin, Ethereum, Solana, Tether
- [x] **Gráficos interativos** - 5 períodos (24H, 7D, 30D, 90D, 1A)
- [x] **Tema dark profissional** - Design moderno e clean
- [x] **Responsivo** - Funciona em desktop, tablet e mobile
- [x] **2 opções de launch** - Standalone HTML ou React com Vite

---

## 🎯 Qual usar para apresentar?

| Situação | Recomendação |
|----------|--------------|
| Sem Node.js instalado | Use `standalone.html` |
| Com Node.js e quer hot reload | Use `npm run dev` |
| Quer mostrar estrutura profissional | Use `npm run dev` + explique o React |
| Quer máxima performance | Build com `npm run build` |

---

## 🐛 Se der erro:

### "Command not found: npm"
→ Você não tem Node.js. [Baixe aqui](https://nodejs.org/) e instale.

### "Porta 5173 já está em uso"
→ Mude a porta:
```bash
npm run dev -- --port 3000
```

### Página branca ao abrir localhost:5173
→ Espere 5 segundos (Vite está compilando) ou abra o console (F12) para ver erros.

### Dados não aparecem
→ Verifique internet e permissões CORS (devem estar OK com CoinGecko API pública).

---

## 📊 Funcionalidades incluídas

✅ Atualização automática de preços (60s)
✅ Busca em tempo real
✅ Ordenação por coluna
✅ Modo escuro/claro
✅ Gráficos com 5 períodos diferentes
✅ Estatísticas completas (market cap, volume, range 24h)
✅ Timestamp da última atualização
✅ Animações suaves

---

**Pronto para apresentar!** 🎉
