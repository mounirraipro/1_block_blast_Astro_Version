const preferenceKey = "blockblast-adsterra-choice-v1";
const socialBarUrl = "https://pl31569451.profitableratecpmnetwork.com/a2/ff/4f/a2ff4fa9781365e2b94e8bee3146d957.js";

export function initializeAdsterra() {
  const preferences = document.querySelector<HTMLElement>("[data-adsterra-preferences]");
  if (!preferences || preferences.dataset.initialized) return;
  preferences.dataset.initialized = "true";
  let allowed = false;
  let savedChoice: string | null = null;
  const desktop = window.matchMedia("(min-width: 1024px)");
  let socialLoaded = false;
  try { savedChoice = localStorage.getItem(preferenceKey); allowed = savedChoice === "allow"; } catch { /* Fail closed when storage is unavailable. */ }
  if (preferences instanceof HTMLDetailsElement) preferences.open = !savedChoice && desktop.matches;
  const slots = [...document.querySelectorAll<HTMLElement>("[data-adsterra-banner]")];
  const attempted = new WeakSet<HTMLElement>();
  const status = preferences.querySelector<HTMLElement>("[data-adsterra-status]");
  const updateStatus = () => {
    if (status) status.textContent = allowed
      ? "Publicités Adsterra autorisées. Vous pouvez retirer votre choix ici."
      : "Les scripts publicitaires Adsterra sont désactivés.";
  };
  const loadSlot = (slot: HTMLElement) => {
    const width = Number(slot.dataset.width);
    const height = Number(slot.dataset.height);
    const holder = slot.querySelector<HTMLElement>("[data-adsterra-creative]");
    if (!allowed || !desktop.matches || !holder || attempted.has(slot)) return;
    const container = slot.parentElement;
    if (!container || container.getBoundingClientRect().width < width || !container.getClientRects().length || (width === 160 && innerWidth < 1200)) return;
    slot.dataset.requested = "true";
    if (!slot.getClientRects().length || slot.getBoundingClientRect().width < width) { delete slot.dataset.requested; return; }
    const frame = document.createElement("iframe");
    frame.title = "Publicité Adsterra " + width + " × " + height;
    frame.width = String(width);
    frame.height = String(height);
    // Same-origin documents isolate atOptions without an opaque sandbox origin that breaks provider storage.
    // Provider scripts are trusted third-party code, as is the global Social Bar.
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    const options = { key: slot.dataset.key, format: "iframe", height, width, params: {} };
    frame.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body><script>window.atOptions=' + JSON.stringify(options) + ';<\/script><script src="https://www.highrevenueformat.com/' + slot.dataset.key + '/invoke.js"><\/script></body></html>';
    attempted.add(slot);
    holder.replaceChildren(frame);
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
      // Reload removes provider-created overlays, listeners and timers after withdrawal.
      if (socialLoaded) { location.reload(); return; }
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
