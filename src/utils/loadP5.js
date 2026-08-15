const P5_SCRIPT_ID = "p5-script";
const P5_SCRIPT_SRC = "https://cdn.jsdelivr.net/npm/p5@2.0.4/lib/p5.min.js";

let p5Promise;

export function loadP5() {
  if (window.p5) {
    return Promise.resolve(window.p5);
  }

  if (p5Promise) {
    return p5Promise;
  }

  p5Promise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(P5_SCRIPT_ID);
    const script = existingScript ?? document.createElement("script");

    script.addEventListener("load", () => resolve(window.p5), { once: true });
    script.addEventListener(
      "error",
      () => {
        p5Promise = undefined;
        reject(new Error("Failed to load p5.js"));
      },
      { once: true },
    );

    if (!existingScript) {
      script.id = P5_SCRIPT_ID;
      script.src = P5_SCRIPT_SRC;
      document.head.append(script);
    }
  });

  return p5Promise;
}
