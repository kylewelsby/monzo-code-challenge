import { scrape, scrapeRecursive } from "../../src/scraper.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertSnapshot,
} from "../../tests/deps.ts";

Deno.test("scrape", async (t) => {
  await t.step("fetches the hyperlinks for a given url", async () => {
    const urls = await scrape(new URL("https://monzo.com"));
    assertEquals(urls.length, 34);
    assertEquals(urls[0], "https://monzo.com/");
    assertArrayIncludes(urls, [
      "https://monzo.com/about/",
      "https://monzo.com/blog/",
    ]);
  });

  const urls = await scrape(new URL("https://monzo.com"));
  await assertSnapshot(t, urls);
});

Deno.test("scrapeRecursive", async (t) => {
  await t.step("fetches the hyperlinks for a given url", async () => {
    const urls = await scrapeRecursive(new URL("https://monzo.com"));
    // assertEquals(urls.length, 34);
    assertEquals(urls[0], "https://monzo.com/");
    assertArrayIncludes(urls, [
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
