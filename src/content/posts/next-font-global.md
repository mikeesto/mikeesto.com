---
title: How to use @next/font globally
description: How to use a custom font from @next/font and apply it globally in your Next.js application
date: 20-02-2023
draft: false
---

The [@next/font](https://www.npmjs.com/package/@next/font) package can download Google Fonts at build time and self-host them as a static asset. This is useful because no requests are made to Google by the client to request fonts used on the page. However, it wasn't obvious to me how to apply the font globally. This can be achieved as follows.

### app.js

```js
import "@/styles/globals.css";

import { DM_Sans } from "@next/font/google";

const dm_sans = DM_Sans({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --dm-font: ${dm_sans.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
```

And then use the CSS variable in your stylesheet.

### global.css

```css
body {
  font-family: var(--dm-font);
}
```
