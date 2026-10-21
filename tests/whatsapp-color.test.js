// Verifica que o botão de WhatsApp tem a mesma cor do commit c0366f9. Rodar: node tests/whatsapp-color.test.js
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css/style.css'), 'utf8');
const EXPECTED_HEX = '#a8244b'; // --rose-deep, valor de --wa em c0366f9

const vars = Object.fromEntries([...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const resolve = (v, depth = 0) => {
  const m = depth < 5 && /^var\((--[\w-]+)\)$/.exec(v);
  return m ? resolve(vars[m[1]] || '', depth + 1) : v;
};
const hex = resolve(vars['--wa'] || '').toLowerCase();

console.log('--wa resolvido: ' + hex);
if (hex !== EXPECTED_HEX) { console.log(`FAIL - esperado ${EXPECTED_HEX}`); process.exit(1); }
console.log('ok   - cor do botão de WhatsApp igual à de c0366f9');
