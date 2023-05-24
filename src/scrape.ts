import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

/**
 * Using the given inputUrl, the function will fetch the HTML and parse it for all links.
 *
 * @param inputUrl - the URL to scrape
 * @returns list of URLS for the page
 */
export async function scrape(inputUrl: URL) {
  const response = await fetch(inputUrl.href);
  const html = await response.text();
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  if (document) {
    const links = document.querySelectorAll("a");
    const hrefs = Array.from(links).map((link) =>
      (link as unknown as Element).getAttribute("href")!
    );
    const urls = hrefs.filter((href) => href !== null);
    return cleanupUrls(urls, inputUrl);
  }
  return [];
}

/**
 * This function will take a list of URLs and clean them up.
 *
 * @params urls - list of URLs to clean up
 * @params inputUrl - the top level URL
 * @returns list of cleaned up URLs
 */
function cleanupUrls(urls: (string)[], inputUrl: URL) {
  const expandedHrefs = urls.map((href) => {
    if (href && href.startsWith("http")) {
      return href;
    }
    return `${inputUrl.origin}${href}`;
  });

  const subdomainSpecificHrefs = expandedHrefs.filter((href) => {
    return href && href.includes(`${inputUrl.origin}`);
  });
  const removeAnchors = subdomainSpecificHrefs.map((href) =>
    href?.split("#")[0]
  );
  const cleanedUrls = removeAnchors.map((href) => new URL(href).href);
  const uniqueHrefs = Array.from(new Set(cleanedUrls));
  const sortedHrefs = uniqueHrefs.sort();
  return sortedHrefs;
}
