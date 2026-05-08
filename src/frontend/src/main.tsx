import { LanguageProvider } from "@/i18n/LanguageContext";
import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Activate dark mode globally
document.documentElement.classList.add("dark");

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      retryDelay: 2000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </InternetIdentityProvider>
  </QueryClientProvider>,
);

// Register service worker for PWA support with auto-update on new deployment
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Listen for new SW versions and force-update the installed app
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // A new version is available — tell it to skip waiting, then reload
              newWorker.postMessage({ type: "SKIP_WAITING" });
              // Reload once the new SW has taken control
              navigator.serviceWorker.addEventListener(
                "controllerchange",
                () => {
                  window.location.reload();
                },
                { once: true },
              );
            }
          });
        });
      })
      .catch(console.error);
  });
}
