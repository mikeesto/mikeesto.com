import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { parse } from "date-fns";
import { filterPosts } from "../utils/filterPosts";

export async function GET(context) {
  const posts = await getCollection("posts");
  const filteredPosts = filterPosts(posts);

  return rss({
    title: "Michael Esteban",
    description: "Michael Esteban's small home on the internet",
    site: context.site,
    items: filteredPosts.map((post) => ({
      title: post.data.title,
      pubDate: parse(post.data.date, "dd-MM-yyyy", new Date()),
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
  });
}
