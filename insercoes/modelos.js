// Igarassu Ordinário — modelos de inserção, no padrão do Guia de identidade visual (nov/2026).
// Todas as peças de feed/story saem do mesmo "motor" (arte), que monta os blocos do guia
// na ordem: faixa · logo + selo · título · subtítulo · foto · lista · card de texto · gancho ·
// preço · ilustração · botão · rodapé (fonte + @).

const config = { logo: '' }; // o gerar.js preenche com a logo redonda (data URI)

const MARCA = {
  nome: 'Igarassu Ordinário',
  arroba: '@igarassuordinarioo',
  site: 'bruninhoscout-lab.github.io/igarassu-ordinario',
  descricao: 'Notícia, serviço e o dia a dia de Igarassu e do Litoral Norte de Pernambuco, sem enrolação.',
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// *palavra* = destaque (amarelo no verde, verde no creme) · **negrito** · quebra de linha
const fmt = (s) => esc(s)
  .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
  .replace(/\*([^*]+)\*/g, '<span class="destaque">$1</span>')
  .replace(/\n/g, '<br>');
const lista = (v) => (Array.isArray(v) ? v : v ? String(v).split('\n') : []).filter(Boolean);
const semAcento = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* ------------------------------------------------------------------ */
/* Ícones (traço branco, viewBox 24)                                   */
/* ------------------------------------------------------------------ */
const ICONES = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>',
  local: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  telefone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  whatsapp: '<path d="M4 20l1.3-4A8.5 8.5 0 1 1 8.4 19z"/><path d="M9 9.2c.3 2.4 2.6 4.8 5.3 5.3l1.2-1.4-1.9-.9-.8.8c-1-.4-1.9-1.3-2.3-2.3l.8-.8-.9-1.9z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2v.01"/>',
  dinheiro: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 9.5v.01M17.5 14.5v.01"/>',
  alerta: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.3v.01"/>',
  saude: '<path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z"/>',
  escola: '<path d="M3 9l9-4.5L21 9l-9 4.5z"/><path d="M7 11v5c3 2 7 2 10 0v-5"/>',
  obra: '<path d="M4 18h16"/><path d="M6 18v-3a6 6 0 0 1 12 0v3"/><path d="M12 9V6"/>',
  arvore: '<path d="M12 21v-6"/><path d="M12 3c4 0 6.5 3 6.5 6.5S15.5 15 12 15 5.5 13 5.5 9.5 8 3 12 3z"/>',
  musica: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  comida: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M8 4c0 2 1.5 2 1.5 4M12 4c0 2 1.5 2 1.5 4"/>',
  sacola: '<path d="M5 8h14l-1 12.5H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  artesanato: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.6-1 1.2-2-.6-1.4.3-2.5 1.7-2.5H17a3.5 3.5 0 0 0 3.5-3.5c0-5-3.8-9-8.5-9z"/><path d="M7.5 11v.01M10 7.5v.01M14.5 7.5v.01"/>',
  bola: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  agua: '<path d="M12 3.5s6.5 7 6.5 11a6.5 6.5 0 0 1-13 0c0-4 6.5-11 6.5-11z"/>',
  luz: '<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z"/>',
  onibus: '<rect x="4.5" y="3.5" width="15" height="14" rx="3"/><path d="M4.5 11h15M8 20.5v-3M16 20.5v-3M8 14.5v.01M16 14.5v.01"/>',
  carro: '<path d="M4 16v-4l2-5h12l2 5v4z"/><path d="M4 12h16M7 19v-3M17 19v-3"/>',
  pessoa: '<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20.5a7 7 0 0 1 14 0"/>',
  casa: '<path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5v10.5h12V9.5"/><path d="M10 20v-5h4v5"/>',
  igreja: '<path d="M12 2.5v4M10.3 4.2h3.4"/><path d="M8 21V10l4-3.5 4 3.5v11"/><path d="M4 21v-6.5l4-2M20 21v-6.5l-4-2M3 21h18"/><path d="M10.5 21v-3.5h3V21"/>',
  estrela: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  pintura: '<rect x="4" y="3.5" width="14" height="5.5" rx="1.5"/><path d="M18 6.2h2v5.3h-8v3"/><rect x="10.5" y="14.5" width="3" height="6.5" rx="1"/>',
  parquinho: '<path d="M6 21V6.5M6 6.5l12 14.5"/>',
  megafone: '<path d="M3.5 10v4h4l9 5V5l-9 5z"/><path d="M19.5 9.5a4 4 0 0 1 0 5"/>',
  bandeira: '<path d="M5.5 21V4"/><path d="M5.5 4.5c4-2 7 2 13 0v9c-6 2-9-2-13 0"/>',
  microfone: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7"/>',
  noticias: '<rect x="3" y="4" width="14" height="16" rx="2"/><path d="M17 8h3v10a2 2 0 0 1-2 2H6"/><path d="M7 8h6M7 12h6M7 16h4"/>',
  seguranca: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  pergunta: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 1 1 3.6 2.4c-.7.3-1.1.9-1.1 1.6v.5M12 17v.01"/>',
};
const svgIcone = (nome, cor = 'currentColor', traco = 2.4) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${traco}" stroke-linecap="round" stroke-linejoin="round">${ICONES[nome] || ICONES.check}</svg>`;

// adivinha o ícone pelo texto (pode ser forçado com { "icone": "..." })
function iconePara(texto) {
  const t = semAcento(texto);
  const regras = [
    ['whatsapp', /whats|zap/], ['instagram', /^\s*@|insta/], ['telefone', /telefone|ligue|ligacao|fone|\(\d\d\)|0800/],
    ['local', /\brua\b|\bav\.?\s|avenida|praca|local|onde|endereco|bairro/], ['calendario', /\bdia\b|data|quando|\d{1,2}\/\d{1,2}|sabado|domingo|segunda|terca|quarta|quinta|sexta/],
    ['relogio', /\bhora|\d{1,2}h\b|horario/], ['dinheiro', /r\$|preco|valor|gratis|gratuit|entrada|ingresso|conta/],
    ['saude', /saude|hospital|vacina|upa|posto|medic/], ['escola', /escola|aula|matricula|aluno|curso/],
    ['agua', /agua|compesa|aqua|chuva/], ['luz', /energia|luz|neoenergia/], ['onibus', /onibus|transporte|linha/],
    ['pintura', /pintura|pintad/], ['parquinho', /parquinho|brinquedo/], ['bola', /quadra|campo|futebol|esporte/],
    ['comida', /comida|comidinha|gastronomia|lanche/], ['musica', /musica|show|samba|forro|cultura|banda/],
    ['artesanato', /artesanato|arte\b/], ['sacola', /comercio|loja|compra|feira/], ['arvore', /arvore|jardim|plantio/],
    ['obra', /obra|reforma|pavimenta|asfalto|calcamento/], ['alerta', /atencao|cuidado|alerta|perigo/],
  ];
  for (const [nome, re] of regras) if (re.test(t)) return nome;
  return 'check';
}

/* ------------------------------------------------------------------ */
/* Ilustrações flat do pé da arte                                      */
/* ------------------------------------------------------------------ */
function coqueiro(x, base, alt, espelho = false) {
  const s = espelho ? -1 : 1;
  const tx = x + 10 * s, ty = base - alt;
  const f = (dx, dy, cx, cy) => `<path d="M${tx} ${ty} Q${tx + cx * s} ${ty + cy} ${tx + dx * s} ${ty + dy}"/>`;
  return `<g fill="none" stroke="#075C2A" stroke-linecap="round">
    <path d="M${x} ${base} C${x + 14 * s} ${base - alt * 0.45} ${x - 8 * s} ${base - alt * 0.75} ${tx} ${ty}" stroke-width="17"/>
    <g stroke-width="13">${f(-120, 50, -70, -60)}${f(-100, -40, -40, -70)}${f(10, -75, -15, -60)}${f(110, -30, 50, -65)}${f(125, 60, 85, -45)}</g>
  </g>`;
}
const chao = (w, h) => `<path d="M0 ${h - 80} Q${w * 0.3} ${h - 112} ${w * 0.55} ${h - 96} T${w} ${h - 86} V${h} H0Z" fill="#086A30"/>`;

const CENAS = {
  coqueiros: (w, h) => `${coqueiro(120, h - 40, 250)}${coqueiro(w - 110, h - 40, 220, true)}${chao(w, h)}`,
  praca: (w, h) => `${coqueiro(120, h - 40, 250)}${coqueiro(w - 110, h - 40, 220, true)}
    <g stroke-linecap="round" fill="none">
      <path d="M260 ${h - 60}V${h - 185}M300 ${h - 60}V${h - 185}M260 ${h - 185}H300M260 ${h - 145}H300M260 ${h - 105}H300" stroke="#FFCA3E" stroke-width="10"/>
      <path d="M300 ${h - 185}L410 ${h - 62}" stroke="#FFCA3E" stroke-width="12"/>
      <path d="M440 ${h - 60}L475 ${h - 210}L510 ${h - 60}" stroke="#F58D1E" stroke-width="10"/>
      <path d="M462 ${h - 200}V${h - 108}M488 ${h - 200}V${h - 108}" stroke="#fff" stroke-width="4"/>
      <path d="M455 ${h - 108}H495" stroke="#E43A2D" stroke-width="9"/>
    </g>
    <rect x="600" y="${h - 112}" width="300" height="50" rx="12" fill="#F2D49A"/>
    <path d="M640 ${h - 60}V${h - 165}M860 ${h - 60}V${h - 165}M750 ${h - 60}V${h - 140}M640 ${h - 165}H860" stroke="#fff" stroke-width="4" fill="none"/>
    <path d="M640 ${h - 150}H860" stroke="#fff" stroke-width="3" stroke-dasharray="12 8"/>
    ${chao(w, h)}`,
  feira: (w, h) => {
    const cores = ['#E43A2D', '#FFCA3E', '#25BA5C', '#FFF8E8', '#F58D1E'];
    let band = '';
    for (let i = 0; i < 17; i++) {
      const x = 20 + i * 62, y = 22 + Math.sin(((i + 0.5) / 17) * Math.PI) * 34;
      band += `<path d="M${x} ${y}h34l-17 30z" fill="${cores[i % 5]}"/>`;
    }
    const barraca = (x, cor) => `<g><rect x="${x}" y="${h - 150}" width="120" height="70" fill="#C98B4E"/>
      <rect x="${x}" y="${h - 160}" width="120" height="14" fill="#8C5A2E"/>
      <path d="M${x - 14} ${h - 215}h148l-14 50H${x}z" fill="${cor}"/><path d="M${x} ${h - 165}v-50M${x + 120} ${h - 165}v-50" stroke="#fff" stroke-width="5"/>
      <circle cx="${x + 30}" cy="${h - 170}" r="12" fill="#E43A2D"/><circle cx="${x + 60}" cy="${h - 172}" r="12" fill="#98E648"/><circle cx="${x + 90}" cy="${h - 170}" r="12" fill="#F58D1E"/></g>`;
    return `<path d="M0 22 Q${w / 2} 92 ${w} 22" stroke="#FFF8E8" stroke-width="3" fill="none"/>${band}
      ${coqueiro(70, h - 40, 200)}${barraca(170, '#E43A2D')}${barraca(370, '#FFCA3E')}${barraca(570, '#F58D1E')}
      <g fill="#fff"><path d="M790 ${h - 70}V${h - 200}l70-60 70 60V${h - 70}z"/><rect x="845" y="${h - 310}" width="30" height="60"/><rect x="852" y="${h - 335}" width="16" height="30"/><rect x="842" y="${h - 324}" width="36" height="10"/></g>
      <path d="M840 ${h - 70}v-60a20 20 0 0 1 40 0v60z" fill="#0E8D40"/><rect x="805" y="${h - 180}" width="22" height="30" rx="4" fill="#0E8D40"/><rect x="893" y="${h - 180}" width="22" height="30" rx="4" fill="#0E8D40"/>
      ${coqueiro(w - 45, h - 40, 190, true)}${chao(w, h)}`;
  },
  igreja: (w, h) => `${coqueiro(140, h - 40, 240)}
    <g fill="#fff"><path d="M360 ${h - 70}V${h - 210}l180-70 180 70V${h - 70}z"/><rect x="720" y="${h - 290}" width="100" height="220"/><path d="M712 ${h - 290}h116l-58-44z"/></g>
    <circle cx="770" cy="${h - 342}" r="9" fill="#F58D1E"/>
    <g fill="#0E8D40"><path d="M505 ${h - 70}v-80a35 35 0 0 1 70 0v80z"/><rect x="410" y="${h - 190}" width="40" height="55" rx="20"/><rect x="630" y="${h - 190}" width="40" height="55" rx="20"/><rect x="750" y="${h - 260}" width="40" height="50" rx="20"/><circle cx="540" cy="${h - 228}" r="18"/></g>
    ${coqueiro(w - 110, h - 40, 220, true)}${chao(w, h)}`,
  casario: (w, h) => {
    const casa = (x, larg, alt, parede, porta) => `<rect x="${x}" y="${h - 70 - alt}" width="${larg}" height="${alt}" fill="${parede}"/>
      <rect x="${x - 8}" y="${h - 84 - alt}" width="${larg + 16}" height="18" rx="4" fill="#FFF8E8"/>
      <rect x="${x + larg / 2 - 18}" y="${h - 140}" width="36" height="70" rx="4" fill="${porta}"/>
      <rect x="${x + 16}" y="${h - 50 - alt + 28}" width="28" height="34" rx="3" fill="${porta}"/><rect x="${x + larg - 44}" y="${h - 50 - alt + 28}" width="28" height="34" rx="3" fill="${porta}"/>`;
    return `${casa(170, 170, 160, '#FFCA3E', '#0B7A37')}${casa(355, 160, 190, '#F58D1E', '#FFF8E8')}${casa(530, 170, 150, '#FFF8E8', '#0E8D40')}${casa(715, 160, 180, '#E43A2D', '#FFF8E8')}
      ${coqueiro(90, h - 40, 220)}${coqueiro(w - 80, h - 40, 210, true)}${chao(w, h)}`;
  },
};
const cena = (nome, w, h) => (CENAS[nome] ? `<svg class="cena-svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${CENAS[nome](w, h)}</svg>` : '');

/* ------------------------------------------------------------------ */
/* Motor das artes (feed e story)                                      */
/* ------------------------------------------------------------------ */
const FORMATOS = {
  story: { largura: 1080, altura: 1920 },
  feed: { largura: 1080, altura: 1350 },
  'feed-alto': { largura: 1080, altura: 1440 },
};

function arroba(px) {
  const logo = config.logo ? `<img class="logo" src="${config.logo}" style="font-size:${Math.max(40, Math.round(px * 1.35))}px">` : '';
  return `<span class="arroba" style="font-size:${px}px">${logo}<em><b>@igarassu</b><span>ordinarioo</span></em></span>`;
}

function itemHtml(it) {
  const o = typeof it === 'string' ? { texto: it } : it;
  const texto = o.texto || o.valor || '';
  const ic = o.icone || iconePara(`${o.rotulo || ''} ${texto}`);
  return `<div class="item"><span class="ic">${svgIcone(ic)}</span><span>${o.rotulo ? `<small>${esc(o.rotulo)}</small>` : ''}${fmt(texto)}</span></div>`;
}

function arte(d, fmtNome = 'story') {
  const story = fmtNome === 'story';
  const { largura: W } = FORMATOS[fmtNome] || FORMATOS.story;
  const k = story ? 1 : 0.94; // escala de fonte do feed
  const px = (n) => Math.round(n * k);
  const pesada = !!d.pesada;
  const temFoto = !!d.foto;
  const cenaNome = d.cena === undefined ? (temFoto || pesada ? null : 'coqueiros') : d.cena;
  const cenaH = story ? 330 : 260;
  const itens = lista(d.itens);
  const estiloChamada = d.chamada_estilo || (story ? 'botao' : 'texto');
  const chamada = d.chamada === false ? '' : d.chamada || (story ? 'Confere no próximo story →' : 'Arrasta pro lado que a gente conta 👉');
  const padTopo = story ? 158 : 46;
  const padBase = story ? 140 : 44;
  const lados = story ? 70 : 60;
  const seloAlerta = d.selo_alerta || /urgente|alerta|plant[aã]o|aten[cç][aã]o/i.test(d.selo || '');

  return `<style>
.conteudo{flex:1;min-height:0;display:flex;flex-direction:column;padding:${padTopo}px ${lados}px ${padBase}px;gap:${px(22)}px}
.topo{flex:none;display:flex;align-items:center;gap:${px(16)}px}
.topo .logo{font-size:${px(78)}px}
.selo{font-size:${px(30)}px}
.titulo{flex:0 1 auto;min-height:0;font-size:${d.tamanho_titulo || px(116)}px;margin-top:${px(4)}px}
.sub{flex:none;font-size:${px(36)}px;margin-top:-${px(6)}px}
.foto{position:relative;flex:1 1 ${px(560)}px;min-height:${px(280)}px;border-radius:${px(30)}px;border:${px(7)}px solid #111;background:#0B7A37 center/cover no-repeat;box-shadow:0 ${px(10)}px 0 rgba(0,0,0,.25)}
.balao{position:absolute;top:${px(40)}px;right:${px(40)}px;max-width:62%;background:#fff;color:#111;border:${px(6)}px solid #111;border-radius:${px(28)}px;padding:${px(18)}px ${px(30)}px;font-size:${px(40)}px;font-weight:900;text-transform:uppercase;text-align:center;line-height:1.08}
.balao::after{content:'';position:absolute;left:${px(70)}px;bottom:-${px(21)}px;width:${px(34)}px;height:${px(34)}px;background:#fff;border-right:${px(6)}px solid #111;border-bottom:${px(6)}px solid #111;transform:rotate(45deg)}
.itens{flex:none;display:flex;flex-direction:column;gap:${px(16)}px}
.item{font-size:${px(36)}px;padding:${px(18)}px ${px(26)}px}
.card{flex:none;font-size:${px(30)}px;padding:${px(26)}px ${px(30)}px}
.card p+p{margin-top:.6em}
.gancho{flex:none;font-size:${px(42)}px;padding:${px(28)}px ${px(30)}px}
.preco{flex:none;display:flex;align-items:center;gap:${px(24)}px;background:var(--amarelo);color:var(--tinta);border-radius:${px(24)}px;padding:${px(18)}px ${px(30)}px;align-self:flex-start}
.preco s{font-size:${px(34)}px;font-weight:800;opacity:.7}
.preco b{font-size:${px(86)}px;font-weight:900;letter-spacing:-.02em;line-height:1}
.vazio{flex:1 1 0;min-height:0}
.cena{flex:0 0 auto;height:${cenaH}px;margin:0 -${lados}px;display:flex;align-items:flex-end;overflow:hidden}
.cena-svg{display:block}
.chamada{flex:none;display:flex;justify-content:${estiloChamada === 'botao' ? 'center' : 'flex-start'}}
.botao{font-size:${px(36)}px}
.chamada-texto{font-size:${px(32)}px}
.fonte{font-size:${px(26)}px}
</style>
<div class="peca${pesada ? ' pesada' : ''}">
  <div class="faixa"><i></i><i></i><i></i></div>
  <div class="conteudo">
    ${!cenaNome && !temFoto && !story ? '<div class="vazio"></div>' : ''}
    ${d.selo !== false ? `<div class="topo">${d.logo_topo === false || !config.logo ? '' : `<img class="logo" src="${config.logo}">`}<span class="selo${seloAlerta ? ' alerta' : ''}">${fmt(d.selo || 'Igarassu Ordinário')}</span></div>` : ''}
    ${d.titulo ? `<h1 class="titulo ajusta" data-min="${px(54)}">${fmt(d.titulo)}</h1>` : ''}
    ${d.subtitulo ? `<p class="sub">${fmt(d.subtitulo)}</p>` : ''}
    ${temFoto ? `<div class="foto" style="background-image:url('${d.foto}');${d.foto_posicao ? `background-position:${esc(d.foto_posicao)}` : ''}">${d.balao ? `<div class="balao">${fmt(d.balao)}</div>` : ''}</div>` : ''}
    ${itens.length ? `<div class="itens">${itens.map(itemHtml).join('')}</div>` : ''}
    ${d.texto ? `<div class="card">${String(d.texto).split(/\n\s*\n/).map((p) => `<p>${fmt(p)}</p>`).join('')}</div>` : ''}
    ${d.gancho ? `<div class="gancho">${fmt(d.gancho)}</div>` : ''}
    ${d.preco ? `<div class="preco">${d.preco_antigo ? `<s>${esc(d.preco_antigo)}</s>` : ''}<b>${esc(d.preco)}</b></div>` : ''}
    ${temFoto ? '' : '<div class="vazio"></div>'}
    ${cenaNome ? `<div class="cena">${cena(cenaNome, W, cenaH)}</div>` : ''}
    ${chamada ? `<div class="chamada">${estiloChamada === 'botao' ? `<span class="botao">${fmt(chamada)}</span>` : `<span class="chamada-texto">${fmt(chamada)}</span>`}</div>` : ''}
    <div class="rodape${d.fonte ? '' : ' centro'}">${d.fonte ? `<span class="fonte">Fonte: ${esc(d.fonte)}</span>` : ''}${arroba(px(34))}</div>
  </div>
</div>`;
}

/* ------------------------------------------------------------------ */
/* Presets: cada modelo preenche o motor com os padrões do guia        */
/* ------------------------------------------------------------------ */
const CAMPOS_BASE = {
  selo: 'texto do selo amarelo (ex.: BAIRRO ORDINÁRIO • AGAMENON MAGALHÃES)',
  titulo: 'título (sai em maiúsculo); *palavra* fica amarela',
  subtitulo: 'linha branca logo abaixo do título (ex.: Entregue na quarta, 18/11)',
  foto: 'arquivo ou URL (opcional) · balao: fala no balão de contorno preto',
  itens: 'lista com ícone: ["Pintura nova", ...] ou [{ "texto": "...", "icone": "parquinho", "rotulo": "..." }]',
  texto: 'card creme explicativo; *termos* ficam verdes',
  gancho: 'card amarelo com a frase de efeito',
  cena: 'ilustração do pé: coqueiros | praca | feira | igreja | casario | false',
  chamada: 'texto do botão vermelho (story) ou chamada amarela (feed); false tira',
  fonte: 'quem publicou a informação (sempre citar)',
  pesada: 'true para acidente, morte, incêndio: fundo escuro, sem ilustração',
};

const peca = (formato, obrig, extra, montar) => ({
  ...FORMATOS[formato], obrigatorios: obrig,
  campos: { ...CAMPOS_BASE, ...extra },
  render: (d) => arte(montar ? montar(d) : d, d.altura === 1440 && formato === 'feed' ? 'feed-alto' : formato),
});

const urgente = (d) => ({ pesada: true, selo: 'Urgente', ...d, selo_alerta: true });
const agenda = (d) => ({
  selo: 'Agenda ordinária', cena: 'feira', ...d,
  subtitulo: d.subtitulo || [d.dia_semana, d.data].filter(Boolean).join(', '),
  itens: d.itens || [
    d.hora && { rotulo: 'Hora', texto: d.hora, icone: 'relogio' },
    d.local && { rotulo: 'Onde', texto: d.local, icone: 'local' },
    d.entrada && { rotulo: 'Entrada', texto: d.entrada, icone: 'dinheiro' },
  ].filter(Boolean),
  texto: d.texto || d.descricao,
});
const servico = (d) => ({ selo: 'Serviço ordinário', cena: false, ...d, texto: d.texto || d.observacao });
const frase = (d) => ({
  selo: 'Falou, tá falado', cena: false, ...d,
  titulo: `“${d.frase}”`, subtitulo: `— ${[d.autor, d.cargo].filter(Boolean).join(', ')}`,
  tamanho_titulo: d.tamanho_titulo || 84,
});
const nota = (d) => ({ selo: 'Comunicado', cena: false, chamada: false, ...d, pesada: d.pesada || d.sobrio, subtitulo: d.subtitulo || d.assinatura || 'Equipe Igarassu Ordinário' });
const tuSabia = (d) => ({ selo: 'Tu sabia?', cena: false, chamada: 'Passa pro próximo story que a gente conta 👉', chamada_estilo: 'texto', ...d });
const publi = (d) => ({
  cena: d.foto ? false : 'casario', chamada: 'Chama no WhatsApp →', chamada_estilo: 'botao', ...d,
  selo: d.selo || `Publicidade • ${d.anunciante}`,
  itens: d.itens || lista(d.contato),
});
const anuncie = (d) => ({
  selo: 'Anuncie no Igarassu Ordinário', cena: 'casario', chamada: 'Chama no direct →', chamada_estilo: 'botao', ...d,
  titulo: d.titulo || 'Teu comércio na frente de *Igarassu* inteira',
  itens: d.itens || [{ texto: 'Post no feed e nos stories', icone: 'instagram' }, { texto: 'Banner no site do Igarassu Ordinário', icone: 'noticias' }, { texto: 'Divulgação de promoção e evento', icone: 'megafone' }],
});

// Sequência (carrossel no feed ou sequência de stories): selo ganha "• n/N"
function sequencia(d, formato) {
  const slides = [{ ...d, slides: undefined }, ...(d.slides || [])];
  const N = slides.length;
  return slides.map((s, i) => {
    const base = { selo: d.selo, fonte: d.fonte, pesada: d.pesada, cena: false, ...s };
    const ultimo = i === N - 1;
    if (s.chamada === undefined) {
      base.chamada = formato === 'story'
        ? (ultimo ? 'Segue a gente pra não perder nada 💚' : 'Passa pro próximo story →')
        : (ultimo ? 'Salva e manda pra quem precisa 💚' : 'Arrasta pro lado que a gente conta 👉');
      base.chamada_estilo = formato === 'story' && !ultimo ? 'botao' : 'texto';
    }
    if (i === 0 && s.cena === undefined) base.cena = d.cena;
    base.selo = `${base.selo || 'Igarassu Ordinário'} • ${i + 1}/${N}`;
    return arte(base, formato);
  });
}

// Peça "Siga / nova fase": logo grande no centro
function siga(d, formato) {
  const story = formato === 'story';
  return `<style>
.conteudo{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:${story ? 200 : 70}px 80px ${story ? 150 : 60}px;gap:${story ? 40 : 30}px}
.titulo{font-size:${story ? 104 : 88}px}
.logo-grande{font-size:${story ? 400 : 330}px;border-width:14px}
.texto{font-size:${story ? 34 : 30}px;font-weight:700;line-height:1.35;max-width:26ch}
.vazio{flex:1}
</style>
<div class="peca"><div class="faixa"><i></i><i></i><i></i></div>
<div class="conteudo">
  ${d.selo !== false ? `<span class="selo" style="font-size:30px;align-self:center">${fmt(d.selo || 'Igarassu Ordinário')}</span>` : ''}
  <h1 class="titulo">${fmt(d.titulo || 'Segue o *Igarassu Ordinário*')}</h1>
  ${config.logo ? `<img class="logo logo-grande" src="${config.logo}">` : ''}
  <p class="texto">${fmt(d.texto || MARCA.descricao)}</p>
  <div class="vazio"></div>
  ${arroba(story ? 44 : 40)}
</div></div>`;
}

/* ------------------------------------------------------------------ */
/* Banners do site, link compartilhado e capas de destaque             */
/* ------------------------------------------------------------------ */
function banner(d, tipo) {
  const cta = fmt(d.chamada || 'Saiba mais →');
  const selo = `<span class="selo">${esc(d.selo || 'Publicidade')}</span>`;
  const logo = d.logo ? `<img class="lg" src="${d.logo}">` : '';
  const comum = `.titulo{min-height:0;flex:0 1 auto}.lg{flex:none;object-fit:contain;background:#fff;border-radius:50%;border:2px solid var(--creme)}.botao{box-shadow:none}`;
  if (tipo === 'ret') {
    return `<style>${comum}.faixa{--f:4px}.c{flex:1;min-height:0;display:flex;flex-direction:column;gap:7px;padding:14px 16px 14px}
.selo{font-size:9px;padding:3px 8px}.titulo{font-size:30px}.an{font-size:12px;font-weight:800;color:var(--creme)}.botao{align-self:flex-start;font-size:13px;padding:8px 14px;margin-top:auto}
.lg{position:absolute;right:12px;bottom:12px;width:52px;height:52px}</style>
<div class="peca"><div class="faixa"><i></i><i></i><i></i></div><div class="c">${selo}${d.anunciante ? `<span class="an">${esc(d.anunciante)}</span>` : ''}
<h1 class="titulo ajusta" data-min="16">${fmt(d.titulo)}</h1><span class="botao">${cta}</span></div>${logo}</div>`;
  }
  const hor = tipo === 'hor';
  return `<style>${comum}.faixa{--f:3px}.c{flex:1;min-height:0;display:flex;align-items:center;gap:${hor ? 16 : 9}px;padding:0 ${hor ? 16 : 9}px}
.tx{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:center;gap:3px;padding:5px 0}
.titulo{font-size:${hor ? 26 : 17}px;line-height:1}.selo{font-size:${hor ? 9 : 7}px;padding:2px 7px}
.botao{font-size:${hor ? 14 : 10}px;padding:${hor ? '10px 16px' : '7px 10px'}}.lg{width:${hor ? 60 : 50}px;height:${hor ? 60 : 50}px}</style>
<div class="peca"><div class="faixa"><i></i><i></i><i></i></div><div class="c">${logo}<div class="tx">${selo}<h1 class="titulo ajusta" data-min="11">${fmt(d.titulo)}</h1></div><span class="botao">${cta}</span></div></div>`;
}

function capaDestaque(d) {
  const padrao = [
    { icone: 'noticias', nome: 'noticias' }, { icone: 'alerta', nome: 'urgente' }, { icone: 'info', nome: 'servico' },
    { icone: 'calendario', nome: 'agenda' }, { icone: 'pergunta', nome: 'tu-sabia' }, { icone: 'megafone', nome: 'anuncie' },
  ];
  return (d.itens || padrao).map((it) => ({
    sufixo: it.nome || it.icone,
    html: `<style>
.peca{background:radial-gradient(circle at 50% 50%, #D2F78A 0%, #7EE152 30%, #1DB34E 62%)}
.raios{position:absolute;inset:0}
.circ{position:absolute;left:50%;top:50%;width:620px;height:620px;margin:-310px 0 0 -310px;border-radius:50%;background:#007045;border:12px solid #fff;display:grid;place-items:center}
.circ svg{width:330px;height:330px}
.ponto{position:absolute;left:50%;top:50%;width:62px;height:62px;margin:-341px 0 0 -31px;border-radius:50%;background:#FE5E00;border:9px solid #fff}
.base{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column}
.base i{display:block;height:36px}.base i:nth-child(1){background:#FFAE01}.base i:nth-child(2){background:#FE5E00}.base i:nth-child(3){background:#FC3001}
</style>
<div class="peca">
  <svg class="raios" viewBox="0 0 1080 1920"><g fill="#fff" opacity=".13"><path d="M540 960L230 0H360Z"/><path d="M540 960L720 0H850Z"/><path d="M540 960L0 690V820Z"/><path d="M540 960L1080 690V820Z"/></g></svg>
  <div class="circ">${svgIcone(it.icone, '#fff', 2.1)}</div><div class="ponto"></div>
  <div class="base"><i></i><i></i><i></i></div>
</div>`,
  }));
}

/* ------------------------------------------------------------------ */
/* Catálogo de modelos                                                 */
/* ------------------------------------------------------------------ */
const modelos = {
  // Notícia
  'story-noticia': { nome: 'Story de notícia (padrão do guia)', grupo: 'Notícia', ...peca('story', ['titulo']) },
  'feed-noticia': { nome: 'Post de notícia no feed (1080×1350; "altura": 1440 para o alto)', grupo: 'Notícia', ...peca('feed', ['titulo']) },
  'story-urgente': { nome: 'Story urgente / notícia pesada (fundo escuro, selo vermelho)', grupo: 'Notícia', ...peca('story', ['titulo'], {}, urgente) },
  'feed-urgente': { nome: 'Feed urgente / notícia pesada', grupo: 'Notícia', ...peca('feed', ['titulo'], {}, urgente) },
  carrossel: {
    nome: 'Carrossel no feed (capa + slides, selo com "• n/N")', grupo: 'Notícia', ...FORMATOS.feed, obrigatorios: ['titulo', 'slides'],
    campos: { ...CAMPOS_BASE, slides: 'lista de slides, cada um com os mesmos campos (titulo, texto, itens, gancho, foto...)' },
    render: (d) => sequencia(d, 'feed'),
  },
  'sequencia-stories': {
    nome: 'Sequência de stories (capa + stories, selo com "• n/N")', grupo: 'Notícia', ...FORMATOS.story, obrigatorios: ['titulo', 'slides'],
    campos: { ...CAMPOS_BASE, slides: 'lista de stories com os mesmos campos' },
    render: (d) => sequencia(d, 'story'),
  },
  'story-tu-sabia': { nome: '"Tu sabia?" (foto ou ilustração com balão)', grupo: 'Quadros', ...peca('story', ['titulo'], { balao: 'fala no balão (ex.: TEM HISTÓRIA, VISSE!)' }, tuSabia) },
  'feed-tu-sabia': { nome: '"Curiosidade ordinária" no feed', grupo: 'Quadros', ...peca('feed', ['titulo'], { balao: 'fala no balão' }, (d) => tuSabia({ selo: 'Curiosidade ordinária', chamada: 'Arrasta pro lado que a gente conta 👉', ...d })) },

  // Serviço e agenda
  'story-servico': { nome: 'Serviço ordinário (utilidade pública) no story', grupo: 'Serviço', ...peca('story', ['titulo'], { itens: 'lista de { "rotulo": "Telefone", "texto": "0800 ..." }', observacao: 'card creme no fim' }, servico) },
  'feed-servico': { nome: 'Serviço ordinário no feed', grupo: 'Serviço', ...peca('feed', ['titulo'], { itens: 'lista de { "rotulo", "texto" }', observacao: 'card creme' }, servico) },
  'story-agenda': { nome: 'Agenda / evento no story', grupo: 'Agenda', ...peca('story', ['titulo'], { data: 'ex.: 29/11', dia_semana: 'ex.: Sábado', hora: '', local: '', entrada: '', descricao: 'card creme' }, agenda) },
  'feed-agenda': { nome: 'Agenda / evento no feed', grupo: 'Agenda', ...peca('feed', ['titulo'], { data: '', dia_semana: '', hora: '', local: '', entrada: '', descricao: '' }, agenda) },
  'feed-frase': { nome: 'Frase / declaração', grupo: 'Notícia', ...peca('feed', ['frase', 'autor'], { frase: 'a fala, sem aspas', autor: 'quem disse', cargo: 'opcional' }, frase) },
  'feed-nota': { nome: 'Nota / comunicado / errata ("sobrio": true para nota de pesar)', grupo: 'Institucional', ...peca('feed', ['texto'], { assinatura: 'padrão: Equipe Igarassu Ordinário', sobrio: 'true = fundo escuro' }, nota) },
  'story-nota': { nome: 'Nota / comunicado no story', grupo: 'Institucional', ...peca('story', ['texto'], { assinatura: '', sobrio: '' }, nota) },

  // Publicidade
  'publi-story': { nome: 'Publicidade de anunciante no story', grupo: 'Publicidade', ...peca('story', ['anunciante', 'titulo'], { anunciante: 'nome do comércio', contato: 'lista: WhatsApp, endereço, @', preco: 'opcional', preco_antigo: 'opcional' }, publi) },
  'publi-feed': { nome: 'Publicidade de anunciante no feed', grupo: 'Publicidade', ...peca('feed', ['anunciante', 'titulo'], { anunciante: '', contato: '', preco: '', preco_antigo: '' }, publi) },
  'publi-anuncie': { nome: 'Chamada "Anuncie aqui" (feed)', grupo: 'Publicidade', ...peca('feed', [], {}, anuncie) },
  'story-anuncie': { nome: 'Chamada "Anuncie aqui" (story)', grupo: 'Publicidade', ...peca('story', [], {}, anuncie) },
  'banner-300x250': { nome: 'Banner do site 300×250', grupo: 'Banner do site', largura: 300, altura: 250, escala: 2, obrigatorios: ['titulo'], campos: { anunciante: '', titulo: '*palavra* amarela', chamada: 'botão', logo: 'logo do anunciante (opcional)' }, render: (d) => banner(d, 'ret') },
  'banner-728x90': { nome: 'Banner do site 728×90 (computador)', grupo: 'Banner do site', largura: 728, altura: 90, escala: 2, obrigatorios: ['titulo'], campos: { titulo: '', chamada: '', logo: '' }, render: (d) => banner(d, 'hor') },
  'banner-320x100': { nome: 'Banner do site 320×100 (celular)', grupo: 'Banner do site', largura: 320, altura: 100, escala: 2, obrigatorios: ['titulo'], campos: { titulo: '', chamada: '', logo: '' }, render: (d) => banner(d, 'cel') },

  // Institucional
  'story-siga': { nome: 'Story "Siga" / nova fase (logo grande no centro)', grupo: 'Institucional', ...FORMATOS.story, obrigatorios: [], campos: { selo: '', titulo: '', texto: '' }, render: (d) => siga(d, 'story') },
  'feed-siga': { nome: 'Feed "Siga" (logo grande)', grupo: 'Institucional', ...FORMATOS.feed, obrigatorios: [], campos: { selo: '', titulo: '', texto: '' }, render: (d) => siga(d, 'feed') },
  'og-materia': {
    nome: 'Imagem de link compartilhado (WhatsApp/Facebook) 1200×630', grupo: 'Institucional', largura: 1200, altura: 630, obrigatorios: ['titulo'],
    campos: { selo: '', titulo: '', pesada: '' },
    render: (d) => `<style>.c{flex:1;min-height:0;display:flex;flex-direction:column;gap:22px;padding:44px 60px 40px}.topo{display:flex;align-items:center;gap:14px}.topo .logo{font-size:64px}.selo{font-size:24px}.titulo{flex:0 1 auto;min-height:0;font-size:80px}.vazio{flex:1}</style>
<div class="peca${d.pesada ? ' pesada' : ''}"><div class="faixa" style="--f:10px"><i></i><i></i><i></i></div><div class="c">
<div class="topo">${config.logo ? `<img class="logo" src="${config.logo}">` : ''}<span class="selo${d.pesada ? ' alerta' : ''}">${fmt(d.selo || 'Igarassu Ordinário')}</span></div>
<h1 class="titulo ajusta" data-min="40">${fmt(d.titulo)}</h1><div class="vazio"></div><div class="rodape"><span class="fonte" style="font-size:22px">${MARCA.site}</span>${arroba(30)}</div></div></div>`,
  },
  'capa-destaque': {
    nome: 'Capas dos destaques (círculo verde-escuro, ponto laranja, faixa no pé)', grupo: 'Institucional', ...FORMATOS.story, obrigatorios: [],
    campos: { itens: `lista de { "icone": "${Object.keys(ICONES).join('|')}", "nome": "arquivo" }` },
    render: capaDestaque,
  },
};

module.exports = { modelos, config, MARCA, ICONES, CENAS };
