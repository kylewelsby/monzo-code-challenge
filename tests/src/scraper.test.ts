import { scrape } from "../../src/scraper.ts";
import { assertEquals, assertArrayIncludes } from "../../tests/deps.ts";

Deno.test("scraper", async (t) => {
  await t.step("fetches the hyperlinks for a given url", async () => {
    const urls = await scrape(new URL("https://monzo.com"));
    assertEquals(urls.length, 34);
    assertEquals(urls[0], "https://monzo.com/");
    assertArrayIncludes(urls, ["https://monzo.com/about/", "https://monzo.com/blog/"]);
  });
});
