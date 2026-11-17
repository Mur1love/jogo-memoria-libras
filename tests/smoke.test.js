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

  const requiredImages = [
    'algoritmo.svg',
    'programa.svg',
    'arquivo.svg',
    'senha.svg',
    'internet.svg',
    'rede.svg',
    'computador.svg',
    'bug.svg'
  ];

  for (const img of requiredImages) {
    assert.ok(fs.existsSync(`assets/img/${img}`), `Imagem assets/img/${img} deve existir`);
  }

  const requiredUiIcons = [
    'claquete.svg',
    'hands-placeholder.svg',
    'lampada.svg',
    'replay.svg'
  ];

  for (const icon of requiredUiIcons) {
    assert.ok(fs.existsSync(`assets/ui/${icon}`), `Ícone assets/ui/${icon} deve existir`);
  }
});
