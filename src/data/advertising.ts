// Restored for testing at the site owner's explicit request, 2026-10-01.
// Provider reported filtering specific advertisers; creative suitability is unverified.
// Set false and rebuild/deploy to immediately disable all preserved placements.
export const ADSTERRA_ENABLED = true;

// Adsterra requires a separate code for a second banner of the same size.
// Add the owner's second 160x600 atOptions key AND exact invoke.js URL here.
// null deliberately produces no right-side markup, request, or placeholder.
export type AdsterraBannerCode = { key: string; scriptUrl: string };
export const HOME_RIGHT_SKYSCRAPER: AdsterraBannerCode | null = null;
