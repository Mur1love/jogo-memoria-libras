import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadGameModules() {
  const sandbox = {
    window: {},
    Array: globalThis.Array,
    Object: globalThis.Object,
    String: globalThis.String,
    Math: globalThis.Math,
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

  // Teste cálculo de estrelas (RF-10 / 7.4)
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
