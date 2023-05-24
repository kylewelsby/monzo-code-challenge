import { scrape } from "./scrape.ts";

const levelsDeep = 3;

/**
 * Scrape the website recursively for urls
 *
 * @param inputUrl - the URL to scrape
 * @param visitedUrls - visited URLs (used on recursive calls)
 * @param level - the current level of recursion
 * @returns a list of URLs
 */
export async function scrapeRecursive(
  inputUrl: URL,
  visitedUrls: Set<string> = new Set<string>(),
  level = 0,
) {
  visitedUrls.add(inputUrl.href);
  if (level > levelsDeep) {
    console.debug(`Level:${level} - Is too deep, returning`);
    return Array.from(visitedUrls);
  }
  console.debug(`Level:${level} - Scraping recursive ${inputUrl.href}`);
  const topLevelUrls = await scrape(inputUrl);

  for (const link of topLevelUrls) {
    if (!visitedUrls.has(link)) {
      await scrapeRecursive(new URL(link), visitedUrls, level + 1);
    }
  }

  return Array.from(visitedUrls);
}
