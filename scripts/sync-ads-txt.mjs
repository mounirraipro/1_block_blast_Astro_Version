import { writeFile } from "node:fs/promises";

const source = "https://srv.adstxtmanager.com/19390/blockblast.fr";
const destination = new URL("../public/ads.txt", import.meta.url);
// Retain the site's existing AdSense authorization alongside Ezoic's entries.
const adsenseEntry = "google.com, pub-1032974487169355, DIRECT, f08c47fec0942fa0";

const response = await fetch(source, { signal: AbortSignal.timeout(20_000) });
if (!response.ok) {
  throw new Error(`ads.txt sync failed: Ezoic returned HTTP ${response.status}`);
}
if (!response.headers.get("content-type")?.toLowerCase().startsWith("text/plain")) {
  throw new Error("ads.txt sync failed: expected a plain-text seller list");
}

const content = (await response.text()).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
const records = content.split("\n")
  .map((line) => line.split("#", 1)[0].trim())
  .filter(Boolean);
const sellerPattern = /^(?:[a-z0-9-]+\.)+[a-z0-9-]+\s*,\s*[^,\s]+\s*,\s*(?:DIRECT|RESELLER)(?:\s*,\s*[^,\s]+)?$/i;
const metadataPattern = /^[a-z][a-z0-9_-]*\s*=\s*[^<>]+$/i;

if (records.some((line) => !sellerPattern.test(line) && !metadataPattern.test(line))) {
  throw new Error("ads.txt sync failed: the response contains invalid ads.txt records");
}
if (!records.some((line) => /^ownerdomain\s*=\s*blockblast\.fr$/i.test(line))) {
  throw new Error("ads.txt sync failed: the seller list does not identify blockblast.fr");
}
if (!records.some((line) => /^ezoic\.(?:ai|com)\s*,/i.test(line))) {
  throw new Error("ads.txt sync failed: the response has no Ezoic seller entry");
}

const hasAdsenseEntry = records.some((line) => {
  const [domain, account] = line.split(",").map((field) => field.trim());
  return domain.toLowerCase() === "google.com" && account === "pub-1032974487169355";
});
const output = hasAdsenseEntry
  ? `${content}\n`
  : `${content}\n\n# Existing site AdSense account\n${adsenseEntry}\n`;

// Validate the complete response before replacing the existing file.
await writeFile(destination, output, "utf8");
console.log(`Updated public/ads.txt from ${source}`);
