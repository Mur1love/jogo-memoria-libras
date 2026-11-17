/**
 * DVC_RNG — Gerador de números pseudoaleatórios determinístico (mulberry32)
 * Permite reproduzir o mesmo tabuleiro em diferentes partidas ou dispositivos.
 */
(function() {
  function hashString(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    }
    return h >>> 0;
  }

  function createMulberry32(seed) {
    let numericSeed = typeof seed === 'number' ? (seed >>> 0) : hashString(String(seed));
    if (numericSeed === 0) {
      numericSeed = 1337;
    }

    let a = numericSeed;

    function next() {
      let t = (a += 0x6D2B79F5) >>> 0;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    function shuffle(array) {
      const copy = array.slice();
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
      }
      return copy;
    }

    return {
      next,
      shuffle,
      seed: numericSeed
    };
  }

  window.DVC_RNG = {
    create: createMulberry32
  };
})();
