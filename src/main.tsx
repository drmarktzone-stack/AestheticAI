import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LocaleProvider } from "./i18n";
import App from "./App";
import "./index.css";

const spaRedirect = sessionStorage.getItem("protokol-spa-redirect");
if (spaRedirect) {
  sessionStorage.removeItem("protokol-spa-redirect");
  const url = new URL(spaRedirect);
  const base = "/AestheticAI";
  if (url.pathname.startsWith(base) && url.pathname !== `${base}/` && url.pathname !== base) {
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
}

createRoot(document.getElementById("root")!).render(

  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
);
