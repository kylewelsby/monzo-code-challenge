import { assert } from "https://deno.land/std@0.187.0/testing/asserts.ts";
import { scrape } from "../../src/scrape.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertSnapshot,
} from "../../tests/deps.ts";

import { MockFetch } from "https://deno.land/x/deno_mock_fetch@1.0.1/mod.ts";

const MonzoHTML = Deno.readTextFileSync(
  `${Deno.cwd()}/tests/src/__fixtures__/monzo.com.html`,
);

const mockFetch = new MockFetch();
mockFetch
  .intercept("https://monzo.com/", { method: "GET" })
  .response(MonzoHTML, { status: 200 }).persist();

mockFetch
  .intercept("https://example.com/blankHref", { method: "GET" })
  .response("<a>broken href</a>", { status: 200 }).persist();

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

  await t.step("omits blank hrefs", async () => {
    const urls = await scrape(new URL("https://example.com/blankHref"));
    assertEquals(urls.length, 0);
  });

  const urls = await scrape(new URL("https://monzo.com"));
  await assertSnapshot(t, urls);
});
