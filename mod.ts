/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { parse } from "https://deno.land/std@0.184.0/flags/mod.ts";

import { scrapeRecursive } from "./src/scraper.ts";

const flags = parse(Deno.args, {
  string: ["levels"],
  default: { levels: "4" },
});
const url = Deno.args[0];
const levels = parseInt(flags.levels);
if (isNaN(levels)) {
  throw new Error("levels must be a number");
}

const urls = await scrapeRecursive(new URL(url), levels);
console.log(urls);

/**
 * What would I like to do more with this?
 * - I would consider adding a few more CLI options to output the collected results to file
 * - I would refactor this mod.ts so it importable as a Deno module.
 * - I would introduce concurrency to the scraper to speed up the scraping process.
 */
