/**
 * DVC_CARD — Componente de renderização da carta, animação de flip e acessibilidade
 */
(function() {
  function createCardElement(cardData, onCardClick) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('tabindex', '0');
    cardEl.dataset.cardId = cardData.cardId;
    cardEl.dataset.conceitoId = cardData.conceitoId;
    cardEl.dataset.tipo = cardData.tipoFace;

    function updateAriaLabel(flipped, matched) {
      if (matched) {
        cardEl.setAttribute('aria-label', `Carta combinada: ${cardData.conceito.palavra}, tipo ${cardData.tipoFace}`);
      } else if (flipped) {
        cardEl.setAttribute('aria-label', `Carta aberta: ${cardData.conceito.palavra}, tipo ${cardData.tipoFace}`);
      } else {
        cardEl.setAttribute('aria-label', `Carta virada`);
      }
    }
    updateAriaLabel(false, false);

    const innerEl = document.createElement('div');
    innerEl.className = 'card-inner';

    // Verso neutro da carta
    const backEl = document.createElement('div');
    backEl.className = 'card-face card-back';
    backEl.innerHTML = `<img src="assets/ui/claquete.svg" alt="" aria-hidden="true">`;

    // Frente da carta
    const frontEl = document.createElement('div');
    frontEl.className = 'card-face card-front';
    frontEl.style.setProperty('--card-border-color', cardData.conceito.cor);

    // Forma geométrica no canto (RA-04)
    const shapeBadge = document.createElement('div');
    shapeBadge.className = `card-shape-badge shape-${cardData.conceito.forma}`;
    shapeBadge.setAttribute('aria-hidden', 'true');
    frontEl.appendChild(shapeBadge);

    // Corpo da carta
    const bodyEl = document.createElement('div');
    bodyEl.className = 'card-body';

    let videoComponent = null;

    if (cardData.tipoFace === 'sinal' && window.DVC_VIDEO) {
      videoComponent = window.DVC_VIDEO.create({
        videoSrc: cardData.conceito.video,
        palavra: cardData.conceito.palavra
      });
      bodyEl.appendChild(videoComponent.element);
    } else {
      const img = document.createElement('img');
      img.className = 'card-media-img';
      img.src = cardData.conceito.imagem;
      img.alt = `Ilustração de ${cardData.conceito.palavra}`;
      bodyEl.appendChild(img);
    }

    frontEl.appendChild(bodyEl);

    // Palavra de apoio se configurada
    if (cardData.exibirPalavra) {
      const wordEl = document.createElement('div');
      wordEl.className = 'card-word';
      wordEl.textContent = cardData.conceito.palavra;
      frontEl.appendChild(wordEl);
    }

    innerEl.appendChild(backEl);
    innerEl.appendChild(frontEl);
    cardEl.appendChild(innerEl);

    // Manipuladores de evento
    function handleClick(e) {
      e.preventDefault();
      onCardClick(cardData, cardEl);
    }

    cardEl.addEventListener('click', handleClick);

    cardEl.addEventListener('keydown', function(e) {
      const isOpen = cardEl.classList.contains('is-flipped') || cardEl.classList.contains('is-matched');
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      } else if ((e.key === 'r' || e.key === 'R') && videoComponent && isOpen) {
        e.preventDefault();
        videoComponent.replay();
      }
    });

    return {
      element: cardEl,
      cardData: cardData,
      flip: function(isFlipped) {
        if (isFlipped) {
          cardEl.classList.add('is-flipped');
          updateAriaLabel(true, cardEl.classList.contains('is-matched'));
          if (videoComponent) {
            videoComponent.setReplayAriaState(true);
            videoComponent.play();
          }
        } else {
          cardEl.classList.remove('is-flipped');
          updateAriaLabel(false, false);
          if (videoComponent) {
            videoComponent.setReplayAriaState(false);
            videoComponent.pause();
          }
        }
      },
      setMatched: function() {
        cardEl.classList.add('is-matched');
        updateAriaLabel(true, true);
        if (videoComponent) {
          videoComponent.setReplayAriaState(true);
          videoComponent.play();
        }
      },
      setShake: function(isShake) {
        if (isShake) {
          cardEl.classList.add('is-shake');
        } else {
          cardEl.classList.remove('is-shake');
        }
      },
      setHint: function(isHint) {
        if (isHint) {
          cardEl.classList.add('is-hinted');
        } else {
          cardEl.classList.remove('is-hinted');
        }
      },
      replayVideo: function() {
        if (videoComponent) {
          videoComponent.replay();
        }
      }
    };
  }

  window.DVC_CARD = {
    create: createCardElement
  };
})();
