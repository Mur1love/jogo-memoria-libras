# Guia de Contribuição

Obrigado por querer contribuir com o **Dicionário Vivo de Computação — Jogo da Memória em Libras**!

Este projeto tem como foco o **ensino inclusivo** de conceitos de computação em Libras, com foco no Ensino Médio. Toda contribuição deve respeitar os requisitos de acessibilidade (WCAG 2.1 AA) descritos no PRD (`PRD_Dicionario_Vivo_Computacao.md`).

---

## Como Contribuir

1. **Fork** o repositório e crie um branch a partir de `main`:
   ```bash
   git checkout -b feat/minha-contribuicao
   ```
2. **Faça suas alterações** seguindo o estilo de código existente.
3. **Rode os testes** — o projeto usa o executor nativo do Node.js, sem dependências:
   ```bash
   node --test tests/*.test.js
   ```
4. **Commite** com mensagens claras (veja [Convenção de Commits](#convenção-de-commits)).
5. **Abra um Pull Request** para `main` e descreva o que mudou e por quê.

---

## Regras de Acessibilidade (não negociáveis)

Estes pontos vêm do PRD e **não devem ser quebrados** em nenhuma alteração:

| Requisito | Regra |
|---|---|
| **Zero áudio (RA-01)** | Nenhum som pode ser emitido pelo jogo. Nenhum arquivo de áudio. |
| **Feedback não punitivo (RA-15)** | Mensagens encorajadoras. Evite "Errado", "Perdeu", "Você falhou". |
| **Contraste** | Contorno de foco visível com **>= 3px**. Texto e ilustrações com alto contraste. |
| **Redução de movimento (RA-08)** | Respeitar `prefers-reduced-motion` do sistema operacional. |
| **Teclado (RA-10)** | Toda interação precisa ser acessível por teclado, com foco sempre visível. |

---

## Convenções

- **Sem dependências externas.** HTML5, CSS3 e JavaScript (ES2020) puro, sem bundler e sem CDN.
- **Sem áudio e sem imagens rasterizadas.** Ilustrações são SVG em `assets/img/`, UI em `assets/ui/`.
- **Vídeos** dos sinais ficam em `assets/videos/` no formato `.mp4`, nomeados pelo conceito em minúsculas (`algoritmo.mp4`, `programa.mp4`, ...).
- Se um vídeo ainda não existir, o jogo **não pode quebrar** — mantenha o fallback com placeholder.
- Ao adicionar um conceito novo, atualize `js/data/conceitos.js` **e** os testes correspondentes.

---

## Convenção de Commits

Use prefixos no padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona novo par de cartas
fix: normaliza extensão dos vídeos para .mp4
docs: atualiza instruções de execução
test: cobre fallback de vídeo ausente
```

---

## Reportando Problemas

Ao abrir uma issue, descreva:

- **O que acontece** (comportamento atual)
- **O que deveria acontecer** (comportamento esperado)
- **Como reproduzir** (passos numerados)
- **Acessibilidade envolvida**, se houver (teclado, contraste, movimento reduzido)

Se o problema afetar pessoas surdas ou com deficiência visual, sinalize no título com `[Acessibilidade]`.
