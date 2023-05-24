/**
 * Scrape the website recursively for urls
 *
 * @param inputUrl - the URL to scrape
 * @param maxLevel - the maximum level of recursion
 * @param visitedUrls - visited URLs (used on recursive calls)
 * @param level - the current level of recursion
 * @returns a list of URLs
 */
export async function scrapeRecursive(
  inputUrl: URL,
  maxLevel = 4,
  fileOutput: string | undefined = undefined,
) {
  console.log(`🔎 Scraping urls from ${inputUrl.href}`);
  urlQueue.push(inputUrl.href);
  if (fileOutput) {
    /* Clear the file */
    await Deno.writeTextFile(fileOutput, inputUrl.href + "\n", {
      append: false,
    });
  }
  await processQueue(maxLevel, fileOutput);

  console.log(`✅ Completed with ${visitedUrls.size} urls`);
  return Array.from(visitedUrls);
}

const urlQueue: string[] = [];
const visitedUrls = new Set<string>();

async function processQueue(
  maxLevel = 2,
  fileOutput: string | undefined = undefined,
) {
  let level = 0;
  while (urlQueue.length > 0) {
    const urls = urlQueue.splice(0, Math.min(100, urlQueue.length));
    urls.forEach((url) => visitedUrls.add(url));
    let newUrls;
    if (level < maxLevel) {
      level++;
      newUrls = await recursiveWorker(urls);
      console.log(`👀 Level: ${level} - ${newUrls.length} urls`);
    } else {
      newUrls = urls;
    }
    newUrls.filter((url) => !visitedUrls.has(url) && !urlQueue.includes(url))
      .forEach(async (url) => {
        urlQueue.push(url);
        if (fileOutput) {
          await Deno.writeTextFile(fileOutput, url + "\n", { append: true });
        }
      });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

function recursiveWorker(
  parentUrls: string[],
): Promise<string[]> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url).href, {
      type: "module",
    });
    worker.postMessage({
      urls: parentUrls,
    });
    worker.onmessage = (e) => {
      const urls = e.data as string[];
      worker.terminate();
      resolve(urls);
    };
    worker.onerror = (e) => {
      console.error(e);
      worker.terminate();
      resolve([]);
    };
  });
}
