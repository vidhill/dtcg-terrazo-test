import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { parseTransformTokensCSS } from "./parse-transform-tokens.ts";

async function main() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("No root element");
  }

  await parseTransformTokensCSS("./tokens.json").then((cssText) => {
    const styleElem = document.createElement("style");
    styleElem.textContent = cssText;

    document.head.appendChild(styleElem);
  });

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main().catch(console.error);
