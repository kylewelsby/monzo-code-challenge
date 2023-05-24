import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

export async function scrape(inputUrl: URL) {
  console.debug(`Scraping ${inputUrl.href}`);
  const response = await fetch(inputUrl);
  const html = await response.text();
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  if (document) {
    const links = document.querySelectorAll("a");
    const hrefs = Array.from(links).map((link) =>
      (link as unknown as Element).getAttribute("href")
    );
    const expandedHrefs = hrefs.map((href) => {
      if (href && href.startsWith("http")) {
        return href;
      }
      return `${inputUrl.protocol}//${inputUrl.hostname}${href}`;
    });

    const subdomainSpecificHrefs = expandedHrefs.filter((href) => {
      return href && href.includes(inputUrl.href);
    });
    const removeAnchors = subdomainSpecificHrefs.map((href) =>
      href?.split("#")[0]
    );
    const uniqueHrefs = Array.from(new Set(removeAnchors));
    const sortedHrefs = uniqueHrefs.sort();
    console.debug(`Found ${sortedHrefs.length} links`);
    return sortedHrefs;
  }
  console.error("No links found, could not parse the document");
  return [];
}
