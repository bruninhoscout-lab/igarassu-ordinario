// Igarassu Ordinário — modelos de inserção.
// Cada modelo recebe os dados de um pedido (JSON) e devolve o HTML de uma ou mais peças.
// Medidas em pixels reais da peça (1080 de largura = post/story do Instagram).

const MARCA = {
  nome: 'Igarassu Ordinário',
  arroba: '@igarassuordinarioo',
  site: 'bruninhoscout-lab.github.io/igarassu-ordinario',
  slogan: 'Igarassu do jeito que o povo fala.',
  descricao: 'Notícia, serviço e o dia a dia de Igarassu e do Litoral Norte de Pernambuco, sem enrolação.',
};

const CATEGORIAS = {
  cidade: { rotulo: 'Cidade', classe: 'cat-cidade' },
  servico: { rotulo: 'Serviço', classe: 'cat-servico' },
  comercio: { rotulo: 'Comércio Local', classe: 'cat-comercio' },
  cultura: { rotulo: 'Cultura e Eventos', classe: 'cat-cultura' },
  seguranca: { rotulo: 'Segurança', classe: 'cat-seguranca' },
};

const semAcento = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function cat(valor, padrao = 'cidade') {
  const v = semAcento(valor);
  let chave = padrao;
  if (v) {
    if (CATEGORIAS[v]) chave = v;
    else if (v.startsWith('servi') || v.includes('utilidade')) chave = 'servico';
    else if (v.startsWith('comerc') || v.includes('negocio')) chave = 'comercio';
    else if (v.startsWith('cultura') || v.includes('evento') || v.includes('agenda')) chave = 'cultura';
    else if (v.startsWith('seguran') || v.includes('policia')) chave = 'seguranca';
    else if (v.startsWith('cidade')) chave = 'cidade';
  }
  return { chave, ...CATEGORIAS[chave] };
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// *palavra* vira destaque colorido; quebra de linha vira <br>
const fmt = (s) => esc(s).replace(/\*([^*]+)\*/g, '<span class="destaque">$1</span>').replace(/\n/g, '<br>');
const lista = (v) => (Array.isArray(v) ? v : v ? String(v).split('\n') : []).filter(Boolean);

function hoje() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Recife' }));
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
const dataDe = (d) => (d.data === false ? '' : esc(d.data || hoje()));

const marca = (px, clara = false, so_io = false) =>
  `<div class="marca${clara ? ' marca-clara' : ''}" style="font-size:${px}px"><span class="marca-io">IO</span>${so_io ? '' : `<span>${MARCA.nome}</span>`}</div>`;
const faixa = (px = 18) => `<div class="faixa" style="--faixa:${px}px"><i></i><i></i><i></i><i></i></div>`;
const foto = (url, extra = '') => `<div class="foto ${extra}" style="background-image:url('${url}')"></div>`;

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Ícones de traço (viewBox 24) para capas de destaque e detalhes
const ICONES = {
  noticias: '<rect x="3" y="4" width="14" height="16" rx="2"/><path d="M17 8h3v10a2 2 0 0 1-2 2H6"/><path d="M7 8h6M7 12h6M7 16h4"/>',
  servico: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
  agenda: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  seguranca: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  comercio: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  cultura: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  anuncie: '<path d="M3 10v4h4l9 5V5L7 10z"/><path d="M19 9a4 4 0 0 1 0 6"/>',
  cidade: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  contato: '<path d="M4 5h16v11H9l-5 4z"/>',
  urgente: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
};
const icone = (nome, px, cor = 'currentColor', traco = 1.8) =>
  `<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${traco}" stroke-linecap="round" stroke-linejoin="round">${ICONES[nome] || ICONES.noticias}</svg>`;

/* ------------------------------------------------------------------ */
/* Peças reaproveitadas                                                */
/* ------------------------------------------------------------------ */

const RODAPE_CSS = `
.rodape{flex:none;height:132px;background:var(--verde-escuro);padding:0 72px;display:flex;align-items:center;justify-content:space-between;gap:24px;color:#fff}
.rodape .cta{font-size:30px;font-weight:800;color:var(--amarelo)}
.rodape .arroba{font-size:26px;font-weight:700;opacity:.9;white-space:nowrap}`;
const rodape = (cta) => `<div class="rodape"><span class="cta">${fmt(cta)}</span><span class="arroba">${MARCA.arroba}</span></div>`;

function capaNoticia(d, { cta, contador } = {}) {
  const c = cat(d.categoria);
  const f = !!d.foto;
  return `<style>
.topo{height:128px;padding:0 72px;display:flex;align-items:center;justify-content:space-between;flex:none}
.topo .data{font-size:26px;font-weight:700;color:var(--texto-suave)}
.img{position:relative;height:480px;flex:none;background:var(--tinta)}
.img .etiqueta{position:absolute;left:72px;bottom:-24px;font-size:26px;z-index:2;box-shadow:0 6px 0 rgba(0,0,0,.08)}
.corpo{flex:1;min-height:0;padding:${f ? '62px' : '24px'} 72px 44px;display:flex;flex-direction:column;gap:30px}
.corpo>.etiqueta{font-size:28px;flex:none}
.corpo h1{flex:0 1 auto;min-height:0;font-size:${f ? 76 : 100}px;padding-left:30px;border-left:14px solid var(--cor)}
.resumo{flex:none;font-size:32px;line-height:1.45;font-weight:500;color:var(--texto-suave);display:-webkit-box;-webkit-line-clamp:${f ? 2 : 5};-webkit-box-orient:vertical;overflow:hidden}
.fonte{flex:none;margin-top:auto;font-size:22px;font-weight:700;color:var(--texto-suave);text-transform:uppercase;letter-spacing:.06em}
.contador{position:absolute;top:40px;right:72px;font-size:24px;font-weight:800;padding:8px 18px;border-radius:999px;background:var(--verde-escuro);color:#fff}
${RODAPE_CSS}
</style>
<div class="peca ${c.classe}">
  <div class="topo">${marca(34)}<span class="data">${dataDe(d)}</span></div>
  ${f ? `<div class="img">${foto(d.foto)}<span class="etiqueta">${esc(d.etiqueta || c.rotulo)}</span></div>` : ''}
  <div class="corpo">
    ${f ? '' : `<span class="etiqueta">${esc(d.etiqueta || c.rotulo)}</span>`}
    <h1 class="ajusta" data-min="44">${fmt(d.titulo)}</h1>
    ${d.resumo ? `<p class="resumo">${fmt(d.resumo)}</p>` : ''}
    ${d.fonte ? `<p class="fonte">Fonte: ${esc(d.fonte)}</p>` : ''}
  </div>
  ${rodape(d.chamada || cta || 'Resumo completo no link da bio →')}
  ${faixa(18)}
</div>`;
}

/* ------------------------------------------------------------------ */
/* Modelos                                                             */
/* ------------------------------------------------------------------ */

const modelos = {
  /* ---------------- Redes sociais: notícia ---------------- */
  'feed-noticia': {
    nome: 'Post de notícia (feed)',
    grupo: 'Notícia',
    largura: 1080, altura: 1350,
    obrigatorios: ['titulo'],
    campos: { categoria: 'cidade | servico | comercio | cultura | seguranca', titulo: 'manchete (use *palavra* para destacar)', resumo: 'texto curto (opcional)', fonte: 'veículo original (opcional)', data: 'dd/mm/aaaa (padrão: hoje; false esconde)', foto: 'arquivo ou URL (opcional)', chamada: 'texto do rodapé (padrão: Resumo completo no link da bio →)' },
    render: (d) => capaNoticia(d),
  },

  'feed-urgente': {
    nome: 'Urgente / plantão (feed)',
    grupo: 'Notícia',
    largura: 1080, altura: 1350,
    obrigatorios: ['titulo'],
    campos: { titulo: 'manchete', resumo: 'opcional', selo: 'padrão: URGENTE (ex.: AGORA, ATUALIZAÇÃO)', foto: 'opcional', fonte: 'opcional', data: 'opcional', chamada: 'opcional' },
    render(d) {
      const f = !!d.foto;
      return `<style>
.peca{background:var(--vermelho);color:#fff}
.topo{height:128px;padding:0 72px;display:flex;align-items:center;justify-content:space-between;flex:none}
.topo .data{font-size:26px;font-weight:700;opacity:.85}
.img{position:relative;height:560px;flex:none;margin:0 72px;border-radius:28px;overflow:hidden;border:6px solid #fff}
.corpo{flex:1;min-height:0;padding:${f ? '44px' : '30px'} 72px 44px;display:flex;flex-direction:column;gap:30px}
.selo{flex:none;align-self:flex-start;display:flex;align-items:center;gap:18px;background:#fff;color:var(--vermelho);font-size:42px;font-weight:900;letter-spacing:.14em;padding:14px 34px 14px 26px;border-radius:14px}
.selo i{width:22px;height:22px;border-radius:50%;background:var(--vermelho);box-shadow:0 0 0 8px rgba(217,58,43,.25)}
h1{flex:0 1 auto;min-height:0;font-size:${f ? 74 : 104}px}
.resumo{flex:none;font-size:32px;line-height:1.45;font-weight:600;opacity:.94;display:-webkit-box;-webkit-line-clamp:${f ? 2 : 5};-webkit-box-orient:vertical;overflow:hidden}
.fonte{flex:none;margin-top:auto;font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.85}
${RODAPE_CSS}
</style>
<div class="peca escuro">
  <div class="topo">${marca(34, true)}<span class="data">${dataDe(d)}</span></div>
  ${f ? `<div class="img">${foto(d.foto)}</div>` : ''}
  <div class="corpo">
    <span class="selo"><i></i>${esc(d.selo || 'Urgente').toUpperCase()}</span>
    <h1 class="ajusta" data-min="44">${fmt(d.titulo)}</h1>
    ${d.resumo ? `<p class="resumo">${fmt(d.resumo)}</p>` : ''}
    ${d.fonte ? `<p class="fonte">Fonte: ${esc(d.fonte)}</p>` : ''}
  </div>
  ${rodape(d.chamada || 'Acompanhe pelo perfil →')}
  ${faixa(18)}
</div>`;
    },
  },

  'story-noticia': {
    nome: 'Story de notícia (também serve para status do WhatsApp e capa de Reels)',
    grupo: 'Notícia',
    largura: 1080, altura: 1920,
    obrigatorios: ['titulo'],
    campos: { categoria: 'opcional', titulo: 'manchete', resumo: 'opcional', foto: 'opcional', chamada: 'padrão: Toque no link e leia o resumo', selo: 'troca a etiqueta (ex.: URGENTE)', data: 'opcional' },
    render(d) {
      const c = cat(d.categoria);
      const f = !!d.foto;
      const urgente = d.selo && semAcento(d.selo).includes('urgente');
      return `<style>
.peca{background:${urgente ? 'var(--vermelho)' : 'var(--verde-escuro)'};color:#fff}
.topo{flex:none;padding:170px 80px 0;display:flex;align-items:center;justify-content:space-between}
.topo .data{font-size:28px;font-weight:700;opacity:.8}
.img{position:relative;flex:none;height:620px;margin:48px 80px 0;border-radius:32px;overflow:hidden}
.corpo{flex:1;min-height:0;padding:${f ? '48px' : '90px'} 80px 40px;display:flex;flex-direction:column;gap:32px}
.etiqueta{flex:none;font-size:32px}
h1{flex:0 1 auto;min-height:0;font-size:${f ? 84 : 120}px}
.resumo{flex:none;font-size:38px;line-height:1.45;font-weight:600;opacity:.9;display:-webkit-box;-webkit-line-clamp:${f ? 2 : 6};-webkit-box-orient:vertical;overflow:hidden}
.cta{flex:none;margin:0 80px 280px;align-self:flex-start;background:var(--amarelo);color:var(--verde-escuro);font-size:40px;font-weight:800;padding:26px 44px;border-radius:999px}
.arroba{position:absolute;left:0;right:0;bottom:150px;text-align:center;font-size:30px;font-weight:700;opacity:.8}
</style>
<div class="peca escuro ${c.classe}">
  ${faixa(20)}
  <div class="topo">${marca(42, true)}<span class="data">${dataDe(d)}</span></div>
  ${f ? `<div class="img">${foto(d.foto)}</div>` : ''}
  <div class="corpo">
    <span class="etiqueta" ${urgente ? 'style="background:#fff;color:var(--vermelho)"' : ''}>${esc(d.selo || d.etiqueta || c.rotulo)}</span>
    <h1 class="ajusta" data-min="52">${fmt(d.titulo)}</h1>
    ${d.resumo ? `<p class="resumo">${fmt(d.resumo)}</p>` : ''}
  </div>
  <span class="cta">${fmt(d.chamada || 'Toque no link e leia o resumo ↑')}</span>
  <span class="arroba">${MARCA.arroba}</span>
  <div style="position:absolute;left:0;right:0;bottom:0">${faixa(20)}</div>
</div>`;
    },
  },

  carrossel: {
    nome: 'Carrossel (capa + slides + slide final)',
    grupo: 'Notícia',
    largura: 1080, altura: 1350,
    obrigatorios: ['titulo', 'slides'],
    campos: { categoria: 'opcional', titulo: 'manchete da capa', resumo: 'opcional na capa', foto: 'foto da capa (opcional)', slides: 'lista de { "titulo": "...", "texto": "..." }', final: 'false para não gerar o slide "Siga"', fonte: 'opcional' },
    render(d) {
      const c = cat(d.categoria);
      const slides = d.slides || [];
      const total = slides.length + 1 + (d.final === false ? 0 : 1);
      const paginas = [capaNoticia(d, { cta: 'Arrasta pro lado →' })];
      slides.forEach((s, i) => {
        const n = i + 2;
        paginas.push(`<style>
.topo{height:128px;padding:0 72px;display:flex;align-items:center;justify-content:space-between;flex:none}
.num{font-size:26px;font-weight:800;padding:8px 22px;border-radius:999px;background:var(--cor);color:var(--cor-texto)}
.corpo{flex:1;min-height:0;padding:30px 72px 40px;display:flex;flex-direction:column;gap:36px}
h2{flex:none;font-size:68px;padding-left:28px;border-left:14px solid var(--cor)}
.texto{flex:0 1 auto;min-height:0;font-size:40px;line-height:1.5;font-weight:500}
.texto b,.texto strong{font-weight:800}
.seta{flex:none;height:110px;padding:0 72px;display:flex;align-items:center;justify-content:flex-end;font-size:26px;font-weight:800;color:var(--texto-suave)}
</style>
<div class="peca ${c.classe}">
  ${faixa(18)}
  <div class="topo">${marca(30)}<span class="num">${n}/${total}</span></div>
  <div class="corpo">
    ${s.titulo ? `<h2>${fmt(s.titulo)}</h2>` : ''}
    <p class="texto ajusta" data-min="26">${fmt(s.texto || '')}</p>
  </div>
  <div class="seta">${n < total ? 'Arrasta →' : MARCA.arroba}</div>
</div>`);
      });
      if (d.final !== false) paginas.push(modelos['feed-siga'].render(d));
      return paginas;
    },
  },

  'feed-siga': {
    nome: 'Slide final "Siga o perfil" (usado no fim do carrossel)',
    grupo: 'Institucional',
    largura: 1080, altura: 1350,
    obrigatorios: [],
    campos: { texto: 'opcional (padrão: descrição do perfil)' },
    render: (d) => `<style>
.peca{background:var(--verde-escuro);color:#fff;align-items:center;justify-content:center;text-align:center;gap:52px;padding:0 100px}
.selo-io{width:260px;height:260px;border-radius:64px;background:var(--amarelo);color:var(--verde-escuro);display:grid;place-items:center;font-size:120px;font-weight:900;letter-spacing:-.03em}
h2{font-size:76px}
p{font-size:34px;line-height:1.5;font-weight:600;opacity:.88;max-width:22ch}
.botao{background:var(--amarelo);color:var(--verde-escuro);font-size:38px;font-weight:800;padding:26px 52px;border-radius:999px}
.fx{position:absolute;left:0;right:0;bottom:0}
</style>
<div class="peca escuro">
  <div class="selo-io">IO</div>
  <h2>Siga o <span class="destaque">${MARCA.nome}</span></h2>
  <p>${fmt(d.texto_final || MARCA.descricao)}</p>
  <span class="botao">${MARCA.arroba}</span>
  <div class="fx">${faixa(22)}</div>
</div>`,
  },

  /* ---------------- Redes sociais: serviço, agenda, frase, nota ---------------- */
  'feed-servico': {
    nome: 'Utilidade pública / serviço (feed)',
    grupo: 'Serviço',
    largura: 1080, altura: 1350,
    obrigatorios: ['titulo', 'itens'],
    campos: { titulo: 'assunto', selo: 'padrão: Utilidade pública', itens: 'lista de { "rotulo": "Telefone", "valor": "0800 ..." }', observacao: 'opcional', categoria: 'padrão: servico', data: 'opcional' },
    render(d) {
      const c = cat(d.categoria, 'servico');
      return `<style>
.topo{height:128px;padding:0 72px;display:flex;align-items:center;justify-content:space-between;flex:none}
.topo .data{font-size:26px;font-weight:700;color:var(--texto-suave)}
.cabeca{flex:none;background:var(--cor);color:var(--cor-texto);padding:44px 72px 50px;display:flex;flex-direction:column;gap:18px;max-height:440px}
.cabeca .selo{display:flex;align-items:center;gap:14px;font-size:26px;font-weight:800;text-transform:uppercase;letter-spacing:.1em}
.cabeca h1{font-size:80px;min-height:0;flex:0 1 auto}
.lista{flex:0 1 auto;min-height:0;padding:20px 72px 0;font-size:44px}
.lista li{list-style:none;display:flex;flex-direction:column;gap:.15em;padding:.5em 0;border-bottom:3px solid var(--linha)}
.lista li:last-child{border-bottom:0}
.rot{font-size:.55em;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--laranja)}
.val{font-weight:800;line-height:1.2}
.obs{flex:none;margin:auto 72px 36px;font-size:26px;line-height:1.45;font-weight:600;color:var(--texto-suave);padding:20px 26px;background:var(--tinta);border-left:8px solid var(--laranja);border-radius:0 16px 16px 0}
${RODAPE_CSS}
</style>
<div class="peca ${c.classe}">
  <div class="topo">${marca(34)}<span class="data">${dataDe(d)}</span></div>
  <div class="cabeca">
    <span class="selo">${icone('servico', 34, 'currentColor', 2.4)}${esc(d.selo || 'Utilidade pública')}</span>
    <h1 class="ajusta" data-min="44">${fmt(d.titulo)}</h1>
  </div>
  <ul class="lista ajusta" data-min="24">${(d.itens || []).map((i) => `<li><span class="rot">${esc(i.rotulo)}</span><span class="val">${fmt(i.valor)}</span></li>`).join('')}</ul>
  ${d.observacao ? `<p class="obs">${fmt(d.observacao)}</p>` : '<div style="margin-top:auto"></div>'}
  ${rodape(d.chamada || 'Salve e mande pra quem precisa →')}
  ${faixa(18)}
</div>`;
    },
  },

  'feed-agenda': {
    nome: 'Agenda / evento (feed)',
    grupo: 'Agenda',
    largura: 1080, altura: 1350,
    obrigatorios: ['titulo', 'data'],
    campos: { titulo: 'nome do evento', data: 'dd/mm (vira o bloco de data) ou texto livre, ex.: 28 a 30/11', dia_semana: 'ex.: Sábado', hora: 'opcional', local: 'opcional', entrada: 'ex.: Gratuita / R$ 20', descricao: 'opcional', foto: 'opcional', selo: 'padrão: Agenda', categoria: 'padrão: cultura' },
    render(d) {
      const c = cat(d.categoria, 'cultura');
      const m = String(d.data).match(/^(\d{1,2})\/(\d{1,2})/);
      const dia = m ? m[1].padStart(2, '0') : '';
      const mes = m ? MESES[Number(m[2]) - 1] : '';
      const f = !!d.foto;
      const linhas = [['Quando', [d.dia_semana, m ? null : d.data, d.hora].filter(Boolean).join(' · ')], ['Onde', d.local], ['Entrada', d.entrada]].filter((l) => l[1]);
      return `<style>
.topo{height:128px;padding:0 72px;display:flex;align-items:center;justify-content:space-between;flex:none}
.topo .selo{font-size:26px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--laranja);display:flex;align-items:center;gap:12px}
.cabeca{position:relative;flex:none;height:${f ? 520 : 400}px;background:var(--cor);${f ? '' : 'background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.18) 0 22px,transparent 22px 44px);'}}
.cartao{position:absolute;left:72px;bottom:-70px;z-index:2;background:#fff;border-top:14px solid var(--laranja);border-radius:0 0 24px 24px;padding:22px 40px 26px;box-shadow:0 18px 40px rgba(20,36,27,.18);text-align:center;min-width:240px}
.cartao .dia{display:block;font-size:${m ? 150 : 76}px;font-weight:900;line-height:1;color:var(--verde-escuro);letter-spacing:-.04em}
.cartao .mes{display:block;font-size:34px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--texto-suave);margin-top:6px}
.corpo{flex:1;min-height:0;padding:${f ? 110 : 110}px 72px 30px;display:flex;flex-direction:column;gap:28px}
h1{flex:0 1 auto;min-height:0;font-size:78px;padding-left:28px;border-left:14px solid var(--cor)}
.info{flex:none;display:flex;flex-direction:column}
.info div{display:flex;gap:28px;align-items:baseline;padding:16px 0;border-top:3px solid var(--linha)}
.info b{flex:none;width:170px;font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--laranja)}
.info span{font-size:34px;font-weight:700}
.desc{flex:none;font-size:28px;line-height:1.45;font-weight:500;color:var(--texto-suave);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
${RODAPE_CSS}
</style>
<div class="peca ${c.classe}">
  <div class="topo">${marca(34)}<span class="selo">${icone('agenda', 30, 'currentColor', 2.4)}${esc(d.selo || 'Agenda')}</span></div>
  <div class="cabeca">${f ? foto(d.foto) : ''}
    <div class="cartao">${m ? `<span class="dia">${dia}</span><span class="mes">${mes}${d.dia_semana ? ' · ' + esc(d.dia_semana).slice(0, 3) : ''}</span>` : `<span class="dia">${esc(d.data)}</span>`}</div>
  </div>
  <div class="corpo">
    <h1 class="ajusta" data-min="40">${fmt(d.titulo)}</h1>
    ${linhas.length ? `<div class="info">${linhas.map((l) => `<div><b>${l[0]}</b><span>${fmt(l[1])}</span></div>`).join('')}</div>` : ''}
    ${d.descricao ? `<p class="desc">${fmt(d.descricao)}</p>` : ''}
  </div>
  ${rodape(d.chamada || 'Marca quem vai com você →')}
  ${faixa(18)}
</div>`;
    },
  },

  'feed-frase': {
    nome: 'Frase / declaração (feed)',
    grupo: 'Notícia',
    largura: 1080, altura: 1350,
    obrigatorios: ['frase', 'autor'],
    campos: { frase: 'a citação, sem aspas', autor: 'quem disse', cargo: 'opcional', foto: 'foto do rosto (opcional, sai redonda)', contexto: 'opcional (ex.: sobre a reforma da praça)', categoria: 'opcional' },
    render(d) {
      const c = cat(d.categoria);
      return `<style>
.peca{background:var(--tinta)}
.topo{height:128px;padding:0 72px;display:flex;align-items:center;justify-content:space-between;flex:none}
.topo .etiqueta{font-size:24px}
.aspas{flex:none;height:220px;padding:0 60px;font-size:380px;line-height:1;font-weight:900;color:var(--laranja);font-family:Georgia,serif}
.frase{flex:0 1 auto;min-height:0;margin:0 72px;font-size:88px;line-height:1.2;font-weight:800;letter-spacing:-.02em}
.autor{flex:none;margin:auto 72px 56px;display:flex;align-items:center;gap:30px;padding-top:34px;border-top:4px solid var(--linha)}
.rosto{flex:none;position:relative;width:150px;height:150px;border-radius:50%;overflow:hidden;border:6px solid var(--cor)}
.quem b{display:block;font-size:40px;font-weight:800;color:var(--verde-escuro)}
.quem span{display:block;font-size:27px;font-weight:600;color:var(--texto-suave);margin-top:4px}
${RODAPE_CSS}
</style>
<div class="peca ${c.classe}">
  <div class="topo">${marca(34)}${d.categoria ? `<span class="etiqueta">${esc(c.rotulo)}</span>` : ''}</div>
  <div class="aspas">“</div>
  <p class="frase ajusta" data-min="36">${fmt(d.frase)}</p>
  <div class="autor">
    ${d.foto ? `<div class="rosto">${foto(d.foto)}</div>` : ''}
    <div class="quem"><b>${esc(d.autor)}</b>${d.cargo || d.contexto ? `<span>${esc([d.cargo, d.contexto].filter(Boolean).join(' · '))}</span>` : ''}</div>
  </div>
  ${rodape(d.chamada || 'O que você acha? Comenta aí →')}
  ${faixa(18)}
</div>`;
    },
  },

  'feed-nota': {
    nome: 'Nota / comunicado / nota de pesar (feed)',
    grupo: 'Institucional',
    largura: 1080, altura: 1350,
    obrigatorios: ['texto'],
    campos: { selo: 'padrão: Nota (ex.: Comunicado, Nota de pesar, Errata)', titulo: 'opcional', texto: 'corpo da nota', assinatura: 'padrão: Equipe Igarassu Ordinário', data: 'opcional', sobrio: 'true para nota de pesar (sem as cores vibrantes)' },
    render(d) {
      const sobrio = !!d.sobrio;
      return `<style>
.topo{height:150px;padding:0 72px;display:flex;align-items:center;justify-content:space-between;flex:none}
.topo .data{font-size:26px;font-weight:700;color:var(--texto-suave)}
.corpo{flex:1;min-height:0;padding:40px 72px 40px;display:flex;flex-direction:column;gap:36px}
.selo{flex:none;font-size:30px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:${sobrio ? 'var(--texto-suave)' : 'var(--laranja)'};padding-left:22px;border-left:10px solid ${sobrio ? 'var(--texto)' : 'var(--laranja)'}}
h1{flex:none;font-size:64px;${sobrio ? 'color:var(--texto);' : 'color:var(--verde-escuro);'}}
.texto{flex:0 1 auto;min-height:0;font-size:42px;line-height:1.55;font-weight:500}
.texto p+p{margin-top:.7em}
.ass{flex:none;margin-top:auto;font-size:30px;font-weight:800;color:var(--verde-escuro)}
.linha{flex:none;height:${sobrio ? 10 : 0}px;background:var(--texto)}
</style>
<div class="peca">
  ${sobrio ? '<div class="linha"></div>' : faixa(18)}
  <div class="topo">${marca(34)}<span class="data">${dataDe(d)}</span></div>
  <div class="corpo">
    <span class="selo">${esc(d.selo || 'Nota')}</span>
    ${d.titulo ? `<h1>${fmt(d.titulo)}</h1>` : ''}
    <div class="texto ajusta" data-min="24">${String(d.texto).split(/\n\s*\n/).map((p) => `<p>${fmt(p)}</p>`).join('')}</div>
    <p class="ass">${esc(d.assinatura || 'Equipe ' + MARCA.nome)}</p>
  </div>
  ${sobrio ? '<div class="linha"></div>' : faixa(18)}
</div>`;
    },
  },

  /* ---------------- Publicidade ---------------- */
  'publi-feed': {
    nome: 'Publicidade de anunciante (feed)',
    grupo: 'Publicidade',
    largura: 1080, altura: 1350,
    obrigatorios: ['anunciante', 'titulo'],
    campos: { anunciante: 'nome do comércio', titulo: 'oferta ou chamada principal', texto: 'opcional', preco: 'opcional (ex.: R$ 19,90)', preco_antigo: 'opcional', contato: 'lista de linhas (WhatsApp, endereço, @)', chamada: 'padrão: Chama no WhatsApp', foto: 'foto do produto/loja (opcional)', logo: 'logo do anunciante (opcional)', selo: 'padrão: Publicidade' },
    render(d) {
      const f = !!d.foto;
      const contato = lista(d.contato);
      return `<style>
.topo{height:120px;padding:0 64px;display:flex;align-items:center;justify-content:space-between;flex:none}
.publi{font-size:22px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--texto-suave);border:3px solid var(--linha);padding:8px 20px;border-radius:999px}
.img{position:relative;flex:none;height:${f ? 520 : 440}px;margin:0 56px;border-radius:32px;overflow:hidden;background:var(--laranja);color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:28px;padding:40px}
.img .nome{position:relative;font-size:104px;font-weight:900;letter-spacing:-.03em;text-align:center;line-height:1.02;max-width:100%}
.logo{position:relative;max-height:220px;max-width:70%;object-fit:contain}
.logo-canto{position:absolute;right:28px;top:28px;width:150px;height:150px;border-radius:50%;background:#fff;object-fit:contain;padding:14px;box-shadow:0 8px 24px rgba(0,0,0,.18)}
.corpo{flex:1;min-height:0;padding:40px 72px 30px;display:flex;flex-direction:column;gap:22px}
.anun{flex:none;font-size:26px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--laranja)}
h1{flex:0 1 auto;min-height:0;font-size:76px}
.texto{flex:none;font-size:30px;line-height:1.45;font-weight:500;color:var(--texto-suave);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.preco{flex:none;display:flex;align-items:baseline;gap:24px;margin-top:4px}
.preco s{font-size:34px;font-weight:700;color:var(--texto-suave)}
.preco b{font-size:84px;font-weight:900;letter-spacing:-.03em;color:var(--verde-escuro);background:var(--amarelo);padding:0 18px;border-radius:14px;line-height:1.15}
.rod{flex:none;min-height:150px;background:var(--laranja);color:#2B1500;padding:24px 64px;display:flex;align-items:center;justify-content:space-between;gap:30px}
.rod .cta{flex:none;background:var(--verde-escuro);color:#fff;font-size:30px;font-weight:800;padding:20px 34px;border-radius:999px}
.rod .ct{font-size:25px;font-weight:700;line-height:1.45;text-align:right}
</style>
<div class="peca">
  <div class="topo">${marca(28)}<span class="publi">${esc(d.selo || 'Publicidade')}</span></div>
  <div class="img">
    ${f ? foto(d.foto) + (d.logo ? `<img class="logo-canto" src="${d.logo}">` : '') : d.logo ? `<img class="logo" src="${d.logo}"><span class="nome ajusta" data-min="40" style="font-size:64px">${esc(d.anunciante)}</span>` : `<span class="nome ajusta" data-min="40">${esc(d.anunciante)}</span>`}
  </div>
  <div class="corpo">
    ${f ? `<span class="anun">${esc(d.anunciante)}</span>` : ''}
    <h1 class="ajusta" data-min="40">${fmt(d.titulo)}</h1>
    ${d.texto ? `<p class="texto">${fmt(d.texto)}</p>` : ''}
    ${d.preco ? `<div class="preco">${d.preco_antigo ? `<s>${esc(d.preco_antigo)}</s>` : ''}<b>${esc(d.preco)}</b></div>` : ''}
  </div>
  <div class="rod"><span class="cta">${fmt(d.chamada || 'Chama no WhatsApp')}</span><span class="ct">${contato.slice(0, 3).map(fmt).join('<br>')}</span></div>
  ${faixa(18)}
</div>`;
    },
  },

  'publi-story': {
    nome: 'Publicidade de anunciante (story)',
    grupo: 'Publicidade',
    largura: 1080, altura: 1920,
    obrigatorios: ['anunciante', 'titulo'],
    campos: { anunciante: 'nome do comércio', titulo: 'oferta', texto: 'opcional', preco: 'opcional', preco_antigo: 'opcional', contato: 'lista de linhas', chamada: 'padrão: Chama no WhatsApp', foto: 'opcional', logo: 'opcional', selo: 'padrão: Publicidade' },
    render(d) {
      const f = !!d.foto;
      const contato = lista(d.contato);
      return `<style>
.peca{background:var(--laranja);color:#2B1500}
.topo{flex:none;padding:170px 80px 0;display:flex;align-items:center;justify-content:space-between}
.publi{font-size:24px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;background:rgba(255,255,255,.9);color:var(--texto);padding:10px 22px;border-radius:999px}
.img{position:relative;flex:none;height:${f ? 560 : 0}px;margin:40px 80px 0;border-radius:36px;overflow:hidden;border:8px solid #fff;${f ? '' : 'display:none'}}
.logo-canto{position:absolute;right:26px;top:26px;width:160px;height:160px;border-radius:50%;background:#fff;object-fit:contain;padding:14px}
.corpo{flex:1;min-height:0;padding:${f ? 40 : 120}px 80px 30px;display:flex;flex-direction:column;gap:24px}
.logo{flex:none;align-self:flex-start;max-height:200px;max-width:60%;object-fit:contain;background:#fff;border-radius:24px;padding:16px}
.anun{flex:none;font-size:34px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
h1{flex:0 1 auto;min-height:0;font-size:${f ? 90 : 120}px;color:#fff}
.texto{flex:none;font-size:36px;line-height:1.45;font-weight:600;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.preco{flex:none;display:flex;align-items:baseline;gap:24px}
.preco s{font-size:40px;font-weight:700;opacity:.75}
.preco b{font-size:100px;font-weight:900;letter-spacing:-.03em;color:var(--verde-escuro);background:var(--amarelo);padding:0 22px;border-radius:16px;line-height:1.15}
.base{flex:none;margin:0 80px 250px;display:flex;flex-direction:column;gap:24px;align-items:flex-start}
.cta{background:var(--verde-escuro);color:#fff;font-size:42px;font-weight:800;padding:28px 46px;border-radius:999px}
.ct{font-size:32px;font-weight:700;line-height:1.45}
.fx{position:absolute;left:0;right:0;bottom:0}
.marca-pe{position:absolute;left:0;right:0;bottom:120px;display:flex;justify-content:center}
</style>
<div class="peca">
  ${faixa(20)}
  <div class="topo"><span class="publi">${esc(d.selo || 'Publicidade')}</span></div>
  <div class="img">${f ? foto(d.foto) + (d.logo ? `<img class="logo-canto" src="${d.logo}">` : '') : ''}</div>
  <div class="corpo">
    ${!f && d.logo ? `<img class="logo" src="${d.logo}">` : ''}
    <span class="anun">${esc(d.anunciante)}</span>
    <h1 class="ajusta" data-min="50">${fmt(d.titulo)}</h1>
    ${d.texto ? `<p class="texto">${fmt(d.texto)}</p>` : ''}
    ${d.preco ? `<div class="preco">${d.preco_antigo ? `<s>${esc(d.preco_antigo)}</s>` : ''}<b>${esc(d.preco)}</b></div>` : ''}
  </div>
  <div class="base"><span class="cta">${fmt(d.chamada || 'Chama no WhatsApp')}</span>${contato.length ? `<span class="ct">${contato.slice(0, 3).map(fmt).join('<br>')}</span>` : ''}</div>
  <div class="marca-pe">${marca(30)}</div>
  <div class="fx">${faixa(20)}</div>
</div>`;
    },
  },

  'publi-anuncie': {
    nome: 'Chamada "Anuncie aqui" (feed)',
    grupo: 'Publicidade',
    largura: 1080, altura: 1350,
    obrigatorios: [],
    campos: { titulo: 'padrão: Seu comércio na frente de quem vive, compra e circula em Igarassu', itens: 'lista do que o anunciante ganha', numeros: 'lista de { "valor": "12 mil", "rotulo": "seguidores" } (opcional)', chamada: 'padrão: Chama no direct' },
    render(d) {
      const itens = lista(d.itens).length ? lista(d.itens) : ['Post no feed e nos stories', 'Banner no site do Igarassu Ordinário', 'Divulgação de promoção e evento'];
      const cores = ['var(--verde)', 'var(--amarelo)', 'var(--laranja)', 'var(--vermelho)'];
      return `<style>
.peca{background:var(--verde-escuro);color:#fff}
.topo{height:150px;padding:0 72px;display:flex;align-items:center;justify-content:space-between;flex:none}
.topo .sel{font-size:24px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--amarelo);display:flex;gap:12px;align-items:center}
.corpo{flex:1;min-height:0;padding:20px 72px 40px;display:flex;flex-direction:column;justify-content:center;gap:60px}
h1{flex:0 1 auto;min-height:0;font-size:112px}
ul{flex:none;display:flex;flex-direction:column;gap:30px}
li{list-style:none;display:flex;align-items:center;gap:26px;font-size:42px;font-weight:700}
li i{flex:none;width:28px;height:28px;border-radius:8px}
.nums{flex:none;display:flex;gap:24px}
.nums div{flex:1;background:rgba(255,255,255,.08);border-radius:20px;padding:22px 26px;border-top:8px solid var(--amarelo)}
.nums b{display:block;font-size:58px;font-weight:900;color:var(--amarelo);letter-spacing:-.02em}
.nums span{font-size:24px;font-weight:700;opacity:.85}
.cta{flex:none;margin:0 72px 60px;align-self:flex-start;background:var(--amarelo);color:var(--verde-escuro);font-size:38px;font-weight:800;padding:26px 46px;border-radius:999px}
</style>
<div class="peca escuro">
  <div class="topo">${marca(34, true)}<span class="sel">${icone('anuncie', 32, 'currentColor', 2.4)}Anuncie</span></div>
  <div class="corpo">
    <h1 class="ajusta" data-min="48">${fmt(d.titulo || 'Seu comércio na frente de quem vive, compra e circula em *Igarassu*')}</h1>
    <ul>${itens.map((t, i) => `<li><i style="background:${cores[i % 4]}"></i>${fmt(t)}</li>`).join('')}</ul>
    ${d.numeros && d.numeros.length ? `<div class="nums">${d.numeros.slice(0, 3).map((n) => `<div><b>${esc(n.valor)}</b><span>${esc(n.rotulo)}</span></div>`).join('')}</div>` : ''}
  </div>
  <span class="cta">${fmt(d.chamada || 'Chama no direct ' + MARCA.arroba)}</span>
  ${faixa(22)}
</div>`;
    },
  },

  /* ---------------- Banners do site ---------------- */
  'banner-300x250': {
    nome: 'Banner do site 300×250 (lateral)',
    grupo: 'Banner do site',
    largura: 300, altura: 250, escala: 2,
    obrigatorios: ['anunciante', 'titulo'],
    campos: { anunciante: 'nome', titulo: 'chamada curta', chamada: 'texto do botão (padrão: Saiba mais)', fundo: 'laranja | verde | amarelo | vermelho | branco', foto: 'opcional (fica no fundo)', logo: 'opcional' },
    render: (d) => banner(d, 'ret'),
  },
  'banner-728x90': {
    nome: 'Banner do site 728×90 (horizontal, computador)',
    grupo: 'Banner do site',
    largura: 728, altura: 90, escala: 2,
    obrigatorios: ['anunciante', 'titulo'],
    campos: { anunciante: 'nome', titulo: 'chamada curta', chamada: 'texto do botão', fundo: 'laranja | verde | amarelo | vermelho | branco', logo: 'opcional' },
    render: (d) => banner(d, 'hor'),
  },
  'banner-320x100': {
    nome: 'Banner do site 320×100 (celular)',
    grupo: 'Banner do site',
    largura: 320, altura: 100, escala: 2,
    obrigatorios: ['anunciante', 'titulo'],
    campos: { anunciante: 'nome', titulo: 'chamada curta', chamada: 'texto do botão', fundo: 'laranja | verde | amarelo | vermelho | branco', logo: 'opcional' },
    render: (d) => banner(d, 'cel'),
  },

  /* ---------------- Institucional ---------------- */
  'og-materia': {
    nome: 'Imagem de compartilhamento de link (WhatsApp/Facebook) 1200×630',
    grupo: 'Institucional',
    largura: 1200, altura: 630,
    obrigatorios: ['titulo'],
    campos: { categoria: 'opcional', titulo: 'manchete', data: 'opcional' },
    render(d) {
      const c = cat(d.categoria);
      return `<style>
.peca{flex-direction:row}
.barra{flex:none;width:28px;background:var(--cor)}
.conteudo{flex:1;min-width:0;display:flex;flex-direction:column;gap:30px;padding:56px 70px 40px 60px}
.topo{flex:none;display:flex;justify-content:space-between;align-items:center}
.topo .data{font-size:22px;font-weight:700;color:var(--texto-suave)}
.etiqueta{flex:none;font-size:22px}
h1{flex:0 1 auto;min-height:0;font-size:68px}
.pe{flex:none;margin-top:auto;font-size:22px;font-weight:700;color:var(--texto-suave)}
.fx{position:absolute;left:0;right:0;bottom:0}
</style>
<div class="peca ${c.classe}">
  <div class="barra"></div>
  <div class="conteudo">
    <div class="topo">${marca(32)}<span class="data">${dataDe(d)}</span></div>
    <span class="etiqueta">${esc(d.etiqueta || c.rotulo)}</span>
    <h1 class="ajusta" data-min="36">${fmt(d.titulo)}</h1>
    <p class="pe">${MARCA.site}</p>
  </div>
  <div class="fx">${faixa(14)}</div>
</div>`;
    },
  },

  'capa-destaque': {
    nome: 'Capas dos destaques do Instagram (uma imagem por item)',
    grupo: 'Institucional',
    largura: 1080, altura: 1920,
    obrigatorios: [],
    campos: { itens: 'lista de { "icone": "noticias|servico|agenda|seguranca|comercio|cultura|anuncie|cidade|contato|urgente", "cor": "verde-escuro|verde|amarelo|laranja|vermelho", "nome": "nome do arquivo" }' },
    render(d) {
      const padrao = [
        { icone: 'noticias', cor: 'verde-escuro', nome: 'noticias' },
        { icone: 'urgente', cor: 'vermelho', nome: 'urgente' },
        { icone: 'servico', cor: 'verde', nome: 'servico' },
        { icone: 'agenda', cor: 'amarelo', nome: 'agenda' },
        { icone: 'comercio', cor: 'laranja', nome: 'comercio' },
        { icone: 'anuncie', cor: 'verde-escuro', nome: 'anuncie' },
      ];
      return (d.itens || padrao).map((it) => {
        const claro = ['amarelo', 'verde', 'laranja'].includes(it.cor);
        const tinta = claro ? 'var(--texto)' : (it.cor === 'verde-escuro' ? 'var(--amarelo)' : '#fff');
        return { sufixo: it.nome || it.icone, html: `<style>
.peca{background:var(--${it.cor || 'verde-escuro'});align-items:center;justify-content:center}
.fx{position:absolute;left:0;right:0;bottom:0}
</style>
<div class="peca">${icone(it.icone, 460, tinta, 1.6)}<div class="fx">${faixa(24)}</div></div>` };
      });
    },
  },

  perfil: {
    nome: 'Foto de perfil (1080×1080, pensada para o recorte redondo)',
    grupo: 'Institucional',
    largura: 1080, altura: 1080,
    obrigatorios: [],
    campos: { fundo: 'verde-escuro (padrão) | branco' },
    render(d) {
      const branco = d.fundo === 'branco';
      return `<style>
.peca{background:${branco ? '#fff' : 'var(--verde-escuro)'};align-items:center;justify-content:center;gap:56px}
.io{font-size:440px;font-weight:900;letter-spacing:-.05em;line-height:.9;color:${branco ? 'var(--verde-escuro)' : 'var(--amarelo)'}}
.fx{width:560px;border-radius:12px;overflow:hidden}
</style>
<div class="peca"><div class="io">IO</div><div class="fx">${faixa(44)}</div></div>`;
    },
  },
};

/* ---------------- Banner (três tamanhos) ---------------- */
function banner(d, tipo) {
  const fundos = {
    laranja: ['var(--laranja)', '#2B1500', 'var(--verde-escuro)', '#fff'],
    verde: ['var(--verde-escuro)', '#fff', 'var(--amarelo)', 'var(--verde-escuro)'],
    amarelo: ['var(--amarelo)', '#2B2100', 'var(--verde-escuro)', '#fff'],
    vermelho: ['var(--vermelho)', '#fff', '#fff', 'var(--vermelho)'],
    branco: ['#fff', 'var(--texto)', 'var(--laranja)', '#2B1500'],
  };
  const [bg, fg, btnBg, btnFg] = fundos[d.fundo] || fundos.laranja;
  const cta = esc(d.chamada || 'Saiba mais');
  const publi = '<span class="pub">Publicidade</span>';
  const logo = d.logo ? `<img class="lg" src="${d.logo}">` : '';
  const comum = `.peca{background:${bg};color:${fg}${d.fundo === 'branco' ? ';box-shadow:inset 0 0 0 1px var(--linha)' : ''}}
.pub{position:absolute;top:4px;right:6px;font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.7}
.an{font-weight:800;text-transform:uppercase;letter-spacing:.08em}
h1{min-height:0;letter-spacing:-.02em}
.bt{flex:none;background:${btnBg};color:${btnFg};font-weight:800;border-radius:999px;white-space:nowrap}
.lg{flex:none;object-fit:contain;background:#fff;border-radius:8px}`;
  if (tipo === 'ret') {
    return `<style>${comum}
.peca{padding:22px 20px 0;gap:8px}
.an{font-size:11px;flex:none}
h1{flex:0 1 auto;font-size:30px}
.bt{align-self:flex-start;font-size:13px;padding:9px 16px;margin:auto 0 16px}
.lg{position:absolute;right:14px;bottom:20px;width:54px;height:54px;padding:4px}
.fx{margin:0 -20px}
${d.foto ? '.foto.escurece::after{background:linear-gradient(180deg,rgba(7,40,22,.15),rgba(7,40,22,.85))}.peca{color:#fff}' : ''}
</style>
<div class="peca">${d.foto ? foto(d.foto, 'escurece') : ''}${publi}
  <span class="an" style="position:relative">${esc(d.anunciante)}</span>
  <h1 class="ajusta" data-min="16" style="position:relative">${fmt(d.titulo)}</h1>
  <span class="bt" style="position:relative">${cta}</span>${logo}
  <div class="fx" style="position:relative">${faixa(5)}</div>
</div>`;
  }
  const hor = tipo === 'hor';
  return `<style>${comum}
.peca{flex-direction:row;align-items:center;gap:${hor ? 16 : 10}px;padding:0 ${hor ? 18 : 10}px ${hor ? 4 : 4}px}
.lg{width:${hor ? 62 : 56}px;height:${hor ? 62 : 56}px;padding:4px}
.tx{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:center;gap:2px;padding:6px 0}
.an{font-size:${hor ? 10 : 9}px;flex:none}
h1{flex:0 1 auto;font-size:${hor ? 26 : 19}px;line-height:1.1}
.bt{font-size:${hor ? 14 : 11}px;padding:${hor ? '10px 18px' : '7px 11px'}}
.fx{position:absolute;left:0;right:0;bottom:0}
</style>
<div class="peca">${publi}${logo}
  <div class="tx"><span class="an">${esc(d.anunciante)}</span><h1 class="ajusta" data-min="11">${fmt(d.titulo)}</h1></div>
  <span class="bt">${cta}</span>
  <div class="fx">${faixa(4)}</div>
</div>`;
}

module.exports = { modelos, MARCA, CATEGORIAS, ICONES };
