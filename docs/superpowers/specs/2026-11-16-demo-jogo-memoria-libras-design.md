# Design Document — Projeto Base do Jogo da Memória em Libras (Dicionário Vivo)

## 1. Intenção e Contexto (O "Porquê")
O objetivo é entregar o projeto base funcional ("Dicionário Vivo de Computação") para uma demonstração imediata para a professora do usuário. A demonstração precisa evidenciar com clareza **a ideia central do jogo funcionando**:
- Escolha e interação com cartas em um tabuleiro (tabuleiro de memória).
- Visualização de sinais em Libras através de vídeos (com suporte a fallback elegante para quando os arquivos ainda estiverem sendo adicionados pelo usuário).
- Mecânica de correspondência (match) entre sinal e conceito/palavra.
- Contagem de tentativas, pontuação/estrelas e tela de conclusão da partida.
- Aderência estrita à arquitetura e premissas de acessibilidade descritas no PRD (`PRD_Dicionario_Vivo_Computacao.md`).

---

## 2. Metas, Não-Metas e Anti-Metas

### Metas (Escopo da Demonstração)
1. **Estrutura de Arquivos e Execução Sem Dependências:**
   - Funcionar abrindo diretamente o `index.html` (via duplo clique `file://` ou servidor estático simples), sem bundler, sem npm e sem dependências externas de CDN.
2. **Tabuleiro e Cartas (Nível 1 - Conhecer):**
   - Grade responsiva (ex.: 4×3 com 6 pares = 12 cartas).
   - Pares conceituais: Carta A (Sinal em Libras com vídeo/placeholder + palavra) e Carta B (Imagem/Ícone + palavra), baseadas em `DVC_CONCEITOS`.
   - Verso neutro com estética do tema ("claquete/teatro") e frente clara de alto contraste com identificador visual do conceito (forma geométrica e cor de moldura).
3. **Mecânica de Jogo (Memória):**
   - Virar até 2 cartas por jogada com bloqueio de clique durante validação.
   - Detecção de par correto (mesmo `conceitoId`, faces complementares).
   - **Acerto (Match):** cartas permanecem abertas com destaque visual ("holofote" / borda de sucesso), incremento de pontuação/pares encontrados.
   - **Quase (Mismatch):** cartas aguardam tempo configurado (~2 a 3s) ou novo toque e viram de volta, exibindo mensagem amigável: *"Quase! Tente de novo."* (nunca termos negativos como "Errado").
4. **Reprodução de Vídeo e Resiliência:**
   - Tag `<video>` nativa (`muted`, `loop`, `playsinline`, sem áudio).
   - Botão **Replay** na carta virada para reiniciar o sinal.
   - **Fallback automático e gracioso:** caso o arquivo `.mp4` não esteja presente na pasta `assets/videos/`, exibir placeholder com ícone de mãos, palavra e selo visual *"Vídeo pendente"*, permitindo que a demonstração funcione perfeitamente antes dos vídeos reais serem inseridos.
5. **Painel de Controle e Status:**
   - Contador de tentativas e pares encontrados.
   - Botão de reiniciar partida e alternar semente/embaralhamento.
   - Botão de dica funcional (revela brevemente um par não descoberto).
6. **Tela de Conclusão / Vitória:**
   - Resumo da partida (número de tentativas, tempo e avaliação por estrelas não-punitiva: 1 a 3 estrelas conforme critério do PRD).
   - Botão para jogar novamente.
7. **Acessibilidade e Boas Práticas (PRD):**
   - Som estritamente ausente (RA-01).
   - Navegação completa por teclado (Setas navegam nas cartas, Enter/Espaço viram, R dá replay, Esc pausa).
   - `aria-live` para mensagens de status e `aria-label` descritivo nas cartas.
   - Contraste visual adequado segundo tokens do PRD.

### Não-Metas (Fases Futuras)
- Módulo Teachable Machine (TensorFlow.js / câmera).
- Modos avançados complexos (Duelo com alternância de turnos, rodízio de equipes com placar de texto compartilhado, e modo produção).
- Múltiplos níveis liberados (focaremos no Nível 1 - Conhecer para a demonstração base, com arquitetura preparada para Níveis 2 a 5).

### Anti-Metas
- Utilizar frameworks JS pesados (React, Vue, etc.) ou bundlers (Webpack, Vite) que impossibilitem rodar via `file://`.
- Inserir qualquer efeito sonoro ou bipe (infringindo a regra do PRD para público surdo e acessibilidade silenciosa).
- Usar mensagens punitivas ("Erro", "Você perdeu").

---

## 3. Arquitetura e Estrutura Técnica

Seguindo o PRD (Seção 5.2):
```
├── index.html
├── css/
│   ├── tokens.css             # Variáveis CSS, temas e alto contraste
│   ├── base.css               # Reset, tipografia base e layout
│   └── components.css         # Grade do tabuleiro, cartas, modais, vídeos
├── js/
│   ├── data/
│   │   └── conceitos.js       # window.DVC_CONCEITOS com os conceitos iniciais de Computação
│   ├── core/
│   │   ├── rng.js             # Gerador PRNG mulberry32 para embaralhamento determinístico
│   │   ├── store.js           # Gerenciamento de estado e persistência (localStorage resiliente)
│   │   ├── deck.js            # Lógica de criação de pares e embaralhamento do baralho
│   │   └── game.js            # Máquina de estados da partida (idle, checking, matched, finished)
│   ├── ui/
│   │   ├── video.js           # Componente de controle e fallback do vídeo
│   │   ├── card.js            # Renderização de carta, animação de flip e acessibilidade
│   │   └── screens.js         # Telas (partida, HUD, modal de vitória, dicas)
│   └── main.js                # Ponto de entrada, roteamento e eventos de teclado
└── assets/
    ├── videos/                # Destino dos arquivos mp4 (ex: algoritmo.mp4, senha.mp4)
    ├── img/                   # SVGs de apoio de alto contraste para cada conceito
    └── ui/                    # Ícones de interface (claquete, lâmpada/dica, replay, etc.)
```

### Ordem de Inclusão dos Scripts no `index.html`:
1. `js/data/conceitos.js`
2. `js/core/rng.js`
3. `js/core/store.js`
4. `js/core/deck.js`
5. `js/core/game.js`
6. `js/ui/video.js`
7. `js/ui/card.js`
8. `js/ui/screens.js`
9. `js/main.js`

---

## 4. Conceitos Iniciais (`DVC_CONCEITOS`)
Serão configurados 8 conceitos iniciais da lista-alvo do PRD (para o Nível 1, 6 pares serão sorteados/utilizados):
1. **ALGORITMO** (pensamento) - "Passo a passo para resolver um problema."
2. **PROGRAMA** (pensamento) - "Conjunto de instruções que o computador executa."
3. **ARQUIVO** (mundo-digital) - "Item salvo com informações no computador."
4. **SENHA** (seguranca) - "Código secreto para proteger o acesso."
5. **INTERNET** (mundo-digital) - "Rede mundial que conecta computadores."
6. **REDE** (mundo-digital) - "Computadores interligados compartilhando dados."
7. **COMPUTADOR** (mundo-digital) - "Máquina que processa dados e executa tarefas."
8. **BUG** (pensamento) - "Falha ou erro inesperado no sistema."

Cada conceito terá:
- `id`, `palavra`, `definicao`, `categoria`, `video` (`assets/videos/<id>.mp4`), `imagem` (`assets/img/<id>.svg`), `cor`, `forma`, `fonte` e `licenca`.

---

## 5. Mecânica Detalhada da Partida
- **Início:** Embaralha os 6 pares (12 cartas) usando o PRNG. As cartas iniciam viradas para baixo.
- **Clique/Seleção:** Ao clicar ou acionar via Enter/Espaço, a carta gira (flip 3D ou fade se `prefers-reduced-motion`).
- **Se for carta de sinal:** Inicia reprodução em loop contínuo e mudo. Se o arquivo de vídeo falhar em carregar, o fallback SVG/HTML exibe a animação do placeholder.
- **Ao virar a segunda carta:**
  - Trava novas interações no tabuleiro.
  - Incrementa contador de tentativas.
  - Compara `conceitoId`:
    - **Se coincidir (Match):** Mantém ambas abertas, aplica classe `.card-matched` com efeito de holofote, exibe feedback de sucesso ("Par encontrado!"), incrementa pares descobertos.
    - **Se não coincidir:** Aplica destaque suave, exibe feedback ("Quase! Tente de novo."), aguarda 2.5s (ou novo clique em qualquer lugar) e desvira as duas cartas, pausando qualquer vídeo.
- **Fim da Partida:**
  - Quando todos os pares forem encontrados, calcula estrelas (1 a 3 estrelas baseadas no número de tentativas).
  - Exibe modal de celebração com resumo estatístico e botão "Jogar Novamente" / "Reiniciar".

---

## 6. O que Fica a Cargo do Construtor (Builder)
- Geração dos SVGs de apoio de alto contraste e ícones da interface embutidos ou na pasta de assets.
- Ajuste fino dos micro-estilos em `tokens.css` e animações de flip.
- Implementação de mock handlers limpos para testes automatizados rápidos no navegador.
