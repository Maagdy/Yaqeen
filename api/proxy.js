// Whitelist of domains that serve static content and are safe to cache
const CACHEABLE_DOMAINS = [
  "mp3quran.net",
  "quranpedia.net",
  "sunnah.com",
  "quran-tafseer.com",
  "islamic.network",
];

// Patterns that should NEVER be cached (even if domain is whitelisted)
const EXCLUDED_PATTERNS = [
  "/radios", // Live radio status
  "/search", // Search results
  "search=", // Query param search
  "q=", // Query param search
];

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    const targetUrl = new URL(url);
    const isWhitelisted = CACHEABLE_DOMAINS.some((domain) =>
      targetUrl.hostname.includes(domain),
    );
    const isExcluded = EXCLUDED_PATTERNS.some((pattern) =>
      url.includes(pattern),
    );

    // Apply strict caching only for whitelisted static content that isn't excluded
    if (isWhitelisted && !isExcluded) {
      // s-maxage=86400 (24h) for CDN/Edge cache
      // stale-while-revalidate=86400 (24h) to serve stale content while updating
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=86400, stale-while-revalidate=86400",
      );
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": req.headers["x-api-key"],
      },
    });
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
