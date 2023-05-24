import { scrapeRecursive } from "../../src/scraper.ts";
import { assertEquals, assertSnapshot } from "../../tests/deps.ts";

const MonzoHTML = Deno.readTextFileSync(
  `${Deno.cwd()}/tests/src/__fixtures__/monzo.com.html`,
);

import { serve } from "https://deno.land/std@0.188.0/http/server.ts";

const handler = () => {
  return new Response(MonzoHTML, { status: 200 });
};
serve(handler, { port: 8080 });

Deno.test("scrapeRecursive", async (t) => {
  await t.step("fetches the recursive links for a given url", async () => {
    const urls = await scrapeRecursive(new URL("http://localhost:8080"), 1);
    assertEquals(urls[0], "http://localhost:8080/");
  });

  const urls = await scrapeRecursive(
    new URL("http://localhost:8080"),
    1,
  );
  await assertSnapshot(t, urls);
});
