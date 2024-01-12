import puppeteer from "puppeteer";
import path from "path";
import slugify from "slugify";
import fs from "fs";

export async function screenshot(title) {
  const slug = slugify(title, { lower: true });
  const filePath = path.resolve(`public/og/${slug}.png`);

  // Return early if og image already exists
  if (fs.existsSync(filePath)) {
    return slug;
  }

  //const headless = false; // change to false for debugging
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.setViewport({ width: 1200, height: 628 });
  const html = getHtml(title);
  await page.setContent(html);

  await page.screenshot({ path: filePath });
  return slug;

  // if (headless) {
  //   await browser.close();
  // }
}

function getHtml(text) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        background-color: #f6f5f1;
        font-family: sans-serif;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        flex-direction: column;
      }
      h1 {
        font-size: 3rem;
        color: #000;
        text-align: center;
        margin: 0;
      }
      img {
        position: absolute;
        bottom: 10px;
        right: 50px;
        width: auto;
        height: 225px;
      }
    </style>
  </head>
  <body>
    <h1>${text}</h1>
    <img src="https://i.ibb.co/RQYbmwm/stick.png">
  </body>
  <script type="module">
    import { annotate } from "https://unpkg.com/rough-notation?module";

    const heading = document.querySelector("h1");
    const annotation = annotate(heading, {
      type: "highlight",
      animate: false,
      color: "#ffd54f",
    });
    annotation.show();
  </script>
</html>`;
}
