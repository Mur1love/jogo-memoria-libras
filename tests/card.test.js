import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Arquivos CSS e JS de componentes contêm classes essenciais', () => {
  const css = fs.readFileSync('css/components.css', 'utf8');
  assert.ok(css.includes('.card'), 'Deve conter classe .card');
  assert.ok(css.includes('.card-matched') || css.includes('.card.is-matched'), 'Deve conter estilo para carta combinada');
  assert.ok(css.includes('.board-grid'), 'Deve conter classe .board-grid');
  assert.ok(css.includes('.btn-card-replay'), 'Deve conter botão de replay');
  assert.ok(css.includes('.video-placeholder'), 'Deve conter placeholder de vídeo');

  const cardJs = fs.readFileSync('js/ui/card.js', 'utf8');
  assert.ok(cardJs.includes('aria-label'), 'Deve configurar aria-label nas cartas');
  assert.ok(cardJs.includes('card-shape-badge'), 'Deve renderizar identificador de forma');

  const videoJs = fs.readFileSync('js/ui/video.js', 'utf8');
  assert.ok(videoJs.includes('video-placeholder'), 'Deve tratar fallback no erro do vídeo');
  assert.ok(videoJs.includes('replay'), 'Deve conter funcionalidade de replay');
});
