import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #0b0910;
    --bg-panel: #100d17;
    --bg-raise: #171320;
    --bg-inset: #0d0a13;

    --border: #2e2742;
    --border-soft: #211c30;
    --border-strong: #463b68;

    --fg: #cfc9e0;
    --fg-dim: #827ba0;
    --fg-faint: #534c6e;

    --accent: #b388ff;
    --accent-soft: #8f6ae0;
    --accent-bg: #3b2d63;

    --green: #6fcf8f;
    --yellow: #e8c35a;
    --blue: #8ea8ff;
    --pink: #e07fb8;
    --red: #ff7b7b;

    --mode-bg: #a97bff;
    --mode-fg: #140f1e;

    --row: 1.6;
    --font: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, 'Menlo', monospace;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  /* телефон: высота по видимой области (без панели браузера), без серой вспышки при тапе */
  @media (max-width: 760px) {
    body,
    #root {
      height: 100dvh;
    }

    body {
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }

    /* iOS зумит страницу при фокусе на поле со шрифтом < 16px */
    input,
    textarea,
    select {
      font-size: 16px;
    }
  }

  body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font);
    font-size: 13px;
    line-height: var(--row);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  ::selection {
    background: var(--accent-bg);
    color: #fff;
  }

  a {
    color: var(--accent);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  :focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 1px;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--border-strong) transparent;
  }

  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-thumb {
    background: var(--border-strong);
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }
`;
