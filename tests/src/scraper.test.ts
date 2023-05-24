import { scrapeRecursive } from "../../src/scraper.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertSnapshot,
} from "../../tests/deps.ts";

import { MockFetch } from "https://deno.land/x/deno_mock_fetch@1.0.1/mod.ts";

const mockFetch = new MockFetch();
mockFetch
  .intercept("https://monzo.com/", { method: "GET" })
  .response("<a href='/about/'>about</a>", { status: 200 }).persist();

mockFetch
  .intercept("https://monzo.com/about/", { method: "GET" })
  .response("<a href='/about/'>about</a><a href='/blog/'>blog</a>", {
    status: 200,
  }).persist();

mockFetch
  .intercept("https://monzo.com/blog/", { method: "GET" })
  .response("<a href='/blog/1'>post1</a>", {
    status: 200,
  }).persist();

mockFetch
  .intercept("https://monzo.com/blog/1", { method: "GET" })
  .response("<a href='/'>home</a>", {
    status: 200,
  }).persist();

Deno.test("scrapeRecursive", async (t) => {
  await t.step("fetches the recursive links for a given url", async () => {
    const urls = await scrapeRecursive(new URL("https://monzo.com"));
    assertEquals(urls.length, 4);
    assertEquals(urls[0], "https://monzo.com/");
    assertArrayIncludes(urls, [
      "https://monzo.com/",
      "https://monzo.com/about/",
      "https://monzo.com/blog/",
    ]);
  });

  const urls = await scrapeRecursive(
    new URL("https://monzo.com"),
    undefined,
    1,
  );
  await assertSnapshot(t, urls);
});
