#!/usr/bin/env node
// Igarassu Ordinário — gera as inserções (PNG) a partir de pedidos em JSON.
//
//   node insercoes/gerar.js insercoes/pedidos/2026-11-23-afogamento.json
//   node insercoes/gerar.js pedido1.json pedido2.json --saida insercoes/saida
//   node insercoes/gerar.js --exemplos      (gera o catálogo com todos os modelos)
//   node insercoes/gerar.js --listar        (lista os modelos e seus campos)
//
// Um pedido é um objeto { "modelo": "feed-noticia", ...campos } ou uma lista deles.
// Fotos e logos podem ser caminhos (relativos ao JSON) ou URLs.

const fs = require('fs');
const path = require('path');
const { modelos } = require('./modelos');

const RAIZ = __dirname;
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };

function cssBase() {
  const pesos = [500, 600, 700, 800, 900];
  const fontes = pesos.map((p) => {
    const b64 = fs.readFileSync(path.join(RAIZ, 'fontes', `montserrat-latin-${p}-normal.woff2`)).toString('base64');
    return `@font-face{font-family:'Montserrat';font-weight:${p};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
  }).join('\n');
  return fontes + '\n' + fs.readFileSync(path.join(RAIZ, 'base.css'), 'utf8');
}

function imagem(valor, baseDir) {
  if (!valor || /^(https?:|data:)/.test(valor)) return valor;
  const arq = path.resolve(baseDir, valor);
  if (!fs.existsSync(arq)) throw new Error(`imagem não encontrada: ${arq}`);
  const tipo = MIME[path.extname(arq).toLowerCase()] || 'image/png';
  return `data:${tipo};base64,${fs.readFileSync(arq).toString('base64')}`;
}

const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);

// Reduz a fonte de cada .ajusta até o texto caber na caixa
function ajustar() {
  document.querySelectorAll('.ajusta').forEach((el) => {
    const min = Number(el.dataset.min || 12);
    let t = parseFloat(getComputedStyle(el).fontSize);
    // folga de ~15% da fonte: acentos (Á, Ç) desenham um pouco fora da caixa sem cortar nada
    const estoura = () => el.scrollHeight > el.clientHeight + Math.max(2, t * 0.15) || el.scrollWidth > el.clientWidth + 2;
    while (estoura() && t > min) { t -= 1; el.style.fontSize = t + 'px'; }
    if (estoura()) el.dataset.estourou = '1';
  });
  return [...document.querySelectorAll('[data-estourou]')].map((e) => e.textContent.slice(0, 60));
}

async function gerar(pedidos, { saida, jpg }) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const base = cssBase();
  const feitos = [];
  try {
    for (const { pedido, baseDir } of pedidos) {
      const m = modelos[pedido.modelo];
      if (!m) throw new Error(`modelo desconhecido: "${pedido.modelo}". Use --listar.`);
      const faltando = (m.obrigatorios || []).filter((c) => pedido[c] == null || pedido[c] === '');
      if (faltando.length) throw new Error(`${pedido.modelo}: faltam os campos ${faltando.join(', ')}`);
      const d = { ...pedido, foto: imagem(pedido.foto, baseDir), logo: imagem(pedido.logo, baseDir) };
      let paginas = m.render(d);
      if (!Array.isArray(paginas)) paginas = [paginas];
      const nomeBase = pedido.arquivo || `${pedido.modelo}${pedido.titulo || pedido.anunciante ? '-' + slug(pedido.titulo || pedido.anunciante) : ''}`;
      const escala = pedido.escala || m.escala || 1;
      for (let i = 0; i < paginas.length; i++) {
        const p = typeof paginas[i] === 'string' ? { html: paginas[i] } : paginas[i];
        const sufixo = p.sufixo ? `-${p.sufixo}` : paginas.length > 1 ? `-${String(i + 1).padStart(2, '0')}` : '';
        const arq = path.join(saida, `${nomeBase}${sufixo}.${jpg ? 'jpg' : 'png'}`);
        const page = await browser.newPage({ viewport: { width: m.largura, height: m.altura }, deviceScaleFactor: escala });
        await page.setContent(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${base}</style></head><body>${p.html}</body></html>`, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const estouros = await page.evaluate(ajustar);
        await page.screenshot({ path: arq, type: jpg ? 'jpeg' : 'png', quality: jpg ? 92 : undefined });
        await page.close();
        if (estouros.length) console.warn(`  ⚠ texto longo demais em ${path.basename(arq)}: "${estouros[0]}…" — encurte o texto`);
        console.log(`✓ ${path.relative(process.cwd(), arq)}  (${m.largura * escala}×${m.altura * escala})`);
        feitos.push(arq);
      }
    }
  } finally {
    await browser.close();
  }
  return feitos;
}

function lerPedidos(arquivos) {
  const out = [];
  for (const a of arquivos) {
    const json = JSON.parse(fs.readFileSync(a, 'utf8'));
    for (const pedido of Array.isArray(json) ? json : [json]) out.push({ pedido, baseDir: path.dirname(path.resolve(a)) });
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const opt = { saida: path.join(RAIZ, 'saida'), jpg: args.includes('--jpg') };
  const iSaida = args.indexOf('--saida');
  if (iSaida >= 0) opt.saida = path.resolve(args[iSaida + 1]);

  if (args.includes('--listar')) {
    for (const [id, m] of Object.entries(modelos)) {
      console.log(`\n${id}  —  ${m.nome}  [${m.largura}×${m.altura}${m.escala ? ` @${m.escala}x` : ''}]`);
      for (const [c, desc] of Object.entries(m.campos || {})) console.log(`   ${(m.obrigatorios || []).includes(c) ? '*' : ' '} ${c}: ${desc}`);
    }
    console.log('\n* = obrigatório');
    return;
  }

  let arquivos = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--saida');
  if (args.includes('--exemplos')) {
    const dir = path.join(RAIZ, 'exemplos');
    arquivos = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => path.join(dir, f));
    if (iSaida < 0) opt.saida = path.join(RAIZ, 'catalogo');
  }
  if (!arquivos.length) {
    console.log('Uso: node insercoes/gerar.js pedido.json [...] [--saida pasta] [--jpg]\n     node insercoes/gerar.js --listar | --exemplos');
    process.exit(1);
  }
  fs.mkdirSync(opt.saida, { recursive: true });
  await gerar(lerPedidos(arquivos), opt);
}

main().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
