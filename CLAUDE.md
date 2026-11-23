# Igarassu Ordinário

Portal de notícias estático (GitHub Pages) sobre Igarassu e o Litoral Norte de Pernambuco. Páginas em `index.html` e `materia/<id>-<slug>/index.html`; estilo em `estilo.css`. As páginas do site são geradas por outra ferramenta ("Atualização do site"): não edite à mão sem pedido.

## Pedidos de inserção (posts, stories, publicidade, banners)

Quando o usuário pedir uma peça visual ("faz um post", "story", "urgente", "carrossel", "publi", "banner", "agenda", "nota"...), use o kit em `insercoes/` (ver `insercoes/README.md`):

1. Escolha o modelo (o padrão das peças é o story: `story-noticia`) (`node insercoes/gerar.js --listar` mostra modelos e campos).
2. Se o pedido citar uma matéria ("matéria 175"), pegue título, resumo, categoria (etiqueta), data e fonte de `materia/175-*/index.html`.
3. Escreva o pedido em `insercoes/pedidos/AAAA-MM-DD-<assunto>.json`. Fotos enviadas pelo usuário vão em `insercoes/pedidos/fotos/`.
4. Rode `node insercoes/gerar.js insercoes/pedidos/<arquivo>.json`. Se aparecer aviso de texto longo, encurte o texto e gere de novo.
5. Olhe a imagem gerada antes de entregar, e mande com SendUserFile (PNGs em `insercoes/saida/`).
6. Commit do pedido JSON (a saída fica fora do git) na branch de trabalho.

Regras (Guia de identidade em `insercoes/marca/guia-identidade.pdf`): fundo verde com pontinhos, faixa laranja/vermelho/verde no topo, selo amarelo, título em Montserrat Black maiúsculo com uma palavra-chave amarela (`*palavra*`), cards creme com ícone, gancho amarelo, vermelho só em botão e alerta, ilustração flat no pé, rodapé com fonte + @. Tom popular e local, humor no fato e nunca na vítima; notícia pesada (acidente, morte, incêndio) usa `"pesada": true` ou `*-urgente` (fundo escuro, sem ilustração e sem humor). Sempre citar a fonte. Publicidade sempre com selo "Publicidade"; não invente fatos, números, falas ou contatos: use só o que o usuário ou a matéria informar. Na falta de um dado obrigatório (ex.: WhatsApp do anunciante), pergunte.

Para um modelo novo, acrescente-o em `insercoes/modelos.js` seguindo os existentes, crie um exemplo em `insercoes/exemplos/` e rode `--exemplos`.
