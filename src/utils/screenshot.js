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

  const headless = "new"; // change to false for debugging
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();
  page.setViewport({ width: 600, height: 315, deviceScaleFactor: 2 });
  const html = getHtml(title);
  await page.setContent(html);

  await page.screenshot({ path: filePath });
  return slug;
}

function getHtml(text) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        font-family: system-ui, sans-serif;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #e5e5f7;
        background-image:  linear-gradient(#444cf7 1px, transparent 1px), linear-gradient(to right, #444cf7 1px, #e5e5f7 1px);
        background-size: 20px 20px;
      }

      .card {
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        width: 450px;
        opacity: 0.95;
        background-color: #f6f5f1;
        position: relative;
      }

      h1 {
        font-size: 1.5rem;
        margin: 0 0 1rem;
        line-height: 1.2;
        font-weight: normal;
        margin-bottom: 20px;
        display: inline-block;
        padding: 10px;
      }

      h2 {
        font-size: 1.1rem;
        font-weight: normal;
        display: inline-block;
      }

      .bottom-right {
        position: absolute;
        bottom: 0;
        right: 5px;
        
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Michael Esteban</h1>
      <br>
      <h2>${text}</h2>
      <div class="bottom-right">
        <svg
        class="inline"
        viewBox="0 0 225 260"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
      >
        <path
          d="M69.1 40.7c-.6 1.6-2.9 10.7-5.1 20.3-9.8 42.7-17.4 63.2-31 83.9l-6.1 9.3 2.7 4c9.5 13.7 27.9 23.6 50.9 27.4 12 1.9 34.9 1.5 49-1 21.2-3.8 44.4-12.8 48.9-18.9 1.9-2.6 2.1-4.2 2-16.5-.1-13.7-1-20.7-6-44.7-5.6-27.2-16.7-66.1-18.9-65.9-1.7.2-4.6 5.9-11.2 22.3L138 76.5l-9.7-.3c-5.4-.1-16.4-.5-24.4-.8l-14.6-.6-2.2-7.2c-2.7-8.2-9-22.3-12.1-26.6-2.7-3.7-4.4-3.8-5.9-.3zm15.2 61.7c4.3 1.7 9.4 7.7 12.5 14.5 2.9 6.6 4.1 18.9 2.3 24.4C96 150.7 88 157 79.3 157c-17.9 0-25.7-27.4-13.2-46.3 3.1-4.7 9.9-9.7 13.2-9.7 1 0 3.2.6 5 1.4zm61.4-.3c5.9 2.2 10.9 8.9 14.3 18.8 6.1 18.3-3 36.1-18.5 36.1-7.8 0-13.6-4.5-17.6-13.5-5.8-13.1.6-34.5 12.1-40.6 4-2.2 5.8-2.3 9.7-.8z"
        ></path>
        <path
          d="M78.3 106.7c-.4 2.1-.8 12.3-.8 22.8 0 20.2.7 26.5 3 26.5s3-6.3 3-28c0-14.9-.4-21.1-1.3-22.8-1.8-3.2-3-2.7-3.9 1.5zM139.3 106.7c-1 4.9-1 40.7 0 45.5.5 2.2 1.4 3.8 2.2 3.8 2.3 0 3-6.3 3-28 0-14.9-.4-21.1-1.3-22.8-1.8-3.2-3-2.7-3.9 1.5z"
        ></path>
      </svg>
    </div>
    </div>
  </body>
  <script type="module">
    import { annotate } from "https://unpkg.com/rough-notation?module";

    const heading = document.querySelector("h1");
    const box = annotate(heading, {
      type: "box",
      animate: false,
      color: "#ffd54f",
    });
    box.show();

    const subheading = document.querySelector("h2");
    const underline = annotate(subheading, {
      type: "underline",
      animate: false,
      color: "#e10000",
    });
    underline.show();
  </script>
</html>`;
}
