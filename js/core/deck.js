/**
 * DVC_DECK — Montagem e embaralhamento do baralho por nível
 */
(function() {
  const CONFIG_NIVEIS = {
    1: { nome: 'Conhecer', pares: 6, faces: ['sinal', 'imagem'], palavras: [true, true] },
    2: { nome: 'Reconhecer', pares: 8, faces: ['sinal', 'imagem'], palavras: [false, true] },
    3: { nome: 'Visualizar', pares: 8, faces: ['sinal', 'imagem'], palavras: [false, false] },
    4: { nome: 'Definir', pares: 8, faces: ['sinal', 'definicao'], palavras: [false, false] },
    5: { nome: 'Trio', pares: 5, faces: ['sinal', 'palavra', 'imagem'], palavras: [false, true, false] }
  };

  function buildLevel(levelNumber, conceitos, rng) {
    const config = CONFIG_NIVEIS[levelNumber] || CONFIG_NIVEIS[1];
    const totalPares = Math.min(config.pares, conceitos.length);

    // Embaralha lista de conceitos para selecionar os totalPares
    const conceitosDisponiveis = rng ? rng.shuffle(conceitos) : conceitos.slice();
    const selecionados = conceitosDisponiveis.slice(0, totalPares);

    const cards = [];
    let cardIdx = 0;

    for (const conceito of selecionados) {
      config.faces.forEach((tipoFace, faceIdx) => {
        cardIdx++;
        cards.push({
          cardId: `card_${cardIdx}_${conceito.id}`,
          conceitoId: conceito.id,
          tipoFace: tipoFace,
          conceito: conceito,
          exibirPalavra: config.palavras[faceIdx] ?? false
        });
      });
    }

    return rng ? rng.shuffle(cards) : cards;
  }

  window.DVC_DECK = {
    CONFIG_NIVEIS,
    buildLevel
  };
})();
