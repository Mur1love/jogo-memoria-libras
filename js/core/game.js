/**
 * DVC_GAME — Máquina de estados da partida do Jogo da Memória
 * Controla virada de cartas, validação de pares, contagem de tentativas e pontuação/estrelas.
 */
(function() {
  function calculateStars(attempts, totalPairs) {
    if (totalPairs <= 0) return 1;
    if (attempts <= Math.floor(totalPairs * 1.5)) {
      return 3;
    }
    if (attempts <= totalPairs * 2) {
      return 2;
    }
    return 1;
  }

  function createSession(options) {
    const deck = options.deck || [];
    const onStateChange = options.onStateChange || function() {};
    const totalPairs = Math.floor(deck.length / 2);

    const cardsMap = new Map();
    deck.forEach(card => {
      cardsMap.set(card.cardId, {
        data: card,
        isFlipped: false,
        isMatched: false
      });
    });

    let flippedCards = [];
    let status = 'idle'; // 'idle' | 'checking' | 'finished'
    let attempts = 0;
    let matchedPairs = 0;

    function getState() {
      return {
        status,
        attempts,
        matchedPairs,
        totalPairs,
        stars: calculateStars(attempts, totalPairs),
        flippedCards: flippedCards.map(c => c.data),
        cards: Array.from(cardsMap.values())
      };
    }

    function notify() {
      onStateChange(getState());
    }

    function flipCard(cardId) {
      if (status === 'checking' || status === 'finished') {
        return { status: 'ignored' };
      }

      const entry = cardsMap.get(cardId);
      if (!entry || entry.isFlipped || entry.isMatched) {
        return { status: 'ignored' };
      }

      entry.isFlipped = true;
      flippedCards.push(entry);

      if (flippedCards.length === 1) {
        notify();
        return { status: 'flipped', card: entry.data };
      }

      if (flippedCards.length === 2) {
        attempts++;
        const first = flippedCards[0];
        const second = flippedCards[1];

        if (first.data.conceitoId === second.data.conceitoId && first.data.cardId !== second.data.cardId) {
          // MATCH!
          first.isMatched = true;
          second.isMatched = true;
          matchedPairs++;
          const matchedPair = [first.data, second.data];
          flippedCards = [];

          if (typeof window !== 'undefined' && window.DVC_STORE && window.DVC_STORE.markDiscovered) {
            window.DVC_STORE.markDiscovered(first.data.conceitoId);
          }

          if (matchedPairs >= totalPairs) {
            status = 'finished';
            const stars = calculateStars(attempts, totalPairs);
            if (typeof window !== 'undefined' && window.DVC_STORE && window.DVC_STORE.saveLevelStars) {
              window.DVC_STORE.saveLevelStars(1, stars);
            }
            notify();
            return {
              status: 'finished',
              cards: matchedPair,
              attempts,
              stars
            };
          }

          notify();
          return {
            status: 'match',
            cards: matchedPair
          };
        } else {
          // MISMATCH (Quase!)
          status = 'checking';
          notify();
          return {
            status: 'mismatch',
            cards: [first.data, second.data]
          };
        }
      }

      return { status: 'ignored' };
    }

    function dismissMismatch() {
      if (status !== 'checking' || flippedCards.length < 2) {
        return null;
      }
      const dismissed = [flippedCards[0].data, flippedCards[1].data];
      flippedCards[0].isFlipped = false;
      flippedCards[1].isFlipped = false;
      flippedCards = [];
      status = 'idle';
      notify();
      return dismissed;
    }

    function getHint() {
      if (status === 'checking' || status === 'finished') {
        return null;
      }
      // Procura primeiro conceito ainda não combinado
      for (const entry of cardsMap.values()) {
        if (!entry.isMatched) {
          const id = entry.data.conceitoId;
          const pair = Array.from(cardsMap.values())
            .filter(e => e.data.conceitoId === id && !e.isMatched)
            .map(e => e.data);
          if (pair.length >= 2) {
            return pair;
          }
        }
      }
      return null;
    }

    return {
      flipCard,
      dismissMismatch,
      getHint,
      getState
    };
  }

  window.DVC_GAME = {
    calculateStars,
    createSession
  };
})();
