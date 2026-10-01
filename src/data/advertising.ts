// Restored for testing at the site owner's explicit request, 2026-10-01.
// Provider reported filtering specific advertisers; creative suitability is unverified.
// Set false and rebuild/deploy to immediately disable all preserved placements.
export const ADSTERRA_ENABLED = true;

// Adsterra requires a separate code for a second banner of the same size.
// Add the owner's second 160x600 atOptions key AND exact invoke.js URL here.
// null deliberately produces no right-side markup, request, or placeholder.
export type AdsterraBannerCode = { key: string; scriptUrl: string };
export const HOME_RIGHT_SKYSCRAPER: AdsterraBannerCode | null = null;

export const ADSTERRA_BANNER_UNITS = {
  leaderboard: { key: "0fe0be46f2556cae7a00611434c290ba", width: 728, height: 90 },
  skyscraper: { key: "b3835aaa2a375ba813849deb163c0827", width: 160, height: 600 },
  tablet: { key: "65be6445c30f2287e7757a826c0a92cc", width: 468, height: 60 },
  compact: { key: "ca6f70a4d1332386663f3d261023c083", width: 160, height: 300 },
  mobile: { key: "8bdb1389324ed22e93ff2b4c419c3822", width: 320, height: 50 },
  rectangle: { key: "acf2e8ecfe101f3947382f790dc5c234", width: 300, height: 250 },
};
