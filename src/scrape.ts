import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

/**
 * Using the given inputUrl, the function will fetch the HTML and parse it for all links.
 *
 * @param inputUrl - the URL to scrape
 * @returns list of URLS for the page
 */
export async function scrape(inputUrl: URL) {
  try {
    const response = await fetch(inputUrl.href, { redirect: "follow" });
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
  } catch (e) {
    console.log("Failed to scarpe URL: ", inputUrl.href);
    console.error(e);
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
function cleanupUrls(urls: string[], inputUrl: URL) {
  urls = hyperlinksOnly(urls);
  urls = absoluteUrl(urls, inputUrl);
  urls = urlsOnly(urls);
  urls = subdomainSpecificUrls(urls, inputUrl);
  urls = uniq(urls);
  return sort(urls);
}

/* Helper functions */
function absoluteUrl(urls: string[], inputUrl: URL) {
  return urls.map((href) => {
    if (href && href.startsWith("http")) {
      return href;
    }
    return `${inputUrl.origin}${href}`;
  });
}

function subdomainSpecificUrls(urls: string[], inputUrl: URL) {
  return urls.filter((href) => {
    return href && href.includes(`${inputUrl.origin}`);
  });
}

function hyperlinksOnly(urls: string[]) {
  return urls.filter((href) =>
    href?.startsWith("http") || href?.startsWith("/")
  );
}

function urlsOnly(urls: string[]) {
  return urls.map((href) => {
    const url = new URL(href);
    url.hash = "";
    url.search = "";
    return url.href;
  });
}

function uniq(urls: string[]) {
  return Array.from(new Set(urls));
}

function sort(urls: string[]) {
  return urls.sort();
}
