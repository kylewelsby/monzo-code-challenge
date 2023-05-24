/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { parse } from "https://deno.land/std@0.184.0/flags/mod.ts";

import { scrapeRecursive } from "./src/scraper.ts";

const flags = parse(Deno.args, {
  string: ["levels", "output"],
  default: { levels: "4" },
});
const url = Deno.args[0];
const levels = parseInt(flags.levels);
if (isNaN(levels)) {
  throw new Error("levels must be a number");
}

const urls = await scrapeRecursive(new URL(url), levels, flags.output);
if (flags.output) {
  console.log(`📝 Output written to ${flags.output}`);
} else {
  console.log(urls);
}
