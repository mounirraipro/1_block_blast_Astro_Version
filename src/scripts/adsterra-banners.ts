const MIN_REFRESH_MS = 37_000;
const MAX_REFRESH_MS = 50_000;
// Uniform integer milliseconds, including both endpoints; one draw per cycle.
const randomRefreshMs = () => MIN_REFRESH_MS + Math.floor(Math.random() * (MAX_REFRESH_MS - MIN_REFRESH_MS + 1));
const HISTORY_KEY = "blockblast-adsterra-refresh-v1";
const LOAD_TIMEOUT_MS = 15_000;
const TICK_MS = 1_000;

type BannerFrame = HTMLIFrameElement & { adsterraCanLoad?: () => boolean };
type RefreshCycle = { requestedAt: number; intervalMs: number };

type Slot = {
  element: HTMLElement;
  holder: HTMLElement;
  key: string;
  width: number;
  height: number;
  frame?: BannerFrame;
  ratio: number;
  eligible: boolean;
  elapsed: number;
  sampledAt: number;
  ready: boolean;
  failed: boolean;
  loadTimer?: number;
};

export function initializeBanners(isAllowed: () => boolean) {
  const slots = new Map<HTMLElement, Slot>();
  // Preserve each chosen interval across remounts, navigation and BFCache so
  // they cannot reroll a shorter wait. Hidden time is never stored as credit.
  let history: Record<string, RefreshCycle> = {};
  let storageAvailable = true;
  let disposed = false;
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid banner history");
    for (const [key, saved] of Object.entries(value)) {
      // Migrate the previous timestamp-only ledger without dropping cooldowns.
      const cycle = typeof saved === "number" ? { requestedAt: saved, intervalMs: randomRefreshMs() } : saved;
      if (!/^[a-f0-9]{32}$/.test(key) || !cycle || typeof cycle !== "object"
        || typeof cycle.requestedAt !== "number" || !Number.isFinite(cycle.requestedAt)
        || !Number.isInteger(cycle.intervalMs) || cycle.intervalMs < MIN_REFRESH_MS || cycle.intervalMs > MAX_REFRESH_MS) throw new Error("Invalid banner history");
      history[key] = { requestedAt: cycle.requestedAt, intervalMs: cycle.intervalMs };
    }
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { storageAvailable = false; }

  const recordRequest = (key: string, newCycle = false) => {
    if (newCycle || !history[key]) history[key] = { requestedAt: Date.now(), intervalMs: randomRefreshMs() };
    else history[key].requestedAt = Date.now();
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }
    catch { storageAvailable = false; }
    return storageAvailable;
  };
  const removeFrame = (slot: Slot) => {
    clearTimeout(slot.loadTimer);
    if (slot.frame) delete slot.frame.adsterraCanLoad;
    slot.frame?.remove(); // Destroy the complete provider browsing context.
    slot.frame = undefined;
    slot.ready = false;
    slot.eligible = false;
    slot.elapsed = 0;
    delete slot.element.dataset.requested;
  };
  const fail = (slot: Slot) => {
    removeFrame(slot);
    slot.failed = true;
    slot.element.dataset.failed = "true";
  };
  const fits = (slot: Slot) => {
    const rect = slot.holder.getBoundingClientRect();
    return slot.element.isConnected && slot.holder.isConnected && slot.holder.getClientRects().length > 0
      && (slot.holder.checkVisibility?.({ checkOpacity: true, checkVisibilityCSS: true }) ?? getComputedStyle(slot.holder).visibility === "visible")
      && rect.width >= slot.width && rect.height >= slot.height
      && (slot.element.parentElement?.getBoundingClientRect().width ?? 0) >= slot.width;
  };
  const mount = (slot: Slot) => {
    // Record before starting any async load, and never overlap old/new contexts.
    removeFrame(slot);
    if (!recordRequest(slot.key, true)) return;
    const frame: BannerFrame = document.createElement("iframe");
    frame.width = String(slot.width);
    frame.height = String(slot.height);
    frame.title = "Publicité Adsterra";
    frame.dataset.adsterraFrame = slot.key;
    frame.dataset.eligible = "true";
    frame.src = slot.element.dataset.frameSrc!;
    slot.frame = frame;
    // A one-use grant lives on the actual element, so cloned markup or an
    // unsolicited iframe reload cannot execute a second provider request.
    let unused = true;
    frame.adsterraCanLoad = () => {
      if (!unused || disposed || slot.frame !== frame || !isAllowed() || !fits(slot) || slot.ratio < 0.5
        || document.visibilityState !== "visible" || !document.hasFocus()
        || document.documentElement.classList.contains("menu-open")) return false;
      unused = false;
      return recordRequest(slot.key);
    };
    slot.element.dataset.requested = "true";
    slot.holder.replaceChildren(frame);
    slot.loadTimer = window.setTimeout(() => fail(slot), LOAD_TIMEOUT_MS);
  };
  const sample = () => {
    if (disposed) return;
    const now = performance.now();
    const active = storageAvailable && isAllowed() && document.visibilityState === "visible" && document.hasFocus()
      && !document.documentElement.classList.contains("menu-open");
    // One live context per code, even if a future remount temporarily duplicates markup.
    const owners = new Map<string, Slot>();
    for (const slot of slots.values()) {
      if (slot.frame?.isConnected && fits(slot) && !owners.has(slot.key)) owners.set(slot.key, slot);
    }
    for (const slot of slots.values()) {
      const delta = now - slot.sampledAt;
      slot.sampledAt = now;
      if (!isAllowed() || !fits(slot) || (slot.frame && (!slot.frame.isConnected || owners.get(slot.key) !== slot))) removeFrame(slot);
      const eligible = active && !slot.failed && fits(slot) && slot.ratio >= 0.5 && (!owners.has(slot.key) || owners.get(slot.key) === slot);
      if (eligible) owners.set(slot.key, slot);
      if (slot.frame) slot.frame.dataset.eligible = String(eligible);
      // Both ends of the sample must qualify. Discard long timer gaps (sleep,
      // throttling, main-thread stalls) instead of catching up missed refreshes.
      if (eligible && slot.eligible && delta <= TICK_MS * 2 && (!slot.frame || slot.ready)) slot.elapsed += delta;
      slot.eligible = eligible;
      if (!eligible || (slot.frame && !slot.ready)) continue;
      const last = history[slot.key];
      if (last === undefined || (slot.elapsed >= last.intervalMs && Date.now() - last.requestedAt >= last.intervalMs)) mount(slot);
    }
  };
  const intersection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const slot = [...slots.values()].find(slot => slot.holder === entry.target);
      if (slot) slot.ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
    }
    sample();
  }, { threshold: [0, 0.5, 1] });
  const resize = new ResizeObserver(() => sample());
  const scan = () => {
    for (const [element, slot] of slots) {
      if (!element.isConnected || !slot.holder.isConnected) {
        removeFrame(slot);
        intersection.unobserve(slot.holder);
        resize.unobserve(element);
        slots.delete(element);
      }
    }
    for (const element of document.querySelectorAll<HTMLElement>("[data-adsterra-banner]")) {
      if (slots.has(element)) continue;
      const holder = element.querySelector<HTMLElement>("[data-adsterra-creative]");
      const { key, frameSrc } = element.dataset;
      const width = Number(element.dataset.width), height = Number(element.dataset.height);
      if (!holder || !key || !/^[a-f0-9]{32}$/.test(key) || frameSrc !== `/adsterra/${key}.html` || width <= 0 || height <= 0) continue;
      holder.replaceChildren(); // Remove stale frames carried by cloned/remounted markup.
      delete element.dataset.failed;
      slots.set(element, { element, holder, key, width, height, ratio: 0, eligible: false, elapsed: 0, sampledAt: performance.now(), ready: false, failed: false });
      intersection.observe(holder);
      resize.observe(element);
    }
    sample();
  };
  const mutations = new MutationObserver(scan);
  mutations.observe(document.body, { childList: true, subtree: true });
  const rootChanges = new MutationObserver(sample);
  rootChanges.observe(document.documentElement, { attributes: true, attributeFilter: ["data-adsterra-disabled", "class"] });
  const onMessage = (event: MessageEvent) => {
    if (event.origin !== location.origin || event.data?.type !== "adsterra-banner") return;
    const slot = [...slots.values()].find(slot => slot.frame?.contentWindow === event.source && slot.key === event.data.key);
    if (!slot || slot.ready || !["loaded", "skipped", "failed"].includes(event.data.state)) return;
    clearTimeout(slot.loadTimer);
    if (event.data.state === "loaded") {
      if (!isAllowed() || !recordRequest(slot.key)) { removeFrame(slot); return; }
      slot.ready = true;
      slot.elapsed = 0;
      slot.sampledAt = performance.now();
    } else if (event.data.state === "skipped") {
      removeFrame(slot); // Lost eligibility during local document loading. No immediate retry.
    } else if (event.data.state === "failed") fail(slot);
  };
  const events = new AbortController();
  window.addEventListener("message", onMessage, { signal: events.signal });
  window.addEventListener("focus", sample, { signal: events.signal });
  window.addEventListener("blur", sample, { signal: events.signal });
  window.addEventListener("resize", sample, { signal: events.signal });
  document.addEventListener("visibilitychange", sample, { signal: events.signal });
  const timer = window.setInterval(sample, TICK_MS);
  scan();
  return {
    update: sample,
    dispose() {
      disposed = true;
      clearInterval(timer);
      events.abort();
      intersection.disconnect();
      resize.disconnect();
      mutations.disconnect();
      rootChanges.disconnect();
      slots.forEach(removeFrame);
      slots.clear();
    },
  };
}
