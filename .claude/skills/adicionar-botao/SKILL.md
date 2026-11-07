---
name: adicionar-botao
description: Adiciona e confere a funcionalidade do botão criado (direcionamento). Utilizar quando o usuário pedir para criar um botão e que teste sua funcionalidade (se direciona para o local pedido por ele).
---

# Adicionar botão à landing page
Insere um botão na seção que o usuário pedir, como os que direcionam para o instagram, por exemplo.

## Passos

1. **Receber os dados**
   Peça ou identifique: seção de inserção do botão e local de direcionamento. Se faltar algo, peça para o usuário.
2. **Definir design**
   - Utilize a paleta de cores padrão da página HTML
   - Insira, se existir, a logo do site/app que será o fim da ação
   - Monte o design do botão com base nos outros existentes na página.

3. **Inserir no lugar certo**
   Adicione dentro da seção pedida pelo usuário. Não mexa em `js/main.js` nem no CSS.

4. **Testar o direcionamento**
   - Confira o `href` do botão:
     - WhatsApp: `https://wa.me/5512981172440`
     - Instagram: `https://instagram.com/artesanatosjuliana`
     - Shopee: `https://shopee.com.br/artesanatosjuliana`
     - Seção interna: `#id` que exista de fato no `index.html`
   - Em links externos, use `target="_blank"` e `rel="noopener"`.
   - Abra a página no navegador, clique no botão e confirme que chega ao destino pedido pelo usuário.
   - Confira que o HTML continua válido (tags fechadas).

5. **Commitar**
   Faça o commit ao final da tarefa, sem push.
