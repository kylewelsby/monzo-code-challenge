/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { scrapeRecursive } from "./src/scraper.ts";
const url = Deno.args[0];
const urls = await scrapeRecursive(new URL(url));
console.log(urls);
