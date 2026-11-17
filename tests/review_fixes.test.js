import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('CSS define todas as formas geométricas e tamanho de toque >= 44px para o replay', () => {
  const css = fs.readFileSync('css/components.css', 'utf8');

  // Formas obrigatórias (RA-04)
  assert.ok(css.includes('.shape-estrela'), 'Deve conter .shape-estrela');
  assert.ok(css.includes('.shape-hexagono'), 'Deve conter .shape-hexagono');
  assert.ok(css.includes('.shape-cruz'), 'Deve conter .shape-cruz');

  // Alvo de toque do replay >= 44px (RF-42)
  assert.ok(css.includes('min-width: 44px'), 'Botão replay deve ter min-width >= 44px');
  assert.ok(css.includes('min-height: 44px'), 'Botão replay deve ter min-height >= 44px');
});

test('Replay button e atalho de teclado não expõem cartas viradas para baixo', () => {
  const cardJs = fs.readFileSync('js/ui/card.js', 'utf8');
  const videoJs = fs.readFileSync('js/ui/video.js', 'utf8');

  // Replay inicializado como inacessível enquanto carta virada para baixo
  assert.ok(videoJs.includes('tabIndex = -1') || videoJs.includes("setAttribute('tabindex', '-1')"), 'Replay deve iniciar com tabindex -1');
  assert.ok(videoJs.includes("setAttribute('aria-hidden', 'true')"), 'Replay deve iniciar com aria-hidden true');

  // Atalho R só executa se a carta estiver aberta
  assert.ok(cardJs.includes('isOpen') || cardJs.includes('is-flipped') || cardJs.includes('is-matched'), 'Atalho R deve checar se carta está aberta');
});
