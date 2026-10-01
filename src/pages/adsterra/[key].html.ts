import type { APIRoute, GetStaticPaths } from "astro";
import { ADSTERRA_ENABLED, ADSTERRA_BANNER_UNITS } from "../../data/advertising";

// Static endpoints are not content pages and do not enter the sitemap.
export const getStaticPaths: GetStaticPaths = () => {
  if (!ADSTERRA_ENABLED) return [];
  const units = Object.values(ADSTERRA_BANNER_UNITS).map(unit => ({
    ...unit, scriptUrl: `https://www.highrevenueformat.com/${unit.key}/invoke.js`,
  }));
  return units.map(unit => ({ params: { key: unit.key }, props: unit }));
};

export const GET: APIRoute = ({ props }) => {
  const { key, width, height, scriptUrl } = props;
  const options = JSON.stringify({ key, format: "iframe", height, width, params: {} });
  const escapedUrl = String(scriptUrl).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  // Write the original, synchronous tags during HTML parsing. Each frame owns
  // its atOptions, provider-created blank iframe, document/window listeners and timers.
  const tags = `<script type="text/javascript">atOptions = ${options};</script><script type="text/javascript" src="${escapedUrl}" onload="report('loaded')" onerror="report('failed')"></script>`;
  const literal = JSON.stringify(tags).replaceAll("<", "\\u003c");
  return new Response(`<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Publicité Adsterra</title>
<style>html,body{margin:0;padding:0;width:${width}px;height:${height}px;background:transparent}iframe{display:block;border:0}</style></head><body>
<script>
function report(state) { parent.postMessage({ type: 'adsterra-banner', key: ${JSON.stringify(key)}, state }, location.origin); }
try {
  const frame = window.frameElement;
  const choice = localStorage.getItem('blockblast-adsterra-choice-v1');
  const rect = frame?.getBoundingClientRect();
  const visibleArea = rect ? Math.max(0, Math.min(rect.right, parent.innerWidth) - Math.max(rect.left, 0)) * Math.max(0, Math.min(rect.bottom, parent.innerHeight) - Math.max(rect.top, 0)) : 0;
  if (frame?.isConnected && frame.dataset.adsterraFrame === ${JSON.stringify(key)} && frame.dataset.eligible === 'true'
    && !parent.document.documentElement.hasAttribute('data-adsterra-disabled')
    && parent.document.visibilityState === 'visible' && parent.document.hasFocus()
    && navigator.globalPrivacyControl !== true && (choice === null || choice === 'allow')
    && rect.width === ${width} && rect.height === ${height} && visibleArea >= ${width * height / 2}
    && frame.adsterraCanLoad?.()) {
    document.write(${literal});
  } else { report('skipped'); }
} catch { report('failed'); }
</script></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
