/**
 * DVC_VIDEO — Componente de controle do player de vídeo e fallback resiliente
 * Respeita requisitos de acessibilidade (RA-01: zero som) e resiliência (RF-16: placeholder).
 */
(function() {
  function createVideoComponent(options) {
    const videoSrc = options.videoSrc || '';
    const palavra = options.palavra || '';
    const onReplay = options.onReplay || function() {};

    const container = document.createElement('div');
    container.className = 'card-video-wrapper';

    let videoEl = document.createElement('video');
    videoEl.className = 'card-video';
    videoEl.muted = true;
    videoEl.loop = true;
    videoEl.playsInline = true;
    videoEl.setAttribute('muted', '');
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('loop', '');
    videoEl.setAttribute('preload', 'metadata');
    videoEl.src = videoSrc;

    let hasFallback = false;
    let triedAlternative = false;

    function renderFallback() {
      if (hasFallback) return;
      hasFallback = true;
      container.innerHTML = `
        <div class="video-placeholder">
          <img src="assets/ui/hands-placeholder.svg" alt="" aria-hidden="true">
          <span class="video-placeholder-badge">Vídeo pendente</span>
        </div>
      `;
    }

    // Se o vídeo falhar em carregar (ex.: extensão em maiúsculas .MP4 vs minúsculas .mp4)
    videoEl.addEventListener('error', function() {
      if (!triedAlternative && videoSrc) {
        triedAlternative = true;
        if (videoSrc.endsWith('.mp4')) {
          videoEl.src = videoSrc.replace(/\.mp4$/, '.MP4');
          videoEl.load();
          return;
        } else if (videoSrc.endsWith('.MP4')) {
          videoEl.src = videoSrc.replace(/\.MP4$/, '.mp4');
          videoEl.load();
          return;
        }
      }
      renderFallback();
    });

    container.appendChild(videoEl);

    // Botão de Replay acessível (RF-13, RA-14, WCAG)
    const replayBtn = document.createElement('button');
    replayBtn.type = 'button';
    replayBtn.className = 'btn-card-replay';
    replayBtn.tabIndex = -1;
    replayBtn.setAttribute('aria-hidden', 'true');
    replayBtn.setAttribute('aria-label', `Repetir sinal de ${palavra}`);
    replayBtn.innerHTML = `<img src="assets/ui/replay.svg" alt="" aria-hidden="true">`;
    replayBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      replay();
      onReplay();
    });
    container.appendChild(replayBtn);

    function setReplayAriaState(isOpen) {
      if (isOpen) {
        replayBtn.tabIndex = 0;
        replayBtn.removeAttribute('aria-hidden');
      } else {
        replayBtn.tabIndex = -1;
        replayBtn.setAttribute('aria-hidden', 'true');
      }
    }

    function play() {
      if (!hasFallback && videoEl) {
        videoEl.currentTime = 0;
        const playPromise = videoEl.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {});
        }
      }
    }

    function pause() {
      if (!hasFallback && videoEl) {
        videoEl.pause();
      }
    }

    function replay() {
      if (!hasFallback && videoEl) {
        videoEl.currentTime = 0;
        const playPromise = videoEl.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {});
        }
      }
    }

    return {
      element: container,
      videoElement: videoEl,
      play,
      pause,
      replay,
      setReplayAriaState
    };
  }

  window.DVC_VIDEO = {
    create: createVideoComponent
  };
})();
