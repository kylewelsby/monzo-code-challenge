/// <reference lib="dom" />

import { scrape } from "./scrape.ts";

self.onmessage = async (e) => {
  const { urls } = e.data;

  const visitedUrls = new Set<string>();

  await Promise.all(
    urls.map(async (url: string) => {
      const topLevelUrls = await scrape(new URL(url));
      topLevelUrls.forEach((url) => visitedUrls.add(url));
    }),
  );

  self.postMessage(Array.from(visitedUrls));
};
