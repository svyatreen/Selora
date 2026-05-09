import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import { setBaseUrl } from "./api";

const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
