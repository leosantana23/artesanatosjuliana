// Testes do botão de WhatsApp (sem dependências). Rodar: node tests/whatsapp-color.test.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const EXPECTED_HEX = '#1a8244';
const EXPECTED_RATIO = 4.86;

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratioWithWhite = (hex) => 1.05 / (lum(hex) + 0.05);

// separa o CSS em regras { seletor, corpo, media } (um nível de @media)
function rules(src) {
  const out = [];
  const stack = [];
  let buf = '', media = null;
  for (const ch of src) {
    if (ch === '{') {
      const head = buf.trim(); buf = '';
      if (head.startsWith('@media')) { media = head; stack.push('m'); }
      else stack.push({ head, media, body: '' });
    } else if (ch === '}') {
      const top = stack.pop();
      if (top && top !== 'm') { top.body = buf.trim(); out.push(top); }
      else if (top === 'm') media = null;
      buf = '';
    } else buf += ch;
  }
  return out;
}

let failed = 0;
const t = (name, fn) => {
  try { fn(); console.log('ok   - ' + name); }
  catch (e) { failed++; console.log('FAIL - ' + name + '\n       ' + e.message); }
};
const eq = (a, b, msg) => { if (a !== b) throw new Error(`${msg || ''} esperado ${b}, obtido ${a}`); };

const all = rules(css.replace(/\/\*[\s\S]*?\*\//g, ''));
const waDefs = [...css.matchAll(/--wa\s*:\s*([^;]+);/g)].map((m) => m[1].trim());
const CSS_HEX = (waDefs[0] || '').toLowerCase(); // cor realmente lida do CSS

// ---- cor ----
t('--wa é definido uma única vez', () => eq(waDefs.length, 1, 'definições de --wa:'));
t(`--wa é ${EXPECTED_HEX} (mesmo hex para desktop e celular)`, () => eq(waDefs[0].toLowerCase(), EXPECTED_HEX));
t('o hex é verde (canal G dominante, matiz 90°-170°)', () => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(CSS_HEX.slice(i, i + 2), 16));
  if (!(g > r && g > b)) throw new Error('canal verde não domina');
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  const hue = ((b - r) / d + 2) * 60; // g é o máximo
  if (hue < 90 || hue > 170) throw new Error('matiz ' + hue);
});
t(`contraste com branco = ${EXPECTED_RATIO}`, () => eq(ratioWithWhite(CSS_HEX).toFixed(2), EXPECTED_RATIO.toFixed(2), 'razão'));
t('contraste passa de 4,5 (WCAG AA)', () => { if (ratioWithWhite(CSS_HEX) <= 4.5) throw new Error('abaixo de 4,5'); });

// ---- desktop e celular usam a mesma fonte de cor ----
const waSel = /(btn-wa|\.fab\b|\.mbar)/;
t('nenhuma regra (desktop ou @media) sobrescreve a cor do WhatsApp com outro valor', () => {
  const bad = all.filter((r) => waSel.test(r.head) && /background(-color)?\s*:/.test(r.body)
    && !/background(-color)?\s*:\s*var\(--wa\)/.test(r.body)
    && !/background\s*:\s*rgba\(255,248,250/.test(r.body)); // fundo da barra .mbar (não é o botão)
  if (bad.length) throw new Error(bad.map((b) => b.head + ' => ' + b.body.slice(0, 60)).join('\n'));
});
t('.btn-wa e .fab usam var(--wa)', () => {
  const btn = all.find((r) => r.head === '.btn-wa');
  const fab = all.find((r) => r.head === '.fab');
  if (!btn || !/var\(--wa\)/.test(btn.body)) throw new Error('.btn-wa sem var(--wa)');
  if (!fab || !/var\(--wa\)/.test(fab.body)) throw new Error('.fab sem var(--wa)');
});
t('o botão da barra do celular (.mbar) tem a classe btn-wa', () => {
  const mbar = html.match(/<div class="mbar"[\s\S]*?<\/div>/)[0];
  if (!/class="btn btn-wa"/.test(mbar)) throw new Error('sem btn-wa na .mbar');
});
t('todo uso de var(--wa) no HTML/CSS está mapeado (1 definição + 3 usos)', () => {
  const n = (css.match(/var\(--wa\)/g) || []).length + (html.match(/var\(--wa\)/g) || []).length;
  eq(n, 3, 'usos de var(--wa):'); // .btn-wa, .fab (css) + ícone inline (html)
});
t('texto dos botões é branco (#fff)', () => {
  if (!/^\.btn\{[^}]*color:#fff/m.test(css)) throw new Error('.btn sem color:#fff');
  const fab = all.find((r) => r.head === '.fab');
  if (!/color:#fff/.test(fab.body)) throw new Error('.fab sem color:#fff');
});

// ---- nada mais quebrou ----
t('chaves do CSS balanceadas', () => eq((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, 'chaves:'));
t('únicas variáveis de cor alteradas desde antes da mudança: --wa', () => {
  const base = execSync('git show c0366f9:css/style.css', { cwd: root, encoding: 'utf8' });
  const vars = (s) => Object.fromEntries([...s.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const a = vars(base), b = vars(css);
  const diff = Object.keys({ ...a, ...b }).filter((k) => a[k] !== b[k]);
  eq(diff.join(','), '--wa', 'variáveis diferentes:');
});
t('ícone #i-wa existe e é referenciado', () => {
  if (!/id="i-wa"/.test(html)) throw new Error('symbol i-wa ausente');
  if (!/<use href="#i-wa"/.test(html)) throw new Error('nenhum <use href="#i-wa">');
});
t('todos os links wa.me usam o número (12) 98117-2440', () => {
  const links = [...html.matchAll(/https:\/\/wa\.me\/(\d+)/g)].map((m) => m[1]);
  if (!links.length) throw new Error('nenhum link wa.me');
  const bad = links.filter((n) => n !== '5512981172440');
  if (bad.length) throw new Error('números diferentes: ' + bad.join(','));
});
t('links wa.me abrem em nova aba com rel=noopener', () => {
  const tags = html.match(/<a [^>]*href="https:\/\/wa\.me[^>]*>/g);
  const bad = tags.filter((a) => !/target="_blank"/.test(a) || !/rel="noopener"/.test(a));
  if (bad.length) throw new Error(bad.length + ' links sem target/rel');
});
t('arquivos referenciados no HTML existem (css, js, assets)', () => {
  const refs = [...html.matchAll(/(?:href|src)="((?:css|js|assets|data)\/[^"?#]+)/g)].map((m) => m[1]);
  const missing = [...new Set(refs)].filter((p) => !fs.existsSync(path.join(root, p)));
  if (missing.length) throw new Error('faltando: ' + missing.join(', '));
});
t('js/main.js tem sintaxe válida', () => { execSync('node --check js/main.js', { cwd: root }); });
t('data/shopee-produtos.json é JSON válido', () => { JSON.parse(fs.readFileSync(path.join(root, 'data/shopee-produtos.json'), 'utf8')); });

console.log(failed ? `\n${failed} teste(s) falharam` : '\nTodos os testes passaram');
process.exit(failed ? 1 : 0);
