import { ADSTERRA_ENABLED } from "../data/advertising";

const preferenceKey = "blockblast-adsterra-choice-v1";
const socialBarUrl = "https://pl31569451.profitableratecpmnetwork.com/a2/ff/4f/a2ff4fa9781365e2b94e8bee3146d957.js";

export function initializeAdsterra() {
  // The emergency pause overrides every saved consent choice and navigation.
  if (!ADSTERRA_ENABLED) return;
  const preferences = document.querySelector<HTMLElement>("[data-adsterra-preferences]");
  if (!preferences || preferences.dataset.initialized) return;
  preferences.dataset.initialized = "true";
  let allowed = false;
  let savedChoice: string | null = null;
  const desktop = window.matchMedia("(min-width: 1024px)");
  let socialLoaded = false;
  try { savedChoice = localStorage.getItem(preferenceKey); allowed = savedChoice === null || savedChoice === "allow"; } catch { /* Fail closed when storage is unavailable. */ }
  if (preferences instanceof HTMLDetailsElement) preferences.open = false;
  const slots = [...document.querySelectorAll<HTMLElement>("[data-adsterra-banner]")];
  const attempted = new WeakSet<HTMLElement>();
  const status = preferences.querySelector<HTMLElement>("[data-adsterra-status]");
  const updateStatus = () => {
    const enable = preferences.querySelector<HTMLButtonElement>("[data-adsterra-allow]");
    const disable = preferences.querySelector<HTMLButtonElement>("[data-adsterra-deny]");
    if (enable) enable.hidden = allowed;
    if (disable) disable.hidden = !allowed;
    if (status) status.textContent = allowed
      ? "Chargement automatique des publicités Adsterra actif sur ordinateur. Vous pouvez le désactiver ici."
      : "Les scripts publicitaires Adsterra sont désactivés.";
  };
  let bannerQueue: Promise<void> = Promise.resolve();
  let bannerStarted = false;
  const loadSlot = (slot: HTMLElement) => {
    const width = Number(slot.dataset.width);
    const height = Number(slot.dataset.height);
    const holder = slot.querySelector<HTMLElement>("[data-adsterra-creative]");
    if (!allowed || !desktop.matches || !holder || attempted.has(slot)) return;
    const container = slot.parentElement;
    if (!container || container.getBoundingClientRect().width < width || !container.getClientRects().length || (width === 160 && innerWidth < 1200)) return;
    slot.dataset.requested = "true";
    if (!slot.getClientRects().length || slot.getBoundingClientRect().width < width) { delete slot.dataset.requested; return; }
    attempted.add(slot);
    // The supplied tag runs directly in the page body. Only the provider creates
    // its format:"iframe" creative; there is no publisher iframe around the tag.
    // Do not overwrite atOptions until the preceding invoke.js has executed.
    bannerQueue = bannerQueue.then(() => new Promise<void>(resolve => {
      if (!allowed || !desktop.matches || !slot.isConnected || !slot.getClientRects().length || container.getBoundingClientRect().width < width || (width === 160 && innerWidth < 1200)) {
        attempted.delete(slot); delete slot.dataset.requested; resolve(); return;
      }
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = false;
      script.src = "https://www.highrevenueformat.com/" + slot.dataset.key + "/invoke.js";
      script.dataset.adsterraBannerScript = "true";
      script.onload = () => resolve();
      script.onerror = () => { delete slot.dataset.requested; resolve(); };
      (window as Window & { atOptions?: object }).atOptions = {
        key: slot.dataset.key, format: "iframe", height, width, params: {},
      };
      bannerStarted = true;
      holder.append(script);
    }));
  };
  const loadSocial = () => {
    if (!allowed || !desktop.matches || socialLoaded || preferences.dataset.socialBar !== "true") return;
    socialLoaded = true;
    if (document.querySelector("script[data-adsterra-social]")) return;
    const script = document.createElement("script");
    script.src = socialBarUrl;
    script.async = true;
    script.dataset.adsterraSocial = "true";
    document.body.append(script);
  };
  const refresh = () => { updateStatus(); slots.forEach(loadSlot); loadSocial(); };
  const choose = (value: boolean) => {
    allowed = value;
    if (preferences instanceof HTMLDetailsElement) preferences.open = false;
    try { localStorage.setItem(preferenceKey, value ? "allow" : "deny"); } catch { /* The choice still applies to this page. */ }
    if (!value) {
      slots.forEach(slot => { slot.querySelector("[data-adsterra-creative]")?.replaceChildren(); attempted.delete(slot); delete slot.dataset.requested; });
      // Direct tags may install listeners and timers outside their slot.
      // Reload also cancels any queued/in-flight unit after withdrawal.
      if (socialLoaded || bannerStarted) { location.reload(); return; }
    }
    refresh();
  };
  preferences.querySelector("[data-adsterra-allow]")?.addEventListener("click", () => choose(true));
  preferences.querySelector("[data-adsterra-deny]")?.addEventListener("click", () => choose(false));
  window.addEventListener("storage", event => {
    if (event.key === preferenceKey || event.key === null) location.reload();
  });
  const observer = new ResizeObserver(() => slots.forEach(loadSlot));
  slots.forEach(slot => { if (slot.parentElement) observer.observe(slot.parentElement); });
  desktop.addEventListener("change", refresh);
  refresh();
}
