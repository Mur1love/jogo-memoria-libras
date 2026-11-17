# PRD — Dicionário Vivo de Computação

**Jogo didático digital bilíngue (Libras ↔ Português) para navegador**
Disciplina: Libras (Computação, UPE Garanhuns) · Caso 4 — Luedji, 16 anos, 2º ano do EM
Prazo de entrega: **01/12/2026** · Versão do documento: 1.0 (16/11/2026)

> **Como usar este documento:** ele foi escrito para servir de especificação direta na geração do protótipo. Os requisitos têm IDs (RF, RA, RNF) e prioridades **M** (Must, obrigatório no MVP), **S** (Should, desejável) e **C** (Could, se sobrar tempo). Onde algo ainda depende de verificação humana (sinais, licença dos vídeos), está marcado como **[VALIDAR]**.

---

## 1. Visão geral

### 1.1 Resumo
Jogo da memória em que cartas formam pares ou trios entre **sinal em Libras (vídeo curto)**, **palavra em português**, **imagem do conceito** e **definição curta**. O apoio escrito é retirado gradualmente ao longo de 5 níveis, o que materializa a "introdução gradual da Libras" pedida pelo caso. Há modos individual, duelo, equipes no projetor e desafio assíncrono, e um Dicionário (galeria) que funciona como material de estudo sem intérprete.

### 1.2 Problema
Luedji tem implante coclear, é alfabetizada em português e está começando a aprender Libras. Na escola pública não há intérprete nem AEE, a turma tem 35 estudantes e é barulhenta, e ela evita pedir repetição e atividades em grupo com muita fala. Precisa de um recurso que ensine sinais **sozinho**, sem depender de áudio, sem exposição e sem constrangimento ao errar, e que ao mesmo tempo aproxime a turma da Libras.

### 1.3 Objetivos
1. Ensinar vocabulário de Computação em Libras com apoio do português escrito, reduzindo esse apoio progressivamente.
2. Permitir que Luedji pratique em privacidade e participe da turma em pé de igualdade.
3. Fazer a turma ouvinte usar Libras no jogo (o sinal é parte da regra no modo equipes).
4. Funcionar em navegador, offline, no laboratório de informática e no projetor.
5. Cumprir os elementos obrigatórios da avaliação (imagens, sinais, pouco texto, instruções acessíveis, estratégias visuais de interação).

### 1.4 Fora de escopo (v1)
- Servidor, contas de usuário, multijogador em tempo real entre dispositivos.
- Reconhecimento de sinais com movimento (limitação do Teachable Machine de imagem; ver seção 14).
- Qualquer uso de áudio.
- Avaliação formal da aprendizagem (o jogo é de prática, não de prova).

---

## 2. Verificação de adequação ao caso Luedji

### 2.1 Veredito
**O jogo faz sentido para o caso**, com ajustes. Os pontos fortes se alinham ao perfil, e os riscos foram tratados em requisitos específicos (tabela 2.3).

### 2.2 Pontos fortes
| Característica do caso | Por que o jogo encaixa |
|---|---|
| Alfabetizada em português, aprendendo Libras | O pareamento sinal ↔ palavra usa o ponto forte dela (leitura) para construir o ponto novo (Libras) |
| "Introdução gradual" e "estratégias bilíngues" | Os 5 níveis retiram a escrita aos poucos |
| Perde informação com ruído e cansaço auditivo | Jogo 100% visual, zero áudio |
| Sem intérprete e sem AEE | Vídeo com replay ilimitado e câmera lenta; o jogo ensina sozinho |
| Evita pedir repetição | Botão de replay em todo vídeo, sem ninguém perceber |
| Evita atividades em grupo falado | Modo treino individual; modo equipes com regra de silêncio |
| Escola com projetor e laboratório | Jogo web, offline, com modos para projetor e para computador |
| Identidade em construção (nem totalmente ouvinte, nem totalmente surda) | A turma inteira aprende e usa Libras, o que normaliza a língua sem apontá-la |
| Interesses: teatro, séries legendadas, música | Estética de "Temporada" (episódios, claquete, legenda) e Modo Produção (encenar o sinal) |

### 2.3 Riscos identificados e como o PRD os trata
| # | Risco | Mitigação (requisito) |
|---|---|---|
| R1 | Jogo da memória pode parecer infantil para 16 anos | Tema "Temporada/Episódios", duelo, Dicionário colecionável, arte sóbria, conceitos do eixo Mundo Digital (RF-30, RF-33, seção 11) |
| R2 | Conteúdo de Computação raso (só vocabulário) | Nível 4 (definições), Modo Produção, conceitos alinhados à BNCC Computação (seção 6) |
| R3 | A memória treina só **reconhecimento**, não produção do sinal | Modo Produção "Sinalize você" (RF-24) e regra "sinalizar antes de virar" nas equipes (RF-21) |
| R4 | Expor a Luedji ao apresentar o jogo "para ela" | Jogo apresentado como atividade da turma; treino individual antes; ninguém é escalado nominalmente por ela; câmera desligada por padrão (RF-17, RF-45, seção 8) |
| R5 | Cor do conceito no verso da carta entregaria os pares | Verso **sempre neutro**; ajuda só pelo botão de dica (RF-09) |
| R6 | Vídeos de origens diferentes com fundos ruins | Moldura padronizada de vídeo, fundo claro, `object-fit: contain`, checklist de curadoria (RF-35) |
| R7 | Câmera/Teachable Machine frustra quem está aprendendo e gera desconforto na turma | Extra opcional, desligado, sem pontuação, com autoavaliação alternativa (seção 14) |
| R8 | Internet instável na escola | Tudo local, sem CDN no MVP, modo `file://` funcional (RNF-02) |

### 2.4 Atenção na ficha pedagógica
A solicitação é "Libras como elemento central", e o caso pede "comunicação acessível **sem depender exclusivamente** da Libras". A justificativa a registrar na ficha: **Libras é o protagonista do conteúdo (todo conceito é aprendido por ela), sempre pareada com o português escrito, e a escrita é retirada gradualmente conforme o perfil de aquisição da Luedji.**

---

## 3. Usuários e cenários

| Persona | Uso principal |
|---|---|
| **Luedji** (16 anos, aprendiz de Libras, alfabetizada) | Treino individual, Dicionário, desafio no laboratório, equipes no projetor |
| **Colega ouvinte** (iniciante em Libras) | Equipes, duelo, desafio; aprende os sinais junto |
| **Professor(a) / mediador(a)** | Configura sessão, abre modo projetor, cria desafio com código, lê o placar |

**Cenários:**
1. *Estudo solo:* Luedji abre o jogo em casa ou no laboratório, entra no Treino, usa câmera lenta e replay, e vê o Dicionário.
2. *Aula (25 min):* abertura com 3 sinais no projetor → Dicionário → rodada de equipes (níveis 1–2) → desafio no laboratório (níveis 3–4) → fechamento (cada equipe sinaliza seu conceito favorito).
3. *Apresentação da avaliação:* demo no projetor com duas equipes (duelo), depois uma pessoa joga o Nível 3.

---

## 4. Escopo por prioridade

| Entrega | Itens |
|---|---|
| **MVP (M)** | Menu, tutorial, níveis 1–5, modo Treino, modo Duelo, Dicionário, configurações de acessibilidade, progresso local, créditos |
| **Should (S)** | Modo Equipes (projetor), Desafio por código + placar manual, Modo Produção, UI com sinais, hint |
| **Could (C)** | Temporada com abertura de "cortina", conquistas, impressão das cartas (PDF) |
| **Extra opcional** | Fase "Sinalize!" com Teachable Machine (seção 14) |

---

## 5. Stack e arquitetura

### 5.1 Decisões de stack
| Item | Escolha | Motivo |
|---|---|---|
| Linguagem | HTML5 + CSS3 + **JavaScript puro (ES2020), scripts clássicos** | Roda ao dar duplo clique em `index.html` (módulos ES e `fetch` falham em `file://`) |
| Build | **Nenhum** (sem npm, sem bundler) | Menos risco; qualquer pessoa edita |
| Estilo | CSS com *custom properties* (tokens), sem framework | Controle de contraste e tamanho de fonte por tema |
| Dados | `js/data/conceitos.js` (objeto global), não JSON | Evita `fetch` em `file://` |
| Estado | Objeto em memória + `localStorage` | Progresso e configurações sem servidor |
| Vídeo | `<video>` nativo, `muted loop playsinline` | Sem dependências |
| Animação | CSS (`transform`, `opacity`) | Leve; respeita `prefers-reduced-motion` |
| Aleatoriedade | PRNG com semente (mulberry32) | Mesmo tabuleiro para todos no Desafio |
| Extra IA | Teachable Machine (TensorFlow.js) carregado só na fase extra | Isolado do núcleo |
| Hospedagem | Pasta local; opcional GitHub Pages/Netlify (HTTPS) | Câmera exige HTTPS ou `localhost` |

### 5.2 Estrutura de pastas
```
dicionario-vivo/
├─ index.html
├─ README.md                 # como abrir, como trocar conceitos
├─ creditos.md               # fonte e licença de cada vídeo/imagem
├─ css/
│  ├─ tokens.css             # cores, tipografia, espaçamento, temas
│  ├─ base.css               # reset, layout, foco, tipografia
│  └─ components.css         # carta, botões, modais, grade, vídeo
├─ js/
│  ├─ data/conceitos.js      # window.DVC_CONCEITOS
│  ├─ core/rng.js            # mulberry32 + hash de string
│  ├─ core/store.js          # settings + progresso (localStorage)
│  ├─ core/deck.js           # montagem do baralho por nível
│  ├─ core/game.js           # máquina de estados da partida
│  ├─ ui/video.js            # wrapper do <video> (replay, velocidade, fallback)
│  ├─ ui/card.js             # render e flip das cartas
│  ├─ ui/screens.js          # menu, nível, partida, dicionário, config, placar
│  ├─ ui/tutorial.js         # tutorial animado
│  ├─ extra/tm.js            # Teachable Machine (carregado sob demanda)
│  └─ main.js                # inicialização e roteamento por hash (#/menu)
└─ assets/
   ├─ videos/                # <id>.mp4 (e .webm opcional)
   ├─ img/                   # <id>.svg ou .png de alto contraste
   ├─ ui/                    # ícones, vídeos dos sinais da interface
   ├─ tm/                    # model.json, metadata.json, weights.bin (extra)
   └─ vendor/                # tf.min.js e teachablemachine-image.min.js (extra, offline)
```
Ordem dos `<script>` no `index.html`: `conceitos.js` → `rng.js` → `store.js` → `deck.js` → `game.js` → `video.js` → `card.js` → `tutorial.js` → `screens.js` → `main.js`. O `tm.js` e as libs do extra só são injetados quando a pessoa abre a fase "Sinalize!".

### 5.3 Roteamento
Hash simples (`#/menu`, `#/treino`, `#/jogo/n3`, `#/dicionario`, `#/config`, `#/equipes`, `#/desafio`, `#/placar`, `#/producao`). Botão "voltar" do navegador deve funcionar.

---

## 6. Conteúdo

### 6.1 Tema de Computação
Eixo **Mundo Digital** da BNCC Computação (Internet, redes, dados, segurança), adequado ao 2º ano do EM, com dois conceitos de Pensamento Computacional (ALGORITMO, ERRO/BUG).

### 6.2 Lista de conceitos
Preencher **a partir do que existir com sinal confiável no WikiLibras/INES** **[VALIDAR]**. Lista-alvo (8) e reserva (8):

| Alvo | Reserva |
|---|---|
| ALGORITMO, PROGRAMA, ARQUIVO, SENHA, INTERNET, REDE, COMPUTADOR, ERRO (BUG) | DADOS, NUVEM, SITE, E-MAIL, VÍRUS, BACKUP, TECLADO, TELA |

Regra: se um termo técnico não tiver sinal consolidado, **troque pelo da reserva** em vez de inventar sinal.

### 6.3 Esquema de dados (`js/data/conceitos.js`)
```js
window.DVC_CONCEITOS = [
  {
    id: "senha",                       // único, minúsculo, sem acento
    palavra: "SENHA",                  // português, caixa alta, 1 palavra se possível
    definicao: "Código secreto para entrar.", // ≤ 10 palavras
    categoria: "seguranca",            // pensamento | mundo-digital | seguranca
    video: "assets/videos/senha.mp4",  // 2–3 s, mudo, loop, < 500 KB
    imagem: "assets/img/senha.svg",    // alto contraste, fundo liso
    cor: "#1B4FD8",                    // cor de identidade (usada na moldura e no Dicionário)
    forma: "circulo",                  // circulo | quadrado | triangulo | losango | estrela | hexagono | cruz | gota
    fonte: "WikiLibras",               // origem do vídeo
    licenca: "[VALIDAR]",              // termos de uso/licença
    revisadoPor: "",                   // pessoa fluente que conferiu o sinal
    variante: "",                      // observação regional, se houver
    tm: null                           // extra: { classe: "senha" } se houver modelo para este sinal
  }
  // ...
];
```
**Fallback obrigatório:** se `video` não carregar, mostrar um **placeholder** (ícone de mãos + a palavra grande + texto "vídeo pendente"), para o protótipo funcionar antes de os vídeos chegarem.

### 6.4 Imagens
SVG de alto contraste (mínimo 7:1 entre figura e fundo), fundo liso, sem texto dentro da imagem, estilo gráfico único (ícone simples). Para o protótipo, gerar SVGs simples por conceito.

---

## 7. Regras de jogo

### 7.1 Níveis ("Episódios" da Temporada 1)
| Nível | Nome | Carta A | Carta B | Carta C | Pares/Trios | Grade |
|---|---|---|---|---|---|---|
| 1 | Conhecer | Sinal + palavra | Imagem + palavra | — | 6 pares | 4×3 |
| 2 | Reconhecer | Sinal (sem palavra) | Imagem + palavra | — | 8 pares | 4×4 |
| 3 | Visualizar | Sinal | Imagem (sem palavra) | — | 8 pares | 4×4 |
| 4 | Definir | Sinal | Definição (texto curto) | — | 8 pares | 4×4 |
| 5 | Trio | Sinal | Palavra | Imagem | 5 trios | 5×3 |

Os números são configuráveis em constante (`NIVEIS` em `deck.js`). Se houver menos conceitos que o necessário, o nível usa todos os disponíveis (mínimo 4).

### 7.2 Mecânica (pares)
1. Todas as cartas começam viradas, com **verso neutro** (mesmo desenho em todas).
2. O jogador vira **2 cartas** (3 no Nível 5).
3. Carta de sinal: o vídeo toca em **loop**, mudo, assim que vira.
4. **Combinou:** as cartas ficam abertas, recebem destaque (brilho de "holofote", sem piscar) e o conceito é marcado como *descoberto* no Dicionário.
5. **Não combinou:** as cartas permanecem visíveis (padrão 3 s, ajustável de 2 a 5 s, ou "até eu tocar") e depois viram. Feedback textual suave: **"Quase! Tente de novo."** Nunca "Errado".
6. O nível termina quando todos os grupos são encontrados. Tela de conclusão com resumo (tentativas, conceitos novos) e botões "Próximo episódio", "Repetir", "Dicionário".

### 7.3 Dica
Botão **"Dica"** (ícone de lâmpada): revela por 2 s um par ainda não encontrado. No Treino é ilimitada; nos demais modos, 3 por partida. Não penaliza.

### 7.4 Estrelas (visuais, nunca punitivas)
Concluir = no mínimo 1 estrela. 2 estrelas se tentativas ≤ 2× o nº de grupos; 3 estrelas se ≤ 1,5×. Ficam no menu de episódios.

### 7.5 Estados do conceito
- **Descoberto:** foi combinado em qualquer nível.
- **Dominado:** foi combinado nos níveis 3, 4 ou 5 (sem apoio escrito), ou autoavaliado "Fiz igual" no Modo Produção.

---

## 8. Modos de jogo

| Modo | Participantes | Descrição | Prioridade |
|---|---|---|---|
| **Treino** | 1 | Sem placar e sem tempo; só tentativas e progresso. Modo padrão e mais seguro | M |
| **Duelo** | 2 (mesmo computador) | Alternam turnos; quem forma grupo joga de novo; vence quem tiver mais grupos | M |
| **Equipes (projetor)** | 2 a 6 equipes | Como o duelo, com regra de sinal e silêncio | S |
| **Desafio por código** | Turma, cada um no seu PC | Mesmo tabuleiro por semente; resultados comparados manualmente | S |
| **Produção ("Sinalize você")** | 1 ou equipe | Mostra palavra e imagem, esconde o sinal; a pessoa sinaliza e depois confere | S |

**Princípio de não exposição (R4):** nenhum modo escolhe, destaca ou nomeia a Luedji. A distribuição de equipes é feita pelo(a) professor(a). O rodízio é por **equipe**, não por pessoa.

---

## 9. Telas e fluxo

```
Menu ─┬─ Jogar ─┬─ Treino ── Episódios 1–5 ── Partida ── Conclusão
      │         ├─ Duelo ─── (config nomes/ícones) ─ Episódio ─ Partida
      │         ├─ Equipes ─ (config equipes) ─ Episódio ─ Partida
      │         └─ Desafio ─ (código) ─ Episódio ─ Partida ─ Resultado ─ Placar
      ├─ Dicionário (galeria) ─ Detalhe do conceito
      ├─ Produção ("Sinalize você")
      ├─ Como jogar (tutorial)
      └─ Configurações · Créditos
```

### 9.1 Descrição por tela
**Menu:** logo e título, botões grandes (ícone + palavra + sinal opcional), botão "Como jogar" sempre visível, indicador de progresso da temporada.
**Tutorial:** 4 passos animados, cada um com ícone, **frase de até 6 palavras** e demonstração visual (mão virando carta, vídeo tocando, par brilhando, "Quase!"). Pode pular e rever. Sem áudio.
**Episódios:** 5 cartões "Episódio N — Nome" com estrelas e prévia do tipo de carta (ícones das faces).
**Partida:** barra superior (voltar, pausa, dica, tentativas, pares encontrados), grade de cartas no centro, faixa de status ("Sua vez", "Quase!") em área fixa com `aria-live="polite"`.
**Conclusão:** resumo visual (estrelas, conceitos novos com mini-vídeo), botões.
**Dicionário:** grade de cartas-conceito; filtro Todos/Descobertos/Dominados; tocar abre detalhe com vídeo grande, velocidade, palavra, imagem, definição; conceitos não descobertos aparecem como silhueta com "?" e podem ser abertos (estudo livre não é bloqueado).
**Configurações:** ver RF-40.

---

## 10. Requisitos funcionais

### 10.1 Núcleo da partida
| ID | Requisito | Prior. | Critério de aceite |
|---|---|---|---|
| RF-01 | Gerar baralho conforme o nível (seção 7.1) a partir de `DVC_CONCEITOS` | M | Cada nível gera o nº correto de cartas com as faces certas |
| RF-02 | Embaralhar com PRNG semeado; sem semente, usar semente aleatória | M | Mesma semente + mesmo nível → mesma ordem |
| RF-03 | Virar até 2 cartas (3 no Nível 5) por jogada; bloquear cliques durante a resolução | M | Clicar rápido não gera estados inválidos |
| RF-04 | Detectar grupo correto (mesmo `conceitoId`, faces diferentes) | M | Teste com todas as combinações dos 5 níveis |
| RF-05 | Cartas de sinal tocam vídeo em loop ao virar e pausam ao desvirar | M | Apenas vídeos de cartas viradas consomem recursos |
| RF-06 | Mostrar cartas erradas pelo tempo configurado ou até toque | M | Setting aplicado em tempo real |
| RF-07 | Feedback visual de acerto (holofote) e de "quase" (texto + leve tremor, desativável) | M | Sem piscar mais de 3 vezes por segundo |
| RF-08 | Contar tentativas e grupos encontrados | M | Valores visíveis e corretos ao final |
| RF-09 | Botão "Dica" conforme 7.3 | S | Revela um par por 2 s e respeita o limite |
| RF-10 | Tela de conclusão com estrelas (7.4) | M | Sempre ≥ 1 estrela ao concluir |
| RF-11 | Pausa com menu (continuar, reiniciar, sair) | M | Reiniciar mantém a semente |
| RF-12 | Reiniciar nível com novo embaralhamento ou mesma semente (escolha) | S | Ambos funcionam |

### 10.2 Vídeo
| ID | Requisito | Prior. | Critério de aceite |
|---|---|---|---|
| RF-13 | Todo vídeo tem botão **Replay** (reinicia do começo) visível na própria carta virada | M | Presente em todas as cartas de sinal |
| RF-14 | Controle de velocidade **0,5× / 0,75× / 1×**, lembrado nas configurações | M | `playbackRate` aplicado a todos os vídeos |
| RF-15 | Vídeo sempre `muted`, `loop`, `playsinline`, sem controles nativos | M | Nenhum áudio é reproduzido |
| RF-16 | Placeholder de vídeo ausente (6.3) | M | Jogo funciona sem nenhum vídeo na pasta |
| RF-17 | Aviso discreto (ícone) se o vídeo falhar; nunca mensagem técnica | S | Mensagem em ≤ 6 palavras |

### 10.3 Modos
| ID | Requisito | Prior. | Critério de aceite |
|---|---|---|---|
| RF-18 | **Treino:** sem tempo e sem placar; dicas ilimitadas | M | Nenhum cronômetro visível |
| RF-19 | **Duelo:** 2 jogadores com nome editável e ícone (forma + cor); alternância de turno; repete turno ao acertar | M | Indicador de vez sempre visível |
| RF-20 | **Equipes:** 2–6 equipes, nomes e ícones; rodízio automático de equipe | S | Ordem correta após acerto/erro |
| RF-21 | **Regra do sinal** (opcional, ligada por padrão em Equipes): antes de virar, a equipe aperta "Sinalizamos ✔" (honra) | S | Virar bloqueado até o botão |
| RF-22 | **Tempo de combinar** (opcional): contagem regressiva visual (anel) de 15 a 30 s, sem som | C | Termina sem travar o jogo |
| RF-23 | **Desafio por código:** campo de código (texto livre) gera a semente; resultado final em texto copiável `DVC1-<codigo>-N<n>-T<tentativas>-S<segundos>-<apelido>` | S | Mesmo código gera o mesmo tabuleiro em PCs diferentes |
| RF-24 | **Placar do desafio:** área para colar várias linhas de resultado e exibir tabela ordenada por tentativas e tempo | S | Linhas inválidas são ignoradas com aviso |
| RF-25 | **Produção:** sorteia conceito; mostra palavra, imagem e definição; vídeo oculto; botão "Ver sinal" revela o vídeo; autoavaliação **"Fiz igual / Quase / Preciso treinar"** | S | "Fiz igual" marca *dominado*; sem pontuação |
| RF-26 | Modo Produção em equipe: a equipe sinaliza para a turma antes de revelar | C | Opção "Mostrar para a turma" aumenta o vídeo |

### 10.4 Dicionário e progresso
| ID | Requisito | Prior. | Critério de aceite |
|---|---|---|---|
| RF-27 | Galeria com todos os conceitos (vídeo, palavra, imagem, definição) | M | Abre o detalhe de qualquer conceito |
| RF-28 | Marcar *descoberto* e *dominado* (7.5) com selo visual (ícone + texto, não só cor) | M | Estados persistem após recarregar |
| RF-29 | Filtros Todos/Descobertos/Dominados | S | Contagem correta |
| RF-30 | Tela de progresso da Temporada: episódios, estrelas, conceitos dominados (n/total) | S | Reflete o `localStorage` |
| RF-31 | Salvar e carregar progresso e configurações em `localStorage` (`dvc.v1.settings`, `dvc.v1.progress`) | M | Funciona mesmo com `localStorage` bloqueado (cai para memória sem quebrar) |
| RF-32 | Botão "Apagar progresso" com confirmação por ícone + frase curta | S | Zera apenas dados do jogo |

### 10.5 Conteúdo e interface
| ID | Requisito | Prior. | Critério de aceite |
|---|---|---|---|
| RF-33 | Tema visual "Temporada" (episódios, claquete, legenda). Opcional: animação de cortina ao iniciar episódio (desativável) | S | Respeita `prefers-reduced-motion` |
| RF-34 | Tutorial animado (seção 9.1), disponível a qualquer momento | M | 4 passos, ≤ 6 palavras por frase |
| RF-35 | Moldura padrão de vídeo (fundo claro, `object-fit: contain`, proporção fixa) | M | Vídeos de origens diferentes ficam visualmente consistentes |
| RF-36 | **UI com sinais:** botões principais (Jogar, Dicionário, Dica, Pausa, Replay) com mini-vídeo/ícone do sinal ao lado do rótulo, quando existir em `assets/ui/` | S | Ausência de arquivo não quebra o botão |
| RF-37 | Texto de interface: rótulos de 1–3 palavras; frases de até 8 palavras; sem parágrafos | M | Auditoria de textos |
| RF-38 | Créditos: lista fonte e licença de cada vídeo/imagem a partir de `conceitos.js` | M | Gerada automaticamente |
| RF-39 | Modo projetor: ampliar interface (≥ 1,25×), ocultar elementos secundários | S | Legível a 6 m em 1080p |
| RF-40 | **Configurações:** tamanho da fonte (M/G/GG); contraste (padrão/alto/escuro); legendas (automáticas por nível / sempre ligadas); velocidade padrão do vídeo; tempo de revelação (2–5 s / até tocar); reduzir animações; modo projetor; câmera (extra) | M | Todas persistem e se aplicam sem recarregar |

### 10.6 Teclado e toque
| ID | Requisito | Prior. | Critério de aceite |
|---|---|---|---|
| RF-41 | Navegação por teclado: setas movem o foco na grade; Enter/Espaço viram; `R` repete o vídeo focado; `Esc` pausa | M | Partida completa sem mouse |
| RF-42 | Alvos de toque ≥ 44×44 px | M | Verificado em 360×640 |

---

## 11. Requisitos de acessibilidade (RA)

| ID | Requisito |
|---|---|
| RA-01 | **Nenhuma informação por som.** O jogo não emite áudio em nenhuma situação |
| RA-02 | Todo vídeo de sinal tem **legenda em português** nos níveis 1–2 (palavra) e é retirada nos níveis 3–5 conforme a tabela 7.1; a configuração "legendas sempre ligadas" mantém a palavra visível |
| RA-03 | Contraste mínimo 4,5:1 para texto e 3:1 para elementos de interface (WCAG 2.1 AA); tema "alto contraste" ≥ 7:1 |
| RA-04 | **Cor nunca é a única informação:** acerto/erro, jogador/equipe e estados usam ícone + texto + forma |
| RA-05 | Fonte base ≥ 20 px; fonte sem serifa, legível; tamanho ajustável |
| RA-06 | Textos curtos (RF-37); instruções por demonstração animada, não por parágrafo |
| RA-07 | Foco de teclado sempre visível (contorno ≥ 3 px) |
| RA-08 | `prefers-reduced-motion` desativa flip 3D, tremor e cortina (usar *fade*) |
| RA-09 | Nenhum elemento pisca mais de 3 vezes por segundo |
| RA-10 | Cartas e botões com `aria-label` descritivo (ex.: "Carta de sinal: SENHA, virada"); `lang="pt-BR"` |
| RA-11 | Status em área `aria-live="polite"` e também visível na tela |
| RA-12 | Vídeos em fundo liso/claro, 2–3 s, rosto e mãos visíveis, sem corte do tronco superior |
| RA-13 | Sem limite de tempo por padrão; tempo só em modos competitivos opcionais |
| RA-14 | Pedir repetição é sempre silencioso e imediato (replay/câmera lenta), sem registro visível para outros |
| RA-15 | Linguagem do jogo sem "errado", "falhou", "perdeu" |

---

## 12. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF-01 | Compatível com Chrome e Edge recentes (laboratório) e Firefox; mobile Chrome/Safari como secundário |
| RNF-02 | Abrir por duplo clique (`file://`) sem erros de CORS; **zero dependência de CDN no MVP** |
| RNF-03 | Pasta total ≤ 30 MB (8 vídeos ≤ 500 KB cada + imagens) |
| RNF-04 | Primeira tela interativa em ≤ 2 s em PC de laboratório |
| RNF-05 | 60 fps no flip das cartas em PC modesto (usar `transform`/`opacity`); desligar animações pesadas se `reduced-motion` |
| RNF-06 | Responsivo: 1920×1080 (projetor), 1366×768 (laboratório), 360×640 (celular) |
| RNF-07 | Sem coleta de dados pessoais, sem rede, sem cookies. Resultados só saem do PC por cópia manual |
| RNF-08 | Código comentado em português nas partes de regra de jogo; funções pequenas |
| RNF-09 | Lighthouse Accessibility ≥ 95 na tela de partida |
| RNF-10 | Trocar/adicionar conceito exige editar apenas `conceitos.js` e colocar os arquivos em `assets/` |

---

## 13. Design visual

**Direção:** estética de "série/teatro", sóbria e adulta, com arte original (sem uso de imagem ou semelhança de pessoas reais). Paleta de poucas cores com alto contraste.

**Tokens iniciais (`tokens.css`):**
```css
:root {
  --bg: #0F1226;         /* fundo (tema escuro padrão do jogo) */
  --surface: #FFFFFF;    /* cartas e molduras de vídeo */
  --ink: #0B0D1F;        /* texto sobre superfície clara */
  --ink-inv: #FFFFFF;    /* texto sobre fundo escuro */
  --accent: #FFC83D;     /* destaque (holofote, foco) */
  --ok: #1F9D55;         /* acerto (sempre com ícone ✓) */
  --soft: #6B7AFF;       /* "quase" (sempre com texto) */
  --radius: 16px;
  --font: system-ui, "Segoe UI", Roboto, Arial, sans-serif;
  --fs-base: 1.25rem;    /* 20px; G = 1.5rem; GG = 1.75rem */
}
:root[data-contrast="alto"] { --bg:#000; --surface:#fff; --ink:#000; --accent:#FFFF00; }
:root[data-theme="claro"]   { --bg:#F4F5FA; --ink-inv:#0B0D1F; }
```
**Carta:** proporção 4:5, verso neutro com ícone de claquete; frente em fundo branco, moldura na `cor` do conceito (só visível após virar) e **forma** (ícone) no canto. Vídeo centralizado com `object-fit: contain`.

---

## 14. EXTRA — Teachable Machine (fase "Sinalize!")

### 14.1 O que é e o que NÃO é
Fase **opcional**, dentro do Modo Treino, em que a pessoa imita um sinal diante da câmera e o jogo mostra **"Parece com: X (72%)"**. É um **espelho de apoio**, não uma avaliação.

**Limitações que devem constar na ficha:**
- O modelo de **Image Project** classifica **imagens isoladas**: reconhece **configuração de mão**, não **movimento**, **ponto de articulação**, **orientação** nem **expressão facial**, que são parâmetros da Libras. Logo, "o modelo reconheceu" ≠ "o sinal está correto".
- A maioria dos sinais é dinâmica. Só entram no modelo sinais com **pose final estática reconhecível** **[VALIDAR com pessoa fluente/dicionário]**.
- O modelo erra mais com pessoas e mãos que **não estavam no treino** (tons de pele, canhotos, iluminação).

### 14.2 Requisitos do extra
| ID | Requisito | Prior. | Critério de aceite |
|---|---|---|---|
| RF-45 | A câmera é **desligada por padrão**. Abrir exige ação explícita + diálogo curto (ícone de câmera, "A imagem fica só no seu computador") | M (do extra) | Nada ativa a câmera sem clique |
| RF-46 | Botão "Sinalize!" só aparece nos conceitos com `tm` definido em `conceitos.js` | M | Conceitos sem modelo não mostram o botão |
| RF-47 | Tela: vídeo do sinal-alvo à esquerda, câmera espelhada à direita, guia de enquadramento (contorno de mão/rosto), barra de probabilidade e botão "Parar câmera" | M | Layout funciona em 1366×768 |
| RF-48 | Feedback: "Parece com: X (NN%)". Se a classe-alvo ≥ **80% por 1 s contínuo**, mostrar ✓ "Parecido!". Caso contrário, "Tente de novo" com o vídeo ao lado. **Sem pontuação, sem "errado"** | M | Limiar e tempo configuráveis em constantes |
| RF-49 | **Autoavaliação sempre disponível** ("Fiz igual / Quase / De novo"), usável sem câmera | M | Funciona com a câmera desligada ou negada |
| RF-50 | Tratar erros: permissão negada, sem câmera, HTTPS ausente, modelo ausente → mensagem curta com ícone e volta para a autoavaliação | M | Nenhum erro de console visível à pessoa |
| RF-51 | **Privacidade:** nenhum frame é gravado, armazenado ou enviado; parar a câmera ao sair da tela, ao trocar de aba ou ao pausar | M | `webcam.stop()` chamado em todos os caminhos |
| RF-52 | Classe **"nenhum"** é ignorada na decisão de acerto | M | Mão relaxada ou fundo vazio não aciona ✓ |
| RF-53 | Não carregar as libs do TensorFlow até a pessoa abrir a fase | S | Rede/arquivos do extra ausentes no carregamento inicial |
| RF-54 | O extra nunca altera estados *dominado* automaticamente (só a autoavaliação altera) | M | ✓ da câmera não grava progresso |

### 14.3 O que precisa ser feito (passo a passo)

**A. Escolher os sinais (≈ meio dia)**
1. Da lista de conceitos, listar candidatos com **pose final estática** **[VALIDAR]** (o alfabeto manual também é uma opção para siglas; conferir quais letras têm movimento).
2. Limitar a **4–6 classes + a classe "nenhum"**.
3. Pedir a uma pessoa fluente que confirme que os sinais gravados para treino estão corretos.

**B. Coletar amostras (≈ 1–2 dias, trabalhoso)**
1. Em teachablemachine.withgoogle.com → *Image Project → Standard image model*.
2. **150–200 imagens por classe**, de **5 ou mais pessoas** (mãos e tons de pele diferentes, incluindo canhotos).
3. Variar distância (40–100 cm), ângulo leve, iluminação (luz do dia e de lâmpada) e fundo (parede lisa, ambiente da sala).
4. Classe **"nenhum"**: ≥ 200 imagens (mão relaxada, rosto, gestos aleatórios, fundo vazio, pessoas diferentes).
5. Gravar com a mesma proporção/enquadramento que o jogo usará (câmera de 320×320 espelhada).

**C. Treinar e testar (≈ 1 h + testes)**
1. Treinar com padrões (50 épocas, lote 16, taxa 0,001); revisar a precisão por classe e a matriz de confusão do Teachable Machine.
2. **Testar com pessoas que não participaram do treino.** Meta: ≥ 85% de acerto por classe e < 10% de falsos positivos na classe "nenhum".
3. Se uma classe confunde com outra, adicionar amostras ou trocar o sinal.

**D. Exportar (≈ 15 min)**
1. *Export Model → Tensorflow.js → Download* (não usar só o link de nuvem, que exige internet).
2. Descompactar em `assets/tm/` os arquivos `model.json`, `metadata.json` e `weights.bin`.
3. Copiar as libs para `assets/vendor/`: `tf.min.js` e `teachablemachine-image.min.js`. **Use as versões que o diálogo de exportação mostra no trecho de código** (o snippet oficial indica as versões compatíveis).

**E. Integrar (≈ meio dia)**
1. Criar `js/extra/tm.js` (esboço abaixo).
2. Adicionar `tm: { classe: "<nome exato da classe>" }` nos conceitos que têm modelo.
3. Criar a tela "Sinalize!" (RF-47) e o carregamento sob demanda das libs (RF-53).
4. **Servir por `http://localhost` ou HTTPS** (`python -m http.server` na pasta ou GitHub Pages): `file://` bloqueia o carregamento do modelo e a câmera.
5. Testar no laboratório da escola ou em ambiente equivalente (câmera, luz, fundo).

**F. Decisão go/no-go (26/11):** se o MVP não estiver estável, **cortar o extra**. A fase serve como demonstração.

### 14.4 Esboço de referência (`js/extra/tm.js`)
```js
// Esboço: ajustar nomes de arquivo/classe. Requer tmImage (lib do Teachable Machine) já carregada.
const TM = (() => {
  const BASE = "assets/tm/";
  const LIMIAR = 0.80, MANTER_MS = 1000, INTERVALO_MS = 120; // ~8 leituras/s
  let model, webcam, ativo = false, desde = null, ultimo = 0;

  async function iniciar(container, classeAlvo, onTexto, onAcerto) {
    model = model || await tmImage.load(BASE + "model.json", BASE + "metadata.json");
    webcam = new tmImage.Webcam(320, 320, true);   // true = espelhado
    await webcam.setup();                           // pede permissão da câmera
    await webcam.play();
    container.appendChild(webcam.canvas);
    ativo = true;
    requestAnimationFrame(function laco(t) {
      if (!ativo) return;
      webcam.update();
      if (t - ultimo > INTERVALO_MS) { ultimo = t; ler(classeAlvo, onTexto, onAcerto); }
      requestAnimationFrame(laco);
    });
  }

  async function ler(classeAlvo, onTexto, onAcerto) {
    const preds = await model.predict(webcam.canvas);   // [{className, probability}]
    const melhor = preds.reduce((a, b) => (b.probability > a.probability ? b : a));
    const alvo = preds.find(p => p.className === classeAlvo);
    onTexto(`Parece com: ${melhor.className} (${Math.round(melhor.probability * 100)}%)`);
    if (melhor.className === classeAlvo && alvo.probability >= LIMIAR) {
      desde = desde || performance.now();
      if (performance.now() - desde >= MANTER_MS) { desde = null; onAcerto(); }
    } else { desde = null; }
  }

  function parar() {
    ativo = false; desde = null;
    if (webcam) { webcam.stop(); webcam = null; }
  }
  return { iniciar, parar };
})();
// Chamar TM.parar() ao sair da tela, ao pausar e no evento 'visibilitychange'.
```

### 14.5 Riscos do extra
| Risco | Mitigação |
|---|---|
| Frustração por falso negativo | Sem pontuação; texto "Parece com…"; autoavaliação paralela (RF-49) |
| Desconforto com câmera em sala com 35 pessoas | Desligada por padrão; uso individual; não usar no projetor; aviso de privacidade (RF-45) |
| Viés do modelo (poucas pessoas no treino) | ≥ 5 pessoas, testes externos, documentar limitações na ficha |
| Ensinar sinal errado | Gravação/treino somente com sinais validados |
| Exige HTTPS/localhost e câmera | Testar antes; plano B = autoavaliação |
| Escopo estourar o prazo | Decisão go/no-go em 26/11 |

---

## 15. Plano de testes e critérios de aceite do protótipo

**Entrega do protótipo v0** (para ser gerado a partir deste PRD):
1. Pasta no formato da seção 5.2, abrindo por duplo clique.
2. 8 conceitos com **placeholders** de vídeo e SVGs simples; trocar por arquivos reais só por substituição em `assets/`.
3. Níveis 1–5, Treino, Duelo, Dicionário, Configurações, Tutorial, Progresso local (todos **M**), mais Equipes, Desafio, Produção (**S**) se couber.

**Checklist de aceite:**
- [ ] Jogo completo sem áudio e sem nenhuma requisição de rede
- [ ] Níveis 1–5 geram as faces corretas e terminam corretamente
- [ ] Mesma semente → mesmo tabuleiro em dois navegadores
- [ ] Replay e 0,5× funcionam em toda carta de sinal
- [ ] Partida inteira só com teclado
- [ ] Tema alto contraste e fonte GG sem quebrar layout
- [ ] `prefers-reduced-motion` desliga flip e tremor
- [ ] Nenhuma mensagem de "errado/perdeu"
- [ ] Layout ok em 1920×1080, 1366×768 e 360×640
- [ ] Progresso persiste; apagar progresso funciona
- [ ] Teste com 3 pessoas que nunca viram o jogo: entendem as regras **só pelo tutorial animado**
- [ ] Teste simulando ruído e projetor (leitura a distância)

---

## 16. Mapeamento para a avaliação (ficha pedagógica)

| Item da avaliação | Onde está neste PRD |
|---|---|
| Imagens e elementos visuais | 6.4, 7.1, 13 |
| Sinais em Libras na medida adequada | 6, 7.1 (retirada gradual), RF-13–RF-15, RF-36 |
| Pouca dependência de textos longos | RF-37, RA-06 |
| Instruções acessíveis | RF-34 (tutorial animado), RA-06 |
| Estratégias visuais de interação | RF-07, RF-19, RF-22, RA-04 |
| Adequação ao caso | Seções 2 e 8 |
| Lugar da Libras e por quê | 2.4 |
| Participação da turma ouvinte | 8 (Equipes, Duelo, Desafio), RF-21 |
| Regras, materiais, dinâmica, tempo, nº de participantes | 7, 8; aula de 25 min (seção 3) |
| Fundamentação | 17 |

---

## 17. Fundamentação (referências sugeridas)
**Confirmar dados completos antes de citar na ficha.** Devem ser **a base do jogo**, então citar também as fontes dos sinais.

- BRASIL. **Lei nº 10.436/2002** (reconhece a Libras) e **Decreto nº 5.626/2005** (regulamenta, incluindo a educação bilíngue).
- BRASIL. **Lei nº 13.146/2015** (Lei Brasileira de Inclusão).
- BRASIL. CNE. **Normas sobre Computação na Educação Básica — Complemento à BNCC** (Parecer CNE/CEB nº 2/2022).
- QUADROS, R. M.; KARNOPP, L. B. **Língua de sinais brasileira: estudos linguísticos**. Porto Alegre: Artmed, 2004.
- STROBEL, K. **As imagens do outro sobre a cultura surda**. Florianópolis: UFSC, 2008.
- CAMPELLO, A. R. S. **Pedagogia visual na educação dos surdos-mudos** (tese, UFSC, 2008).
- GESSER, A. **Libras? Que língua é essa?** São Paulo: Parábola, 2009.
- LACERDA, C. B. F. A inclusão escolar de alunos surdos: o que dizem alunos, professores e intérpretes sobre essa experiência. **Cadernos CEDES**, 2006.
- WING, J. M. Computational thinking. **Communications of the ACM**, 2006.
- W3C. **WCAG 2.1** (acessibilidade web).
- Fontes dos sinais: **WikiLibras/VLibras** (conferir termos de uso) **[VALIDAR]**; dicionário do **INES**; Spread the Sign (se usado).

---

## 18. Cronograma (16/11 → 01/12)

| Data | Atividade |
|---|---|
| 16–17/11 | Fechar lista de conceitos; baixar e converter vídeos (FFmpeg: mudo, 2–3 s, ≤ 500 KB); verificar licença; pedir revisão de sinais |
| 18–22/11 | Gerar e ajustar protótipo MVP (níveis, Treino, Duelo, Dicionário, Config, Tutorial) |
| 23–24/11 | Equipes, Desafio, Produção; passada de acessibilidade |
| 25–26/11 | Teste com colegas (projetor, ruído, teclado); correções; **go/no-go do extra** |
| 27–28/11 | Extra Teachable Machine (se aprovado) |
| 28–30/11 | Ficha pedagógica; cartas físicas opcionais; ensaio da apresentação |
| 01/12 | Entrega (jogo + ficha no Google Classroom) |

---

## 19. Decisões em aberto
1. Quais conceitos têm sinal confiável e licença de uso no WikiLibras? **[VALIDAR]**
2. Os vídeos baixados são de pessoa ou de avatar 3D? (muda o texto da fundamentação)
3. Quem fará a revisão dos sinais (pessoa fluente ou professora)?
4. A escola/laboratório tem webcam e permite acesso a ela? (só para o extra)
5. Haverá versão física de apoio (cartas impressas em P&B, dado que a impressão pode ser limitada)?
