# Monzo Code Challenge

This repository contains the solution to the
[Monzo Code Challenge](./CHALLENGE.md) completed by
[Kyle Welsby](https://github.com/kylewelsby). The challenge involved building a
WebScraper tool using Deno, a secure and modern JavaScript/TypeScript runtime.

The WebScraper tool enables you to scrape a given website for URLs, navigating
through different levels of URLs to discover more. It provides flexibility in
specifying the depth of traversal and allows you to save the scraped URLs to a
text file for further analysis.

## ⚡️ System Dependencies

Before using the WebScraper tool, make sure you have the following dependencies
installed on your system:

- [Deno](https://deno.land): The runtime environment required to build and run
  the tool.

Follow the steps below to install Deno:

1. Visit the [Deno installation guide](https://deno.land/#installation) for
   detailed instructions based on your operating system.

2. Install Deno according to the provided instructions.

3. Verify that Deno is installed correctly by running the following command in
   your terminal:

   ```bash
   deno --version
   ```

_At the time of writing the latest stable version of Deno is 1.33.4_

## 🎲 Usage

To use the WebScraper tool, follow the steps below:

1. Ensure that you have Deno installed on your system. If not, refer to the
   System Depencencies section above for installation instruactions.

2. Open your terminal or command prompt and navigate to the directory where the
   `mod.ts` file is located.

3. Run the following command, replacing the `<website-url>` placeholder with the
   URL you want to scrape:

   ```bash
   deno run --allow-net --allow-write --allow-read mod.ts <website-url> [options]
   ```

   | Option            | Description                                                                                                                       | Default  |
   | ----------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | `<website-url>`   | The URL of the website you want to scrape.                                                                                        |          |
   | `--levels=<n>`    | (optional): Specify the number of levels deep to scrape. By default, the tool will go up to 4 levels deep.                        | 4        |
   | `--output=<file>` | (optional): Specify the output file to save the scrapedå URLs. If not provided, the URLs will be printed to the console (stdout). | `stdout` |

   For example, to scrape the https://monzo.com/ website up to 3 levels deep and
   save the URLs to a file named urls.txt, use the following command:

   ```bash
   deno run --allow-net --allow-write --allow-read mod.ts https://monzo.com/ --levels=3 --output=urls.txt
   ```

4. Wait for the scraping process to complete. The tool will navigate through the
   specified levels of URLs, discovering more URLs along the way.

5. Once the process finishes, you will find the scraped URLs either in the
   specified output file or printed in the console, depending on your chosen
   configuration.

Note: The --allow-net, --allow-write, and --allow-read flags are used to grant
necessary permissions to the tool for network access, writing to files, and
reading files, respectively. Make sure to include these flags when running the
command.

## 🧪 Testing

To ensure the correctness of the WebScraper tool, unit tests are provided.
Follow the instructions below to run the tests:

```
deno test -A
```

## 🚨 Linting

Deno provides built-in linting and formatting tools to ensure code consistency
and maintainability. Follow the instructions below to run the linters and
formatters on your WebScraper tool codebase:

Run the following command to format the code using Deno's built-in formatter:

```bash
deno fmt
```

Run the following command to run the Deno linter:

```bash
deno lint
```

The linter checks your code for potential issues, enforces best practices, and
alerts you to any deviations from the recommended coding standards.

## 🎓 License

MIT: https://kylewelsby.mit-license.org
