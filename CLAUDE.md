# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é

Landing page estática da "Artesanatos Juliana" (artesã de feltro, São José dos Campos-SP). Funciona como hub que distribui o tráfego para Shopee, WhatsApp e Instagram — não há checkout nem backend. Todo o texto da página é escrito em primeira pessoa (a Juliana falando), em português do Brasil.

## Comandos

Não há build, bundler, gerenciador de pacotes, linter nem testes. Basta abrir `index.html` no navegador (ou servir a pasta com qualquer servidor estático). Acrescentar `?static` à URL desliga todas as animações (mesmo efeito de `prefers-reduced-motion`), útil para conferir o layout.

## Arquitetura

Três arquivos fazem a página: [index.html](index.html) (conteúdo e marcação), [css/style.css](css/style.css) e [js/main.js](js/main.js) (um único IIFE, sem dependências, seções numeradas no cabeçalho do arquivo). Fonte externa só do Google Fonts (Lora e Nunito).

- **Sem renderização por dados**: os cards da vitrine, preços e links da Shopee estão escritos à mão no HTML. [data/shopee-produtos.json](data/shopee-produtos.json) é só uma referência coletada da loja (64 produtos, ids, preços, URLs) para consulta ao editar cards; nada o lê em tempo de execução.
- **Vitrine** (`#grid .card`): cada card tem `data-cat` com categorias separadas por espaço (`natal`, `bebe`, `presente`); os chips de filtro (`data-filter`) e links `data-filter-link` usam esses valores. A foto ampliada (`<dialog id="lb">`) é montada lendo `img`, `h3` e `a.go` do próprio card, então a estrutura do card precisa ser mantida.
- **Modo celular x computador**: a página é mobile-first com um corte em 700px. `.desk-only` some no celular (cards extras, "Como comprar", FAQ, pontos da foto interativa) e `.mobile-only` só aparece nele; a barra fixa `#mbar` é do celular. Ao mexer em conteúdo, decida em qual modo ele deve aparecer.
- **Guirlanda de família** (`#familia`): foto interativa com pontos `.hot` (posição via `left/top` inline) e o montador de pedido, que gera o link `wa.me/5512981172440?text=...` com a mensagem codificada a partir do estado (adultos, crianças, pets, frase, nome). É a única peça sob medida; as demais aceitam só sugestões genéricas.
- **Animações**: tudo passa por `reduce` (reduced-motion ou `?static`) e por `IntersectionObserver` com fallback (`hasIO`); elementos com `.reveal` ganham `.in` ao entrar na tela. Novas animações devem respeitar os dois.
- **Medição**: cliques em links Shopee/WhatsApp/Instagram disparam `track('clique_canal', ...)`, que só envia para Plausible/GA/dataLayer se algum estiver instalado na página (nenhum está).

## Pontos de atenção

- `og:image` (e demais URLs absolutas) em [index.html](index.html) usam o placeholder `https://SEU-DOMINIO`, a trocar quando a página for publicada.
- O contador de anos (`#anos`, desde 2012) e o ano do rodapé são calculados no JS; a contagem para o Natal só aparece a menos de 120 dias.
- Várias fotos em `assets/` (todas `.webp`, exceto `og-image.jpg` e `favicon.png`) já tiveram marca d'água de IA; confirmar que são fotos reais antes de usar novas.
- Não expor nomes completos nem ids de pedido nas avaliações.
