# Landing Page (Clone do Figma)

Este projeto foi estruturado para você exportar **fontes e imagens diretamente do Figma** e manter tudo **idêntico** (cores, tipografia, proporções e fluxo de telas).

## Estrutura de pastas

```
landing_figma_clone/
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ app.js
├─ data/
│  └─ timeline.json
└─ assets/
   ├─ fonts/
   │  └─ ProjectFont.woff2         ← exporte do Figma
   └─ images/
      └─ (coloque as imagens exportadas do Figma aqui)
```

## Passo a passo (rápido)

1) **Exportar fontes do Figma**
   - No arquivo do Figma, confirme qual família tipográfica está em uso (p. ex., *Inter*, *Montserrat*, etc.).
   - Se for uma fonte custom do arquivo, exporte/baixe a variante em **.woff2** (ou converta legalmente para uso web).
   - Renomeie para `ProjectFont.woff2` e coloque em `assets/fonts/`.
   - No `css/styles.css`, já existe um `@font-face` apontando para `assets/fonts/ProjectFont.woff2`.
   - Se houver múltiplas variações (negrito, itálico), você pode adicionar mais declarações `@font-face`.

2) **Exportar paleta de cores do Figma**
   - Copie as cores **exatas** e substitua no `:root` (variáveis CSS) de `styles.css`:
     ```css
     :root{
       --bg: #0e0e10;      /* fundo */
       --fg: #ffffff;      /* texto */
       --accent: #4a7cff;  /* primária */
       /* ... */
     }
     ```

3) **Exportar imagens do Figma**
   - Selecione cada **frame/imagem** da timeline no Figma e exporte em PNG/JPG com a mesma proporção do design.
   - Salve em `assets/images/` e aponte os caminhos no `data/timeline.json` (campo `image`).

4) **Conteúdo da timeline**
   - Edite `data/timeline.json` para refletir fielmente os eventos do Figma.
   - Para itens **sem foto**, remova o campo `"image"` — o layout já se adapta para texto apenas.

5) **Fluxo de telas e animação de entrada**
   - A **Tela 1** (intro) tem um botão “Segure para entrar”. O anel carrega por `HOLD_MS = 1200ms` (ajuste em `js/app.js`).
   - Ao completar, a **Tela 2** (timeline) é exibida com transição suave.
   - O botão “←” retorna para a intro.

6) **Proporções e tipografia**
   - Os tamanhos usam `clamp()` para se adaptar mantendo escala similar ao Figma.
   - Ajuste paddings, `gap` e `font-size` conforme necessário para ficar 100% idêntico.

## Dica de fidelidade (1:1)
- Copie **valores exatos** do Figma: tamanhos, espaçamentos, raios, opacidades e sombras.
- Se houver **componentes com variações**, crie classes específicas (ex: `.t-card--large`, `.t-card--tight`).
- Para **efeitos** (blur, gradientes, bordas), replique os ângulos e stops conforme o Figma.

## Hospedagem
- Basta abrir o `index.html` em um servidor estático (ex: Live Server do VSCode).
- Se as fontes não carregarem abrindo direto pelo arquivo (`file://`), utilize um servidor local.

## Acessibilidade
- Imagens têm `alt`. Mantenha descrições significativas.
- Texto adequado de contraste com as cores do Figma.
