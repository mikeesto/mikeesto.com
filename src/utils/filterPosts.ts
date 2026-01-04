import { compareDesc, parse, format } from "date-fns";

interface PostData {
  date: string;
  draft?: boolean;
  formattedDate?: string;
  title: string;
  description: string;
}

interface Post {
  slug: string;
  data: PostData;
}

export function filterPosts(posts: Post[]): Post[] {
  // Exclude drafts
  let filteredPosts = posts.filter((post) => !post.data.draft);

  // Add formatted date
  filteredPosts.forEach((post) => {
    const parsedDate = parse(post.data.date, "dd-MM-yyyy", new Date());
    post.data.formattedDate = format(parsedDate, "do MMMM, yyyy");
  });

  // Sort by date
  filteredPosts.sort((post1, post2) =>
    compareDesc(
      parse(post1.data.date, "dd-MM-yyyy", new Date()),
      parse(post2.data.date, "dd-MM-yyyy", new Date())
    )
  );

  return filteredPosts;
}
