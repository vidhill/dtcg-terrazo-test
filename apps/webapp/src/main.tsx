import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import tokensUrl from "@repo/tokens/base.tokens.json?url";

import "./index.css";
import App from "./app.tsx";
import { parseTransformTokensCSS } from "./parse-transform-tokens.ts";

async function main() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("No root element");
  }

  await parseTransformTokensCSS(tokensUrl).then((cssText) => {
    // create style element to contain css
    const styleElem = document.createElement("style");
    styleElem.textContent = cssText;

    // attach element to head
    document.head.appendChild(styleElem);
  });

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main().catch(console.error);
