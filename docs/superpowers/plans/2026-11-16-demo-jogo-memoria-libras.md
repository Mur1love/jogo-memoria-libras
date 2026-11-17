# Projeto Base Jogo da Memória em Libras (Dicionário Vivo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o projeto base funcional e acessível do Jogo da Memória em Libras ("Dicionário Vivo de Computação") para demonstração do Nível 1 com escolha de cartas, reprodução/fallback de vídeos de sinais, mecânica de match e pontuação.

**Architecture:** Aplicação client-side modular em Vanilla JS (scripts clássicos, sem bundler nem npm em runtime) compatível com execução direta (`file://` ou servidor estático). Segue arquitetura de camadas com separação entre dados (`conceitos.js`), lógica de domínio (`rng.js`, `deck.js`, `game.js`, `store.js`), componentes de interface (`video.js`, `card.js`, `screens.js`) e controlador central (`main.js`).

**Tech Stack:** HTML5, CSS3 moderno (tokens e CSS Grid/Flexbox), JavaScript Puro (ES2020), Node.js nativo (`node --test`) para testes automatizados unitários das regras de negócio.

**Spec:** `docs/superpowers/specs/2026-11-16-demo-jogo-memoria-libras-design.md` e `PRD_Dicionario_Vivo_Computacao.md`

## Global Constraints

- Zero dependência externa de CDN ou npm em runtime; executável localmente abrindo `index.html` (RNF-02).
- Zero áudio: nenhuma informação sonora, sons de bipe ou efeitos em qualquer circunstância (RA-01).
- Feedback não punitivo: mensagens encorajadoras ("Quase! Tente de novo.") e estrelas visuais nunca punitivas (RA-15, RF-07, 7.4).
- Textos curtos de interface: rótulos de 1–3 palavras e avisos curtos (RF-37).
- Resiliência total a vídeos ausentes: exibir placeholder visual animado com mãos e indicação "Vídeo pendente" sem quebrar o jogo (RF-16).
- Acessibilidade visual e teclado: navegação por setas, Enter/Espaço para virar, R para replay, foco visível >= 3px (RF-41, RA-07).

## Review Focus

1. **Tentativa rápida de cliques concorrentes:** Jogador clica em várias cartas em sequência rápida enquanto duas já estão em processo de validação de mismatch — deve ignorar cliques extras sem corromper o estado do jogo.
2. **Ausência física de arquivo de vídeo:** O arquivo `.mp4` especificado não existe em `assets/videos/` — o `<video>` emite evento de erro e a carta deve imediatamente mostrar o fallback elegante sem erro visual quebrado no console.
3. **Persistência com localStorage indisponível:** Navegador em modo anônimo estrito onde `localStorage` dispara exceção de segurança — o jogo deve degradar graciosamente para armazenamento em memória sem falhar.
4. **Navegação exclusiva por teclado e foco retido:** Foco do cursor durante virada e mismatch não deve ser perdido ou resetado para o início do body.
5. **Cálculo de estrelas de acordo com a proporção do PRD:** 1 estrela para conclusão básica; 2 estrelas se tentativas <= 2x grupos; 3 estrelas se <= 1.5x grupos.

---

### Task 1: Estrutura Base, Tokens CSS e Dados dos Conceitos

**Files:**
- Create: `css/tokens.css`
- Create: `css/base.css`
- Create: `js/data/conceitos.js`
- Test: `tests/conceitos.test.js`

**Interfaces:**
- Produces: `window.DVC_CONCEITOS` array global de objetos conceituais com o esquema:
  `{ id: string, palavra: string, definicao: string, categoria: string, video: string, imagem: string, cor: string, forma: string, fonte: string, licenca: string }`

- [ ] **Step 1: Escrever teste falhando para validação do esquema de dados de conceitos**

Criar `tests/conceitos.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('DVC_CONCEITOS deve conter pelo menos 6 conceitos válidos com todos os campos obrigatórios', () => {
  const code = fs.readFileSync('js/data/conceitos.js', 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const conceitos = sandbox.window.DVC_CONCEITOS;
  assert.ok(Array.isArray(conceitos), 'DVC_CONCEITOS deve ser um array');
  assert.ok(conceitos.length >= 6, 'Deve haver ao menos 6 conceitos para o Nível 1');

  const requiredFields = ['id', 'palavra', 'definicao', 'categoria', 'video', 'imagem', 'cor', 'forma'];
  for (const c of conceitos) {
    for (const field of requiredFields) {
      assert.ok(c[field], `Conceito ${c.id || 'desconhecido'} deve possuir o campo ${field}`);
    }
    assert.strictEqual(c.palavra, c.palavra.toUpperCase(), `Palavra ${c.palavra} deve estar em caixa alta`);
  }
});
```

- [ ] **Step 2: Executar teste para verificar falha**

Run: `node --test tests/conceitos.test.js`
Expected: FAIL (arquivo não existe)

- [ ] **Step 3: Implementar `css/tokens.css`, `css/base.css` e `js/data/conceitos.js`**

- `css/tokens.css`: criar tokens conforme PRD seção 13 (`--bg`, `--surface`, `--ink`, `--ink-inv`, `--accent`, `--ok`, `--soft`, `--radius`, `--font`, `--fs-base`, e variantes `data-contrast="alto"` e `data-theme="claro"`).
- `css/base.css`: reset moderno, box-sizing, tipografia, outline de foco acessível (>= 3px), e regra `prefers-reduced-motion`.
- `js/data/conceitos.js`: definir `window.DVC_CONCEITOS` com 8 conceitos: ALGORITMO, PROGRAMA, ARQUIVO, SENHA, INTERNET, REDE, COMPUTADOR, BUG.

- [ ] **Step 4: Executar teste para verificar sucesso**

Run: `node --test tests/conceitos.test.js`
Expected: PASS

---

### Task 2: Módulos de PRNG e Montagem de Baralho (Deck)

**Files:**
- Create: `js/core/rng.js`
- Create: `js/core/deck.js`
- Test: `tests/deck.test.js`

**Interfaces:**
- Consumes: `window.DVC_CONCEITOS`
- Produces:
  - `window.DVC_RNG.create(seed: string|number): { next(): number, shuffle<T>(array: T[]): T[] }`
  - `window.DVC_DECK.buildLevel(levelNumber: number, conceitos: Concept[], rng): Card[]`
  - Estrutura da carta: `{ cardId: string, conceitoId: string, tipoFace: 'sinal'|'imagem'|'palavra'|'definicao', conceito: Concept }`

- [ ] **Step 1: Escrever teste falhando para RNG e montagem do baralho do Nível 1**

Criar `tests/deck.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadModules() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('js/data/conceitos.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/core/rng.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/core/deck.js', 'utf8'), sandbox);
  return sandbox.window;
}

test('RNG com mesma semente produz sequência idêntica de embaralhamento', () => {
  const { DVC_RNG } = loadModules();
  const rng1 = DVC_RNG.create('teste-semente-123');
  const rng2 = DVC_RNG.create('teste-semente-123');
  const arr1 = rng1.shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  const arr2 = rng2.shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepStrictEqual(arr1, arr2);
});

test('DVC_DECK.buildLevel gera 6 pares (12 cartas) para o Nível 1 com faces complementares', () => {
  const { DVC_CONCEITOS, DVC_RNG, DVC_DECK } = loadModules();
  const rng = DVC_RNG.create('semente-nivel-1');
  const deck = DVC_DECK.buildLevel(1, DVC_CONCEITOS, rng);

  assert.strictEqual(deck.length, 12, 'Nível 1 deve ter 12 cartas');
  const countsByConceito = {};
  for (const card of deck) {
    countsByConceito[card.conceitoId] = (countsByConceito[card.conceitoId] || 0) + 1;
  }
  assert.strictEqual(Object.keys(countsByConceito).length, 6, 'Deve haver 6 conceitos distintos');
  for (const id in countsByConceito) {
    assert.strictEqual(countsByConceito[id], 2, `Cada conceito deve ter exatamente 2 cartas no par`);
  }

  // Verifica que um é tipo sinal e o outro é tipo imagem
  for (const id in countsByConceito) {
    const pair = deck.filter(c => c.conceitoId === id);
    const tipos = pair.map(c => c.tipoFace).sort();
    assert.deepStrictEqual(tipos, ['imagem', 'sinal']);
  }
});
```

- [ ] **Step 2: Executar teste para verificar falha**

Run: `node --test tests/deck.test.js`
Expected: FAIL (arquivos não encontrados)

- [ ] **Step 3: Implementar `js/core/rng.js` e `js/core/deck.js`**

- `js/core/rng.js`: Implementar algoritmo mulberry32 com conversão de hash para strings de semente (RF-02) e método `shuffle` (Fisher-Yates).
- `js/core/deck.js`: Implementar `window.DVC_DECK = { buildLevel(level, conceitos, rng) }`. Nível 1 usa 6 conceitos e cria para cada um:
  - Carta A: `tipoFace: 'sinal'`, com `exibirPalavra: true`
  - Carta B: `tipoFace: 'imagem'`, com `exibirPalavra: true`
  - Atribui `cardId: 'c_' + idx` único e embaralha com o `rng`.

- [ ] **Step 4: Executar teste para verificar sucesso**

Run: `node --test tests/deck.test.js`
Expected: PASS

---

### Task 3: Gerenciador de Armazenamento e Máquina de Estados da Partida (Game Engine)

**Files:**
- Create: `js/core/store.js`
- Create: `js/core/game.js`
- Test: `tests/game.test.js`

**Interfaces:**
- Produces:
  - `window.DVC_STORE`: `{ getSettings(), saveSettings(), getProgress(), markDiscovered(id), isDiscovered(id) }`
  - `window.DVC_GAME.createSession({ deck, revealTimeMs, onStateChange })`: Objeto da partida com métodos:
    - `flipCard(cardId): { status: 'flipped'|'match'|'mismatch'|'ignored', cards?: Card[] }`
    - `dismissMismatch(): void`
    - `getHint(): Card[] | null`
    - `getState(): { status, attempts, matchedPairs, totalPairs, stars, cards }`

- [ ] **Step 1: Escrever teste falhando para regras de match, mismatch, bloqueio e cálculo de estrelas**

Criar `tests/game.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadGameModules() {
  const sandbox = {
    window: {},
    localStorage: {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; }
    }
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('js/data/conceitos.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/core/rng.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/core/deck.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/core/store.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/core/game.js', 'utf8'), sandbox);
  return sandbox.window;
}

test('Partida gerencia viradas, match, mismatch e estrelas corretamente', () => {
  const { DVC_CONCEITOS, DVC_RNG, DVC_DECK, DVC_GAME } = loadGameModules();
  const rng = DVC_RNG.create('teste-jogo');
  const deck = DVC_DECK.buildLevel(1, DVC_CONCEITOS, rng);

  let stateUpdates = 0;
  const game = DVC_GAME.createSession({
    deck,
    revealTimeMs: 2500,
    onStateChange: () => { stateUpdates++; }
  });

  const card1 = deck[0];
  const cardMatch = deck.find(c => c.conceitoId === card1.conceitoId && c.cardId !== card1.cardId);
  const cardDifferent = deck.find(c => c.conceitoId !== card1.conceitoId);

  // Virada 1
  const res1 = game.flipCard(card1.cardId);
  assert.strictEqual(res1.status, 'flipped');

  // Virada 2 com carta diferente -> mismatch
  const res2 = game.flipCard(cardDifferent.cardId);
  assert.strictEqual(res2.status, 'mismatch');
  assert.strictEqual(game.getState().attempts, 1);

  // Tentativa de virar terceira carta durante mismatch deve ser ignorada
  const resBlocked = game.flipCard(cardMatch.cardId);
  assert.strictEqual(resBlocked.status, 'ignored');

  // Dismiss mismatch e vira o par correto
  game.dismissMismatch();
  game.flipCard(card1.cardId);
  const resMatch = game.flipCard(cardMatch.cardId);
  assert.strictEqual(resMatch.status, 'match');
  assert.strictEqual(game.getState().matchedPairs, 1);
  assert.strictEqual(game.getState().attempts, 2);

  // Teste cálculo de estrelas
  assert.strictEqual(DVC_GAME.calculateStars(6, 6), 3, 'Tentativas <= 1.5x grupos -> 3 estrelas');
  assert.strictEqual(DVC_GAME.calculateStars(10, 6), 2, 'Tentativas <= 2x grupos -> 2 estrelas');
  assert.strictEqual(DVC_GAME.calculateStars(20, 6), 1, 'Tentativas > 2x grupos -> 1 estrela (nunca zero)');
});

test('Store opera mesmo com localStorage quebrado/bloqueado', () => {
  const sandbox = {
    window: {},
    get localStorage() { throw new Error('SecurityError: LocalStorage is disabled'); }
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('js/core/store.js', 'utf8'), sandbox);
  const store = sandbox.window.DVC_STORE;

  // Não deve lançar erro
  assert.doesNotThrow(() => {
    store.saveSettings({ theme: 'alto' });
    const s = store.getSettings();
    assert.strictEqual(s.theme, 'alto');
  });
});
```

- [ ] **Step 2: Executar teste para verificar falha**

Run: `node --test tests/game.test.js`
Expected: FAIL (arquivos não encontrados)

- [ ] **Step 3: Implementar `js/core/store.js` e `js/core/game.js`**

- `js/core/store.js`: encapsular `localStorage` com `try/catch` para fallback transparente em memória RAM. Gerenciar `settings` (`revealDelay`, `playbackRate`, `contrast`) e progresso `dvc.v1.progress` (`discoveredConcepts: []`).
- `js/core/game.js`: máquina de estados da partida:
  - Fila de viradas ativas (máx 2).
  - Bloqueio imediato ao atingir 2 viradas.
  - Verificação de igualdade de `conceitoId`.
  - Tratamento de dica (`getHint`: retorna par não descoberto).
  - Função estática `calculateStars(attempts, totalPairs)`.

- [ ] **Step 4: Executar teste para verificar sucesso**

Run: `node --test tests/game.test.js`
Expected: PASS

---

### Task 4: Componentes de UI, Vídeo e Renderização de Cartas com Fallback

**Files:**
- Create: `css/components.css`
- Create: `js/ui/video.js`
- Create: `js/ui/card.js`
- Create: SVGs em `assets/img/` (algoritmo.svg, programa.svg, arquivo.svg, senha.svg, internet.svg, rede.svg, computador.svg, bug.svg)
- Create: SVGs em `assets/ui/` (claquete.svg, hands-placeholder.svg, lampada.svg, replay.svg)

**Interfaces:**
- Produces:
  - `window.DVC_VIDEO`: `{ render(videoSrc, palavra): HTMLElement, play(el), pause(el), replay(el) }`
  - `window.DVC_CARD`: `{ createCardElement(cardData, onClick): HTMLElement, flip(el, isFlipped), setMatched(el), highlight(el, boolean) }`

- [ ] **Step 1: Criar os SVGs de alta definição e contraste para imagens e ícones**

Criar os arquivos de imagem em `assets/img/` com formas geométricas e ícones representativos (7:1 de contraste) e os ícones em `assets/ui/`.

- [ ] **Step 2: Implementar `css/components.css`**

- Estilizar tabuleiro (`.board-grid`, 4 colunas responsivas).
- Estilizar carta (`.card`, `.card-inner`, `.card-front`, `.card-back`), proporção 4:5, flip 3D com `transform-style: preserve-3d` e transição suave (ou fade se `prefers-reduced-motion`).
- Efeito de holofote no acerto (`.card-matched`).
- Efeito de tremor suave desativável no quase (`.card-shake`).
- Estilos para HUD, botões acessíveis e modal de vitória.

- [ ] **Step 3: Implementar `js/ui/video.js`**

- Criação da tag `<video>` com `muted loop playsinline autoplay`.
- Tratamento de evento `error`: se o vídeo falhar em carregar (ex.: arquivo ainda não adicionado), remove o vídeo e exibe o container de fallback SVG com ícone de mãos e a etiqueta discreta *"Vídeo pendente"*.
- Inserção de botão discreto de **Replay** sobre a carta com `aria-label="Repetir sinal de [palavra]"`.

- [ ] **Step 4: Implementar `js/ui/card.js`**

- Criação do elemento DOM da carta com suporte completo a acessibilidade (`role="button"`, `tabindex="0"`, `aria-label`).
- Renderização da frente com a cor do conceito e símbolo de forma geométrica no canto superior.
- Suporte a eventos de clique e toque.

- [ ] **Step 5: Teste automatizado de criação de elemento de carta**

Criar `tests/card.test.js` para garantir integridade do DOM retornado (usando mock simples ou validação de string/estrutura):
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Arquivos CSS e JS de componentes contêm classes essenciais', () => {
  const css = fs.readFileSync('css/components.css', 'utf8');
  assert.ok(css.includes('.card'), 'Deve conter classe .card');
  assert.ok(css.includes('.card-matched'), 'Deve conter classe .card-matched');
  assert.ok(css.includes('.board-grid'), 'Deve conter classe .board-grid');

  const cardJs = fs.readFileSync('js/ui/card.js', 'utf8');
  assert.ok(cardJs.includes('aria-label'), 'Deve configurar aria-label nas cartas');
});
```
Run: `node --test tests/card.test.js`
Expected: PASS

---

### Task 5: Montagem do Tabuleiro, HUD, Telas e Controlador Principal

**Files:**
- Create: `js/ui/screens.js`
- Create: `js/main.js`
- Create: `index.html`
- Modify: `README.md` (instruções simples de execução e como colocar vídeos)

**Interfaces:**
- Consumes: Todos os módulos anteriores na ordem exata de scripts do PRD.
- Produces: Aplicação completa executável diretamente no navegador.

- [ ] **Step 1: Implementar `js/ui/screens.js`**

- Renderização do HUD com contadores:
  - Tentativas (`tentativas: X`)
  - Pares (`X / 6`)
  - Botão "Dica" (com contagem de dicas usadas)
  - Botão "Reiniciar"
- Renderização de mensagem `aria-live="polite"` para anúncio de eventos e avisos textuais suaves ("Quase! Tente de novo.", "Par encontrado!").
- Modal de conclusão da partida com exibição de estrelas (1 a 3), número de tentativas e botão para nova partida.

- [ ] **Step 2: Implementar `js/main.js`**

- Inicialização do jogo na carga do documento (`DOMContentLoaded`).
- Suporte a navegação por teclado na grade (Setas Cima/Baixo/Esquerda/Direita alteram o foco na matriz de cartas; Enter/Espaço viram a carta focada; tecla R aciona o replay da carta de sinal virada).
- Integração da máquina de estados com temporizador de mismatch e animações.

- [ ] **Step 3: Implementar `index.html`**

- Carregar folhas de estilo: `tokens.css`, `base.css`, `components.css`.
- Carregar scripts clássicos na ordem:
  1. `js/data/conceitos.js`
  2. `js/core/rng.js`
  3. `js/core/store.js`
  4. `js/core/deck.js`
  5. `js/core/game.js`
  6. `js/ui/video.js`
  7. `js/ui/card.js`
  8. `js/ui/screens.js`
  9. `js/main.js`
- Elemento principal `#app` contendo HUD, `#live-region`, `#board` e `#modal-root`.

- [ ] **Step 4: Executar validação de todos os testes unitários**

Run: `node --test tests/*.test.js`
Expected: PASS

---

### Task 6: Validação de Smoke End-to-End e Documentação de Uso

**Files:**
- Create: `README.md`
- Test: `tests/smoke.test.js`

- [ ] **Step 1: Criar teste de integridade smoke para o index.html e assets**

Criar `tests/smoke.test.js`:
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('index.html inclui todos os scripts na ordem correta exigida pelo PRD', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const expectedOrder = [
    'conceitos.js',
    'rng.js',
    'store.js',
    'deck.js',
    'game.js',
    'video.js',
    'card.js',
    'screens.js',
    'main.js'
  ];

  let lastIndex = -1;
  for (const script of expectedOrder) {
    const idx = html.indexOf(script);
    assert.ok(idx > -1, `Script ${script} deve estar presente no index.html`);
    assert.ok(idx > lastIndex, `Script ${script} deve vir após os anteriores`);
    lastIndex = idx;
  }
});

test('Todos os arquivos de conceitos e referências de imagens existem no projeto', () => {
  assert.ok(fs.existsSync('assets/videos'), 'Diretório assets/videos deve existir');
  assert.ok(fs.existsSync('assets/img'), 'Diretório assets/img deve existir');
  assert.ok(fs.existsSync('assets/ui'), 'Diretório assets/ui deve existir');
});
```

- [ ] **Step 2: Executar teste smoke**

Run: `node --test tests/smoke.test.js`
Expected: PASS

- [ ] **Step 3: Documentar instruções em `README.md`**

Criar `README.md` explicando:
- Como abrir o jogo (duplo clique em `index.html` ou live-server).
- Onde colocar os vídeos em `assets/videos/<id>.mp4` e como o fallback de vídeo funciona enquanto os arquivos não forem adicionados.
- Comandos de teclado suportados (Setas, Enter, Espaço, R).
