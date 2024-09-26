import { getPostBySlug, getSortedPosts } from "@/lib/posts";

const siteUrl = "https://blog.palemoons.tech";
const navItems = [
  { name: "技术笔记", url: "/note" },
  { name: "生活杂谈", url: "/article" },
  { name: "文章分类", url: "/tag" },
  { name: "关于本站", url: "/about" },
];

export default function sitemap() {
  const posts = getSortedPosts().map(({ key: abbrlink }) => {
    const post = getPostBySlug(abbrlink);
    return post
      ? {
          url: `${siteUrl}/${post.category}/${post.abbrlink}`,
          lastModified: post.updated || post.date,
        }
      : null;
  });

  const routes = navItems.map((item) => ({
    url: `${siteUrl}${item.url}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...posts];
}
