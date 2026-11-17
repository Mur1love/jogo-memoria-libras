/**
 * DVC — Ponto de Entrada Principal da Aplicação
 * Orquestra o ciclo de vida da partida, navegação por teclado e acessibilidade.
 */
document.addEventListener('DOMContentLoaded', function() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const settings = window.DVC_STORE ? window.DVC_STORE.getSettings() : { revealDelay: 2500 };

  // Aplica tokens de tema e contraste
  if (settings.contrast === 'alto') {
    document.documentElement.setAttribute('data-contrast', 'alto');
  }
  if (settings.theme === 'claro') {
    document.documentElement.setAttribute('data-theme', 'claro');
  }

  // Estrutura de containers
  appContainer.innerHTML = `
    <div id="hud-container"></div>
    <main class="board-container">
      <div id="board" class="board-grid" role="region" aria-label="Tabuleiro do Jogo da Memória"></div>
    </main>
    <div id="modal-root"></div>
  `;

  const hudContainer = document.getElementById('hud-container');
  const boardEl = document.getElementById('board');
  const modalRoot = document.getElementById('modal-root');

  let activeGame = null;
  let cardComponents = new Map();
  let mismatchTimeout = null;
  let mismatchStartTime = 0;
  let hud = null;

  function clearMismatchTimer() {
    if (mismatchTimeout) {
      clearTimeout(mismatchTimeout);
      mismatchTimeout = null;
    }
  }

  function handleDismissMismatch() {
    if (!activeGame) return;
    clearMismatchTimer();
    const unrevealed = activeGame.dismissMismatch();
    if (unrevealed) {
      unrevealed.forEach(c => {
        const comp = cardComponents.get(c.cardId);
        if (comp) {
          comp.setShake(false);
          comp.flip(false);
        }
      });
    }
    if (hud) {
      hud.setFeedback('', '');
    }
  }

  function onCardClick(cardData, cardEl) {
    if (!activeGame) return;

    // Se estiver em mismatch recente (< 400ms do tremor), ignora cliques concorrentes rápidos
    const stateBefore = activeGame.getState();
    if (stateBefore.status === 'checking') {
      if (Date.now() - mismatchStartTime < 400) {
        return;
      }
      handleDismissMismatch();
    }

    const res = activeGame.flipCard(cardData.cardId);

    if (res.status === 'ignored') {
      return;
    }

    const comp = cardComponents.get(cardData.cardId);
    if (comp) {
      comp.flip(true);
    }

    const state = activeGame.getState();
    if (hud) {
      hud.updateStats(state.attempts, state.matchedPairs, state.totalPairs);
    }

    if (res.status === 'match') {
      res.cards.forEach(c => {
        const matchedComp = cardComponents.get(c.cardId);
        if (matchedComp) {
          matchedComp.setMatched();
        }
      });
      if (hud) {
        hud.setFeedback('Par encontrado!', 'ok', 1800);
      }
    } else if (res.status === 'mismatch') {
      mismatchStartTime = Date.now();
      res.cards.forEach(c => {
        const mismatchedComp = cardComponents.get(c.cardId);
        if (mismatchedComp) {
          mismatchedComp.setShake(true);
        }
      });
      if (hud) {
        hud.setFeedback('Quase! Tente de novo.', 'soft', settings.revealDelay || 2500);
      }

      clearMismatchTimer();
      mismatchTimeout = setTimeout(function() {
        handleDismissMismatch();
      }, settings.revealDelay || 2500);

    } else if (res.status === 'finished') {
      res.cards.forEach(c => {
        const matchedComp = cardComponents.get(c.cardId);
        if (matchedComp) {
          matchedComp.setMatched();
        }
      });
      if (hud) {
        hud.setFeedback('Parabéns! Todos os conceitos encontrados!', 'ok', 3000);
      }

      setTimeout(function() {
        window.DVC_SCREENS.showVictoryModal(modalRoot, {
          stars: res.stars,
          attempts: res.attempts,
          onPlayAgain: startNewGame
        });
      }, 700);
    }
  }

  function handleHint() {
    if (!activeGame) return;
    const pair = activeGame.getHint();
    if (!pair) return;

    pair.forEach(card => {
      const comp = cardComponents.get(card.cardId);
      if (comp) {
        comp.setHint(true);
      }
    });

    if (hud) {
      hud.setFeedback('Observe as cartas iluminadas!', 'soft', 2000);
    }

    setTimeout(function() {
      pair.forEach(card => {
        const comp = cardComponents.get(card.cardId);
        if (comp) {
          comp.setHint(false);
        }
      });
    }, 2000);
  }

  function startNewGame() {
    clearMismatchTimer();
    cardComponents.clear();
    boardEl.innerHTML = '';
    modalRoot.innerHTML = '';

    const seed = 'partida_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const rng = window.DVC_RNG.create(seed);
    const deck = window.DVC_DECK.buildLevel(1, window.DVC_CONCEITOS, rng);

    activeGame = window.DVC_GAME.createSession({
      deck: deck,
      revealTimeMs: settings.revealDelay || 2500
    });

    if (!hud) {
      hud = window.DVC_SCREENS.createHUD(hudContainer, {
        totalPairs: Math.floor(deck.length / 2),
        onHint: handleHint,
        onRestart: startNewGame
      });
    } else {
      hud.updateStats(0, 0, Math.floor(deck.length / 2));
      hud.setFeedback('', '');
    }

    // Renderiza cartas no tabuleiro
    deck.forEach(cardData => {
      const comp = window.DVC_CARD.create(cardData, onCardClick);
      cardComponents.set(cardData.cardId, comp);
      boardEl.appendChild(comp.element);
    });

    setupKeyboardGridNavigation();

    // Retém foco na primeira carta para navegabilidade contínua
    const firstCard = boardEl.querySelector('.card');
    if (firstCard) {
      firstCard.focus();
    }
  }

  // Navegação por teclado na grade (RF-41)
  function setupKeyboardGridNavigation() {
    const cards = Array.from(boardEl.querySelectorAll('.card'));
    if (!cards.length) return;

    cards.forEach((card, index) => {
      card.addEventListener('keydown', function(e) {
        const cols = window.innerWidth <= 480 ? 3 : (window.innerWidth <= 768 ? 3 : 4);
        let targetIndex = null;

        if (e.key === 'ArrowRight') {
          targetIndex = (index + 1) % cards.length;
        } else if (e.key === 'ArrowLeft') {
          targetIndex = (index - 1 + cards.length) % cards.length;
        } else if (e.key === 'ArrowDown') {
          targetIndex = index + cols < cards.length ? index + cols : index % cols;
        } else if (e.key === 'ArrowUp') {
          targetIndex = index - cols >= 0 ? index - cols : (cards.length - (cols - (index % cols)));
          if (targetIndex >= cards.length) targetIndex = cards.length - 1;
        }

        if (targetIndex !== null && cards[targetIndex]) {
          e.preventDefault();
          cards[targetIndex].focus();
        }
      });
    });
  }

  startNewGame();
});
