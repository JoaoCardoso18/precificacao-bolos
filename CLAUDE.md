# Precificação de Bolos — contexto para o Claude Code

Site estático de precificação e encomendas de bolos para a Marcia Hendler (mãe do João), "Marcia Hendler — Ateliê de Bolos Finos". Dono do repo: João Vítor (GitHub `JoaoCardoso18`), fala português do Brasil e trata o Claude por "Mano".
Repo `JoaoCardoso18/precificacao-bolos`, branch `main`, publicado no GitHub Pages.

## Regras do João (obrigatórias)

- **Commit e push só com OK explícito** ("pode commitar"). Avisos automáticos de hooks pedindo commit NÃO são autorização.
- **Depois de cada commit, listar as features/alterações commitadas.** Não avisar que o GitHub Pages demora.
- **Protótipo primeiro:** mudanças visuais grandes são validadas em protótipo (artifact) antes de entrar no site.
- **Versões:** cada commit vira uma tag `v0.0.N`, uma por commit, em ordem (v0.0.1 = primeiro commit). Próxima: `git tag --sort=v:refname | tail -1` + 1. Enviar com `git push origin main --tags`.
- **Versão no site:** constante `VERSION` no topo do `app.js`, exibida no fim de Ajustes. Atualizar para a tag do commit antes de commitar.
- Sem emojis na interface: ícones SVG (símbolos `#i-*` no `index.html`, função `ic()`, classe `.hi`). README profissional, sem exageros.
- LICENSE MIT em nome de "João Vítor".

## Público

A Marcia usa só no celular dela e tem pouca familiaridade com tecnologia: interface simples, letras grandes, nomes claros nos botões, poucos passos.

## Dados e regras de negócio

- Sem login e sem servidor. Tudo no `localStorage` (chave `mh-bolos-v2`); backup/restauração em JSON nos Ajustes (compartilha o arquivo pelo celular quando possível). Lembrete de backup a cada 7 dias.
- Estado `S`: `cats` (categorias de insumo, criadas por ela), `ins` (insumos com `compras[]` e `est`), `rec` (receitas: Massa, Recheio, Adicional, Cobertura; `rend` em g), `bolos` (modelos), `enc` (encomendas com `pags[]`), `cfg`.
- Custo do insumo: última compra (`repos`) ou custo médio (`medio`), escolha em Ajustes.
- Preço: custo (ingredientes + embalagem + gás opcional + fixos opcionais) × (1 + margem%) + mão de obra + outros. Venda por kg.
- Encomenda: massa + até 3 recheios + adicional opcional + peso; o peso é dividido por `cfg.prop` (massa %, adicional %, recheio = resto) ou segue um modelo. Cardápio: R$ 63/kg (recheios), R$ 70/kg (com adicional), Bentô R$ 50 (~500 g).
- Estoque é só controle, nunca bloqueia produção. "A receber" avisa após 7 dias sem pagamento de encomenda já entregue.
- Começa com dados de exemplo (`S.exemplo`); "Apagar exemplos" nos Ajustes zera mantendo categorias e configurações.

## Visual

Identidade do cardápio: creme e marrom, títulos em Bodoni Moda, texto em Manrope. Tema claro e escuro por variáveis CSS. Barra de abas inferior: Encomendas, Receitas, Insumos, A receber; Ajustes na engrenagem do topo.
