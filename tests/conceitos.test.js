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
