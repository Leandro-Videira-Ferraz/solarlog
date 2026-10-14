<div align="center">

# ☀️ SolarLog

**Monitor dos microinversores solares Ares Watt, com histórico de geração próprio.**

Um app (PWA) que se conecta à sua conta Ares Cloud e mostra a geração ao vivo e o
histórico dia a dia.

**▶ App ao vivo:** https://leandro-videira-ferraz.github.io/solarlog/

</div>

---

## O que é

O app oficial da Ares mostra a geração dos inversores, mas não guarda um histórico
diário consultável. O SolarLog resolve isso: um app leve que fala com a mesma nuvem
Ares e organiza os dados em telas limpas, com registro da geração dia a dia.

Tudo roda localmente no seu navegador/celular. As credenciais da conta Ares ficam
só na sessão do aparelho e nunca são gravadas no código.

## Telas

- **Login** — mesmas credenciais do app Ares Cloud.
- **Painel** — potência instantânea (W), energia de hoje e total (kWh), curva de
  geração do dia e lista de inversores com status online/offline.
- **Detalhe do inversor** — por canal: potência, tensão PV, corrente, tensão da
  rede, temperatura e acumulado.
- **Histórico** — geração diária em kWh (seletor 30/90 dias), somando os inversores
  (lida da nuvem Ares, sempre completa).

Mobile-first, tema escuro grafite + âmbar, instalável como app (PWA).

## Instalar no celular

1. Abra https://leandro-videira-ferraz.github.io/solarlog/ no **Chrome** (Android).
2. Menu (⋮) → **Adicionar à tela inicial** / **Instalar app**.
3. iPhone: Safari → Compartilhar → **Adicionar à Tela de Início**.

## Como funciona (arquitetura)

```
┌─────────────┐     HTTPS       ┌──────────────────────────┐
│  PWA no      │ ──────────────▶ │  Nuvem Ares              │
│  navegador   │ ◀────────────── │  (sua conta)             │
│  (celular)   │                 │  (fonte da verdade)      │
└─────────────┘                 └──────────────────────────┘
```

- **Hospedagem:** GitHub Pages (servidores do GitHub). Não depende de nenhum PC ligado.
- **Dados ao vivo e histórico:** vêm direto da nuvem Ares para o aparelho, quando o app abre.
- **Fonte da verdade:** a própria nuvem Ares. O app é um cliente dela.

### Onde ficam os dados

| Local | Guarda | Precisa de quê ligado |
|---|---|---|
| Nuvem Ares | tudo (hoje, total, histórico) | nada seu |
| `ares.db` (SQLite, PC) | geração a cada 300s (via poller) | PC ligado + poller rodando |

> ⚠️ Projeto independente, sem vínculo oficial com a Ares Watt. Para uso pessoal,
> na sua própria conta/sistema.

## Coletor opcional (poller)

`poller.py` loga a geração num SQLite (`ares.db`) para análise no PC. **Opcional** —
o app já cobre o monitoramento. Depende do PC ligado.

```bash
ARES_USER=seu_login ARES_PASS=sua_senha python poller.py --loop 300
```

Consultar geração diária:

```bash
python -c "import sqlite3;[print(r) for r in sqlite3.connect('ares.db').execute('select * from daily_energy')]"
```

`ares.db` está no `.gitignore` (dados pessoais, não vão pro repositório).

## Desenvolvimento

Sem build. Servir a pasta `pwa/`:

```bash
python -m http.server 8777 --directory pwa
# abre http://localhost:8777
```

Ao editar `app.js`/`app.css`, suba a versão `?v=` em `index.html` e o `CACHE` em
`sw.js` (invalida o service worker).

## Deploy

GitHub Pages via GitHub Actions ([`.github/workflows/pages.yml`](.github/workflows/pages.yml)),
publicando a pasta `pwa/`. **Qualquer `git push` na `main` republica o site.**

## Estrutura

```
solarlog/
├─ pwa/                      app (HTML/CSS/JS, sem build)
│  ├─ index.html  app.js  app.css
│  ├─ sw.js  manifest.webmanifest  icon.svg
├─ poller.py  schema.sql    coletor SQLite opcional
├─ PRODUCT.md  DESIGN.md    produto e sistema de design
└─ .github/workflows/pages.yml
```

## Roadmap

- [x] Histórico lendo direto da nuvem Ares → sempre completo, sem depender de PC/app aberto.
- [ ] Botão de atualizar automático no painel.
- [ ] Exportar histórico (CSV).

## Licença

Uso pessoal.
