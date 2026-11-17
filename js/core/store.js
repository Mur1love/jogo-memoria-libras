/**
 * DVC_STORE — Gerenciamento de configurações e progresso
 * Resiliente a bloqueio de cookies / modo anônimo (cai em memória caso localStorage lance erro).
 */
(function() {
  const SETTINGS_KEY = 'dvc.v1.settings';
  const PROGRESS_KEY = 'dvc.v1.progress';

  const DEFAULT_SETTINGS = {
    revealDelay: 2500,
    playbackRate: 1.0,
    contrast: 'padrao',
    theme: 'escuro',
    reducedMotion: false
  };

  const DEFAULT_PROGRESS = {
    discovered: [],
    starsByLevel: {}
  };

  // Fallback em memória
  const memoryStorage = {};

  function isLocalStorageAvailable() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__dvc_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  const hasStorage = isLocalStorageAvailable();

  function getItem(key) {
    if (hasStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {}
    }
    return memoryStorage[key] || null;
  }

  function setItem(key, value) {
    if (hasStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {}
    }
    memoryStorage[key] = String(value);
  }

  function getSettings() {
    try {
      const data = getItem(SETTINGS_KEY);
      return data ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(data)) : Object.assign({}, DEFAULT_SETTINGS);
    } catch (e) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  function saveSettings(newSettings) {
    const current = getSettings();
    const merged = Object.assign({}, current, newSettings);
    try {
      setItem(SETTINGS_KEY, JSON.stringify(merged));
    } catch (e) {}
    return merged;
  }

  function getProgress() {
    try {
      const data = getItem(PROGRESS_KEY);
      return data ? Object.assign({}, DEFAULT_PROGRESS, JSON.parse(data)) : Object.assign({}, DEFAULT_PROGRESS);
    } catch (e) {
      return Object.assign({}, DEFAULT_PROGRESS);
    }
  }

  function markDiscovered(conceitoId) {
    const progress = getProgress();
    if (!progress.discovered.includes(conceitoId)) {
      progress.discovered.push(conceitoId);
      try {
        setItem(PROGRESS_KEY, JSON.stringify(progress));
      } catch (e) {}
    }
    return progress;
  }

  function isDiscovered(conceitoId) {
    const progress = getProgress();
    return progress.discovered.includes(conceitoId);
  }

  function saveLevelStars(levelNumber, stars) {
    const progress = getProgress();
    const current = progress.starsByLevel[levelNumber] || 0;
    if (stars > current) {
      progress.starsByLevel[levelNumber] = stars;
      try {
        setItem(PROGRESS_KEY, JSON.stringify(progress));
      } catch (e) {}
    }
    return progress;
  }

  window.DVC_STORE = {
    getSettings,
    saveSettings,
    getProgress,
    markDiscovered,
    isDiscovered,
    saveLevelStars
  };
})();
