---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

## Direction contract

THESIS: Um painel de telemetria de usina — o app é um instrumento, não um cartão. Recusa o template hero-métrica (número grande + rótulo + stats). A leitura da geração é um mostrador de instrumento: potência instantânea tratada como leitura viva de medidor, não headline decorativa.

OWN-WORLD: Fundo grafite (#0d0f12 → painéis #15181d) separados por fios de 1px (sem sombra para dividir), não por cartões empilhados. Acento âmbar/dourado (#f5a623/#ffcc33) = energia/sol, usado só para o dado vivo e estado ativo. Verde (#36d399) = online, vermelho (#f05252) = offline/falha. Figuras em mono tabular (medição real, não enfeite). Headers de painel em small caps tracked. Doação do challenger dark-first-developer-console: fios de 1px, figuras monoespaçadas, ação destrutiva isolada.

STORY: Usuário abre, vê na hora quanto está gerando agora (W) e quanto gerou hoje/total (kWh). Entende o estado dos inversores. Confia nos números porque parecem instrumento aferido, não dashboard genérico.

FIRST VIEWPORT: Topo: mostrador de potência viva (W somado), grande, âmbar, com unidade pequena ao lado; sub-linha energia hoje + total (kWh) em mono. Abaixo, fio de 1px, curva do dia. Abaixo, lista de inversores (status online/offline, potência). Ação primária (atualizar) discreta no topo; logout isolado.

FORM: Painel de telemetria / console dark-first. Candidato pinado pelo usuário (vence o roll), índice próprio; seed key 3f307984.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
