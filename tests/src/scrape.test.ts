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

mockFetch
  .intercept("https://example.com/hyperlinksOnly", { method: "GET" })
  .response(
    "<a href='/'>home</a><a href='mailto:test@example.com'>email</a><a href='tel:0800555555'>call</a>",
    { status: 200 },
  ).persist();

mockFetch
  .intercept("https://example.com/domainSpecific", { method: "GET" })
  .response(
    `<a href="/">Home</a>
    <a href='https://twitter.com?url=https://example.com'>twitter</a>
    <a href="https://reddit.com">Reddit</a>
    <a href="https://subdomain.example.com">Subdomain</a>`,
    { status: 200 },
  ).persist();

Deno.test("scrape", async (t) => {
  const urls = await scrape(new URL("https://monzo.com"));
  await assertSnapshot(t, urls);

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

  await t.step("returns hyperlinks only", async () => {
    const urls = await scrape(new URL("https://example.com/hyperlinksOnly"));
    assertEquals(urls.length, 1);
  });

  await t.step("omits domains that are not the given domain", async () => {
    const urls = await scrape(new URL("https://example.com/domainSpecific"));
    assertEquals(urls.length, 1);
  });
});
