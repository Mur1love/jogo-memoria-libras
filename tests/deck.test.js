import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadModules() {
  const sandbox = {
    window: {},
    Array: globalThis.Array,
    Object: globalThis.Object,
    String: globalThis.String,
    Math: globalThis.Math
  };
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
    assert.strictEqual(countsByConceito[id], 2, 'Cada conceito deve ter exatamente 2 cartas no par');
  }

  // Verifica que um é tipo sinal e o outro é tipo imagem
  for (const id in countsByConceito) {
    const pair = deck.filter(c => c.conceitoId === id);
    const tipos = pair.map(c => c.tipoFace).sort();
    assert.equal(tipos.join(','), 'imagem,sinal');
    for (const card of pair) {
      assert.strictEqual(card.exibirPalavra, true, 'No Nível 1 ambos exibem palavra');
      assert.ok(card.cardId, 'Deve possuir cardId');
    }
  }
});
