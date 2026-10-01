import { ADSTERRA_ENABLED } from "../data/advertising";
import { initializeBanners } from "./adsterra-banners";

const preferenceKey = "blockblast-adsterra-choice-v1";
const socialBarUrl = "https://pl31569451.profitableratecpmnetwork.com/a2/ff/4f/a2ff4fa9781365e2b94e8bee3146d957.js";
const hasGpc = () => (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
let current: { preferences: HTMLElement; dispose: () => void } | undefined;

export function initializeAdsterra() {
  const preferences = document.querySelector<HTMLElement>("[data-adsterra-preferences]");
  if (current?.preferences === preferences) return;
  current?.dispose();
  current = undefined;
  if (!ADSTERRA_ENABLED || !preferences) return;
  const root = document.documentElement;
  const events = new AbortController();
  const desktop = window.matchMedia("(min-width: 1024px)");
  let allowed = false;
  let gpc = hasGpc();
  let socialLoaded = !!document.querySelector("script[data-adsterra-social]");
  const readChoice = () => {
    try {
      const choice = localStorage.getItem(preferenceKey);
      allowed = choice === null || choice === "allow";
    } catch { allowed = false; }
  };
  readChoice();
  if (preferences instanceof HTMLDetailsElement) preferences.open = false;
  const permitted = () => ADSTERRA_ENABLED && allowed && !hasGpc() && !root.hasAttribute("data-adsterra-disabled");
  const updateStatus = () => {
    root.toggleAttribute("data-adsterra-disabled", !allowed || gpc);
    const enable = preferences.querySelector<HTMLButtonElement>("[data-adsterra-allow]");
    const disable = preferences.querySelector<HTMLButtonElement>("[data-adsterra-deny]");
    if (enable) enable.hidden = allowed || gpc;
    if (disable) disable.hidden = !allowed || gpc;
    const status = preferences.querySelector<HTMLElement>("[data-adsterra-status]");
    if (status) status.textContent = gpc
      ? "Les publicités Adsterra sont désactivées par le signal de confidentialité global (GPC) de votre navigateur."
      : allowed
        ? "Chargement automatique des publicités Adsterra actif. Vous pouvez le désactiver ici."
        : "Les scripts publicitaires Adsterra sont désactivés.";
  };
  updateStatus();
  const banners = initializeBanners(permitted);
  const loadSocial = () => {
    if (!permitted() || !desktop.matches || socialLoaded || preferences.dataset.socialBar !== "true") return;
    socialLoaded = true;
    const script = document.createElement("script");
    script.src = socialBarUrl;
    script.async = true;
    script.dataset.adsterraSocial = "true";
    document.body.append(script);
  };
  const applyChoice = () => {
    gpc = hasGpc();
    updateStatus();
    banners.update();
    // Only the existing Social Bar runs in the parent document. Its withdrawal
    // still needs a reload; banner-only pages (including the game) never do.
    if (!permitted() && socialLoaded) { location.reload(); return; }
    loadSocial();
  };
  const choose = (value: boolean) => {
    if (hasGpc()) return;
    allowed = value;
    try { localStorage.setItem(preferenceKey, value ? "allow" : "deny"); } catch { /* Applies to this page only. */ }
    if (preferences instanceof HTMLDetailsElement) preferences.open = false;
    applyChoice();
  };
  preferences.querySelector("[data-adsterra-allow]")?.addEventListener("click", () => choose(true), { signal: events.signal });
  preferences.querySelector("[data-adsterra-deny]")?.addEventListener("click", () => choose(false), { signal: events.signal });
  window.addEventListener("storage", event => {
    if (event.key === preferenceKey || event.key === null) { readChoice(); applyChoice(); }
  }, { signal: events.signal });
  desktop.addEventListener("change", loadSocial, { signal: events.signal });
  const privacyTimer = window.setInterval(() => {
    if (!preferences.isConnected) { disposeAdsterra(); initializeAdsterra(); return; }
    if (gpc !== hasGpc()) applyChoice();
  }, 1_000);
  current = { preferences, dispose: () => { clearInterval(privacyTimer); events.abort(); banners.dispose(); } };
  loadSocial();
}

function disposeAdsterra() {
  current?.dispose();
  current = undefined;
}

// Full navigation, BFCache and Astro client navigation each have explicit teardown.
window.addEventListener("pagehide", disposeAdsterra);
window.addEventListener("pageshow", () => initializeAdsterra());
document.addEventListener("astro:before-swap", disposeAdsterra);
document.addEventListener("astro:page-load", () => initializeAdsterra());
