import { scrape } from "./scrape.ts";

/**
 * Scrape the website recursively for urls
 *
 * @param inputUrl - the URL to scrape
 * @param maxLevel - the maximum level of recursion
 * @param visitedUrls - visited URLs (used on recursive calls)
 * @param level - the current level of recursion
 * @returns a list of URLs
 */
export async function scrapeRecursive(
  inputUrl: URL,
  maxLevel = 4,
  level = 0,
  visitedUrls: Set<string> = new Set<string>(),
) {
  visitedUrls.add(inputUrl.href);
  if (level > maxLevel) {
    console.debug(`Level:${level} - Is too deep, returning`);
    return Array.from(visitedUrls);
  }
  console.debug(`Level:${level} - Scraping recursive ${inputUrl.href}`);
  const topLevelUrls = await scrape(inputUrl);

  for (const link of topLevelUrls) {
    if (!visitedUrls.has(link)) {
      await scrapeRecursive(new URL(link), maxLevel, level + 1, visitedUrls);
    }
  }

  return Array.from(visitedUrls);
}
