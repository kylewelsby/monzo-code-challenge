/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { scrape } from "./src/scraper.ts";
const url = Deno.args[0];
const urls = await scrape(new URL(url));
console.log(urls);
