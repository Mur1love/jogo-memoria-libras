# Dicionário Vivo de Computação — Jogo da Memória em Libras

Projeto base desenvolvido conforme as especificações pedagógicas e de acessibilidade do PRD (`PRD_Dicionario_Vivo_Computacao.md`), com foco no Ensino Médio e no ensino inclusivo de conceitos de computação em Libras (Língua Brasileira de Sinais).

**🔗 Demo online:** https://mur1love.github.io/jogo-memoria-libras/

---

## 👥 Contribuindo

Colaboradores: **DaviidCarvallho** e **joaoppazzin1** têm acesso de escrita ao repositório.
Guia de contribuição: [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## 🚀 Como Executar

O projeto foi construído em **HTML5, CSS3 e Vanilla JavaScript (ES2020)** puro, sem bundler, sem `npm install` e sem dependências externas de CDN.

1. **Execução Direta (Sem Servidor):**
   - Dê um duplo clique no arquivo `index.html` ou abra-o diretamente em qualquer navegador moderno (Chrome, Firefox, Edge, Safari).
2. **Execução com Servidor Estático (Opcional):**
   - Com Node.js instalado:
     ```bash
     npx serve .
     ```
   - Ou com Python:
     ```bash
     python3 -m http.server 8000
     ```
     E acesse `http://localhost:8000`.

---

## 📹 Como Adicionar os Vídeos dos Sinais em Libras

Os vídeos dos sinais devem ser inseridos na pasta `assets/videos/` no formato `.mp4` (mudos, gravados com bom contraste, rosto e mãos visíveis):

| Conceito | Nome do Arquivo Obrigatório |
|---|---|
| **ALGORITMO** | `assets/videos/algoritmo.mp4` |
| **PROGRAMA** | `assets/videos/programa.mp4` |
| **ARQUIVO** | `assets/videos/arquivo.mp4` |
| **SENHA** | `assets/videos/senha.mp4` |
| **INTERNET** | `assets/videos/internet.mp4` |
| **REDE** | `assets/videos/rede.mp4` |
| **COMPUTADOR** | `assets/videos/computador.mp4` |
| **BUG** | `assets/videos/bug.mp4` |

### 🛡️ Fallback Automático (Resiliência)
Se algum vídeo ainda não tiver sido colocado na pasta, o jogo **não quebra**: a carta exibe automaticamente um placeholder animado com ícone de mãos e o selo visual *"Vídeo pendente"*, permitindo testar e demonstrar todas as mecânicas de jogo mesmo antes da gravação dos vídeos.

---

## 🎮 Mecânica de Jogo (Nível 1 — Conhecer)

1. O tabuleiro é gerado com 12 cartas (6 pares conceituais aleatórios).
2. Cada par é composto por:
   - **Carta de Sinal:** Vídeo em Libras (ou placeholder com replay) + palavra em português.
   - **Carta de Conceito:** Ilustração geométrica de alto contraste + palavra em português.
3. Ao virar duas cartas:
   - **Match (Acerto):** As cartas ganham destaque de holofote verde (`--ok`), permanecem abertas e a pontuação é atualizada.
   - **Quase (Não combinou):** Feedback amigável *"Quase! Tente de novo."*, tremor suave e desvirada automática após 2.5s (ou imediatamente ao tocar em qualquer outra carta).
4. **Dica:** O botão "Dica" ilumina um par ainda não descoberto por 2 segundos.
5. **Conclusão:** Tela de vitória com avaliação por estrelas (1 a 3 estrelas baseadas no número de tentativas).

---

## ♿ Acessibilidade e Controles de Teclado (WCAG 2.1 AA)

- **Zero Áudio (RA-01):** Nenhum som é emitido pelo jogo, garantindo igualdade de experiência e adequação a pessoas surdas.
- **Teclado:**
  - `Setas (←, →, ↑, ↓)`: Navegam entre as cartas na grade mantendo o foco visível (contorno >= 3px).
  - `Enter` ou `Espaço`: Vira a carta selecionada.
  - `R`: Repete o vídeo da carta em foco.
- **Feedback não punitivo (RA-15):** Mensagens encorajadoras sem termos como "Errado" ou "Perdeu".
- **Modo Redução de Movimento (RA-08):** Respeita automaticamente `prefers-reduced-motion` no sistema operacional.

---

## 🧪 Testes Automatizados

O projeto utiliza o executor nativo do Node.js (`node --test`), sem dependências:

```bash
node --test tests/*.test.js
```
