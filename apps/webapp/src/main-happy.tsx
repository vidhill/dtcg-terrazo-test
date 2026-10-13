import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { parseTransformTokensCSS } from "./parse-transform-tokens.ts";
import tokensUrl from "@repo/tokens/base.tokens.json?url";
import happyTokensUrl from "@repo/tokens/happy.tokens.json?url";

async function main() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("No root element");
  }

  await parseTransformTokensCSS(tokensUrl, happyTokensUrl).then((cssText) => {
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
