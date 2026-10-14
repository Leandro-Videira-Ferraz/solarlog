# PRODUCT.md — SolarLog (PWA monitor Ares)

PWA pessoal de monitoramento de microinversores solares Ares Watt. Conecta à conta
Ares Cloud do usuário e mostra geração ao vivo e histórico diário em telas limpas.

## Usuário
Dono de sistema solar residencial (2 microinversores, 4 canais cada). Consulta
geração pelo celular, de dia (sob sol) e de noite. Não é técnico de campo; quer
ver quanto gerou e se os inversores estão online.

## Jobs
- Ver potência instantânea somada (W) agora.
- Ver energia do dia e total acumulado (kWh).
- Ver curva de geração do dia.
- Ver status de cada inversor/canal (online, potência, tensão, temperatura).
- Ver histórico de geração diária (kWh/dia, soma dos inversores).

## Verdade técnica
- Dados vêm da nuvem Ares, chamada direto do navegador com o token da sessão.
- Histórico diário vem pronto da nuvem (Wh/dia por inversor). Sem backend próprio.
- Detalhes da integração ficam fora do repositório (nota local, não versionada).

## Plataforma
PWA mobile-first instalável (manifest + service worker). Pt-BR.

## Marca
Mundo visual: painel solar, fundo escuro grafite, acento âmbar/dourado (sol).
Instrumento técnico elegante, números grandes. (Decisão do usuário, nova sessão.)

## Restrições
- Credenciais nunca em texto no código; só em memória/sessão do navegador.
- Sem claims inventados. Só dados reais da API.
