---
name: adicionar-avaliacao
description: Adiciona uma avaliação de cliente (ex.: do Elo7 ou Shopee) à seção de avaliações do index.html, anonimizando nome e ID de pedido. Use quando o usuário pedir para incluir, inserir ou atualizar depoimentos na landing page.
---

# Adicionar avaliação à landing page

Insere um depoimento na seção `#avaliacoes` do [index.html](../../../index.html) respeitando as regras do projeto: não expor nomes completos nem IDs de pedido, e não usar fotos sem confirmar que são reais.

## Passos

1. **Receber os dados**
   Peça ou identifique: texto da avaliação, nome do cliente, produto, ano e nota. Se faltar algo, deixe de fora em vez de inventar.

2. **Anonimizar**
   - Use só o primeiro nome (ex.: "Luciana"). Se não houver nome, use "Cliente".
   - Remova qualquer ID de pedido, sobrenome, telefone ou e-mail, inclusive do texto.
   - Mantenha o texto original do cliente, corrigindo apenas erros de digitação óbvios.

3. **Confirmar fotos (se houver)**
   Fotos antigas foram enviadas com marca d'água de IA ("Dola AI"). Abra a imagem e confirme que é uma foto real antes de usá-la. Se houver dúvida, não use a foto e avise o usuário.

4. **Montar o bloco HTML**
   Siga exatamente o padrão dos `<figure class="quote">` existentes no slider `#slider`:

   ```html
   <figure class="quote"><div><div class="stars" aria-label="5 estrelas">★★★★★</div><blockquote>TEXTO</blockquote></div><figcaption><b>Nome</b> · produto · ano</figcaption></figure>
   ```

   - As três primeiras ficam visíveis no celular; as demais levam a classe `desk-only` (`class="quote desk-only"`).
   - Sem nome: `<b>Cliente</b> · produto`. Sem ano: omita o ano.

5. **Inserir no lugar certo**
   Adicione dentro de `<div class="slider" id="slider">`, mantendo as de maior impacto no início. Não mexa em `js/main.js` nem no CSS.

6. **Atualizar contagens, se necessário**
   Se o total de avaliações mudou, ajuste o número em `data-count` na seção de números (hoje "+280").

7. **Verificar e commitar**
   - Confira que o HTML continua válido (tags fechadas) e que nenhum sobrenome ou ID de pedido aparece.
   - Faça o commit ao final da tarefa, sem push.
