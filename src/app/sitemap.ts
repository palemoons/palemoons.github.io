import { SITE_CONFIG } from "./site.config";
import { getPostBySlug, getSortedPosts } from "@/lib/posts";

export default function sitemap() {
  const posts = getSortedPosts().map(({ key: abbrlink }) => {
    const post = getPostBySlug(abbrlink);
    return post
      ? {
          url: `${SITE_CONFIG.siteUrl}/${post.category}/${post.abbrlink}`,
          lastModified: post.updated || post.date,
        }
      : null;
  });

  const navItems = SITE_CONFIG.categories.concat(SITE_CONFIG.subpages);
  const routes = navItems.map((item) => ({
    url: `${SITE_CONFIG.siteUrl}/${item.url}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...posts];
}
