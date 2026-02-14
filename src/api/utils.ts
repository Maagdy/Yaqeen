/**
 * Wraps a URL to be proxied through our serverless proxy function.
 * This ensures proper URL encoding and prevents query parameter conflicts.
 *
 * @param url - The full URL to proxy (including any query parameters)
 * @returns The proxied URL path
 *
 * @example
 * proxyUrl('https://api.example.com/data?key=value')
 * // Returns: '/api/proxy?url=https%3A%2F%2Fapi.example.com%2Fdata%3Fkey%3Dvalue'
 */
export const proxyUrl = (url: string): string => {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

/**
 * Builds a URL with query parameters
 * @param baseUrl - The base URL
 * @param params - Object of query parameters
 * @returns URL with query string
 */
export const buildUrl = (
  baseUrl: string,
  params?: Record<string, string | number | boolean | undefined>,
): string => {
  if (!params) return baseUrl;

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
