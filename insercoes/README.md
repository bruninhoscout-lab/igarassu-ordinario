# Inserções — Igarassu Ordinário

Kit de peças prontas no padrão do **Guia de identidade visual (nov/2026)**, que está em [`marca/guia-identidade.pdf`](marca/guia-identidade.pdf). Para pedir uma peça, é só escrever no chat do Claude, por exemplo:

> "Faz um **story** da matéria 175"
> "**Urgente**: incêndio em loja no centro, sem feridos, fonte Bombeiros"
> "Monta um **carrossel** explicando a mudança da água, 4 slides"
> "**Tu sabia?** sobre a Coroa do Avião, segue a ilustração"
> "**Publi** feed + story pro Mercadinho X, oferta tal, WhatsApp tal"
> "**Banners** do site pro anunciante Y"

O Claude escreve o pedido em `insercoes/pedidos/`, gera as imagens, confere e manda os arquivos prontos.

## O padrão do guia (aplicado automaticamente)

- **Fundo** verde página `#0E8D40` com pontinhos brancos discretos, escurecendo até `#0B7A37` no pé.
- **Faixa de 3 cores no topo**: laranja `#F58D1E`, vermelho `#E43A2D` e verde vivo `#25BA5C`.
- **Logo redonda** com borda creme no topo (ao lado do selo) e no rodapé (antes do @). O tamanho mínimo é 40 px.
- **Selo amarelo** `#FFCA3E`, por exemplo "SERVIÇO ORDINÁRIO • 1/7". Num carrossel, a numeração entra sozinha.
- **Título** em Montserrat Black, maiúsculo, com a palavra-chave em amarelo. Basta marcar a palavra com `*asteriscos*`.
- **Lista com ícone** em cards creme `#FFF8E8`. O ícone é escolhido pelo texto, ou definido com `"icone"`.
- **Card de texto** creme com termos em verde, também marcados com `*asteriscos*`. **Gancho** em card amarelo.
- **Botão vermelho** para a chamada. O vermelho só aparece em botão e alerta.
- **Ilustração flat** no pé: `coqueiros`, `praca`, `feira`, `igreja` ou `casario`.
- **Rodapé**: "Fonte: …" à esquerda e logo + **@igarassu**ordinarioo à direita. Sempre cite a fonte.
- **Notícia pesada** (acidente, morte, incêndio): fundo escuro, sem ilustração e sem humor. Use `"pesada": true` ou os modelos `*-urgente`.
- Stories deixam livres 200 px em cima e 250 px embaixo. Texto com no mínimo 26 px.

## Catálogo

| Código | Para quê | Tamanho |
|---|---|---|
| `story-noticia` | Story de notícia (o padrão das suas peças) | 1080×1920 |
| `feed-noticia` | Post de notícia (`"altura": 1440` para o feed alto) | 1080×1350 |
| `story-urgente` · `feed-urgente` | Urgente / notícia pesada, com fundo escuro e selo vermelho | story · feed |
| `carrossel` | Capa + slides no feed, selo "• n/N" | 1080×1350 (várias) |
| `sequencia-stories` | Capa + stories em sequência, selo "• n/N" | 1080×1920 (várias) |
| `story-tu-sabia` · `feed-tu-sabia` | "Tu sabia?" / Curiosidade ordinária: ilustração com balão | story · feed |
| `story-servico` · `feed-servico` | Serviço ordinário: telefones, prazos, documentos | story · feed |
| `story-agenda` · `feed-agenda` | Agenda ordinária: data, hora, local, entrada | story · feed |
| `feed-frase` | Frase / declaração | feed |
| `feed-nota` · `story-nota` | Comunicado, errata, nota de pesar (`"sobrio": true`) | feed · story |
| `publi-story` · `publi-feed` | Publicidade de anunciante | story · feed |
| `publi-anuncie` · `story-anuncie` | Chamada para vender espaço | feed · story |
| `banner-300x250` · `banner-728x90` · `banner-320x100` | Banners do site | 2x |
| `story-siga` · `feed-siga` | "Nova fase" / "Siga", com a logo grande | story · feed |
| `og-materia` | Imagem que aparece ao compartilhar o link | 1200×630 |
| `capa-destaque` | Capas dos destaques: círculo verde-escuro, ponto laranja e faixa no pé | 1080×1920 |

Há exemplos de cada modelo em [`catalogo/`](catalogo/), e os pedidos que geraram esses exemplos estão em [`exemplos/`](exemplos/). As suas artes originais ficam em [`marca/referencias/`](marca/referencias/).

## Como gerar na mão

```bash
node insercoes/gerar.js insercoes/pedidos/meu-pedido.json   # gera em insercoes/saida/
node insercoes/gerar.js pedido.json --jpg                     # sai em JPG
node insercoes/gerar.js --listar                              # mostra os modelos e os campos
node insercoes/gerar.js --exemplos                            # refaz o catálogo
```

```json
{
  "modelo": "story-noticia",
  "selo": "Bairro ordinário • Agamenon Magalhães",
  "titulo": "Praça das *Palmeiras* reaberta",
  "subtitulo": "Entregue na quarta, 18/11",
  "itens": ["Pintura nova", "Parquinho com brinquedos novos", "Quadra de areia"],
  "gancho": "Agamenon, a praça é de vocês: agora é cuidar pra durar!",
  "cena": "praca",
  "chamada": "Vê como ficou no próximo story →",
  "fonte": "Prefeitura de Igarassu"
}
```

Os campos são: `selo`, `titulo`, `subtitulo`, `foto` (+ `balao`), `itens`, `texto`, `gancho`, `preco`/`preco_antigo`, `cena`, `chamada` (+ `chamada_estilo`: `botao` ou `texto`), `fonte` e `pesada`. Se um título não couber, a letra diminui sozinha, e o gerador avisa quando for preciso encurtar.

## Arquivos

- `modelos.js`: os modelos (motor `arte` + presets) · `base.css`: cores e componentes do guia · `gerar.js`: transforma o pedido JSON em PNG/JPG
- `marca/`: logo (SVG, perfil 1080/2160, redonda transparente), guia em PDF e referências
- `fontes/`: Montserrat (licença OFL) · `pedidos/`: histórico de pedidos · `saida/`: imagens geradas (fora do git)

A **Podium Soft** (títulos de vídeo e peças especiais) não veio no pacote. Se quiser usá-la, mande o arquivo da fonte.
