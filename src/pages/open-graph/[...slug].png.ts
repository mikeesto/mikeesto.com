import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title } = props as { title: string };

  const markup = getMarkup(title);

  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff"
  ).then((res) => res.arrayBuffer());

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const png = pngData.asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};

function getMarkup(text: string) {
  return {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "60px",
        backgroundColor: "#faf9f7",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, #e0ddd8 1px, transparent 0)",
        backgroundSize: "24px 24px",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "42px",
                          color: "#1a1a1a",
                          lineHeight: 1.3,
                          maxWidth: "900px",
                        },
                        children: text,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          width: "80px",
                          height: "3px",
                          backgroundColor: "gold",
                          marginTop: "16px",
                        },
                        children: "",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "8px",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          width: "24px",
                          height: "2px",
                          backgroundColor: "#888",
                        },
                        children: "",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "20px",
                          color: "#666",
                          letterSpacing: "0.02em",
                        },
                        children: "mikeesto.com",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}
