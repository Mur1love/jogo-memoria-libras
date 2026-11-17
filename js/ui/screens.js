/**
 * DVC_SCREENS — Gerenciador de Telas, HUD, Mensagens de Status e Modais
 */
(function() {
  function createHUD(container, options) {
    const onHint = options.onHint || function() {};
    const onRestart = options.onRestart || function() {};

    container.innerHTML = `
      <header class="hud" role="region" aria-label="Painel de controle do jogo">
        <div class="hud-title">
          <span>🎬</span>
          <span>Dicionário Vivo — Conhecer</span>
        </div>
        <div class="hud-stats">
          <div class="hud-stat">
            <span class="hud-stat-label">Tentativas</span>
            <span class="hud-stat-value" id="hud-attempts">0</span>
          </div>
          <div class="hud-stat">
            <span class="hud-stat-label">Pares</span>
            <span class="hud-stat-value" id="hud-matches">0 / ${options.totalPairs || 6}</span>
          </div>
        </div>
        <div class="hud-actions">
          <button type="button" class="btn-action" id="btn-hint" aria-label="Pedir dica de um par">
            <img src="assets/ui/lampada.svg" alt="" aria-hidden="true" style="width:20px;height:20px;">
            <span>Dica</span>
          </button>
          <button type="button" class="btn-action" id="btn-restart" aria-label="Reiniciar partida">
            <span>Reiniciar</span>
          </button>
        </div>
      </header>
      <div id="feedback-region" class="feedback-banner" role="status" aria-live="polite"></div>
    `;

    const attemptsEl = container.querySelector('#hud-attempts');
    const matchesEl = container.querySelector('#hud-matches');
    const feedbackEl = container.querySelector('#feedback-region');
    const hintBtn = container.querySelector('#btn-hint');
    const restartBtn = container.querySelector('#btn-restart');

    hintBtn.addEventListener('click', onHint);
    restartBtn.addEventListener('click', onRestart);

    let feedbackTimeout = null;

    function updateStats(attempts, matches, totalPairs) {
      if (attemptsEl) attemptsEl.textContent = String(attempts);
      if (matchesEl) matchesEl.textContent = `${matches} / ${totalPairs}`;
    }

    function setFeedback(message, type, durationMs = 2500) {
      if (!feedbackEl) return;
      if (feedbackTimeout) clearTimeout(feedbackTimeout);

      feedbackEl.textContent = message;
      feedbackEl.className = 'feedback-banner';

      if (type === 'ok') {
        feedbackEl.classList.add('feedback-ok');
      } else if (type === 'soft') {
        feedbackEl.classList.add('feedback-soft');
      }

      if (durationMs > 0) {
        feedbackTimeout = setTimeout(() => {
          feedbackEl.textContent = '';
          feedbackEl.className = 'feedback-banner';
        }, durationMs);
      }
    }

    function setHintDisabled(disabled) {
      if (hintBtn) hintBtn.disabled = disabled;
    }

    return {
      updateStats,
      setFeedback,
      setHintDisabled
    };
  }

  function showVictoryModal(container, options) {
    const stars = options.stars || 1;
    const attempts = options.attempts || 0;
    const onPlayAgain = options.onPlayAgain || function() {};

    const starsStr = '⭐'.repeat(stars) + '☆'.repeat(Math.max(0, 3 - stars));

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'modal-victory-title');

    overlay.innerHTML = `
      <div class="modal-content">
        <h2 id="modal-victory-title" class="modal-title">Episódio Concluído!</h2>
        <div class="modal-stars" aria-label="Avaliação: ${stars} estrelas de 3">${starsStr}</div>
        <div class="modal-stats">
          <p>Você encontrou todos os pares em <strong>${attempts}</strong> tentativas.</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-action btn-primary" id="btn-play-again" style="padding:12px 24px; font-size:1.1rem;">
            Jogar Novamente
          </button>
        </div>
      </div>
    `;

    const playAgainBtn = overlay.querySelector('#btn-play-again');
    playAgainBtn.addEventListener('click', function() {
      overlay.remove();
      onPlayAgain();
    });

    container.appendChild(overlay);
    playAgainBtn.focus();
  }

  window.DVC_SCREENS = {
    createHUD,
    showVictoryModal
  };
})();
