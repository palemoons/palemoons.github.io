import { getPostBySlug, getSortedPosts } from "@/lib/posts";
import { MetadataRoute } from "next";

import SITE_CONFIG from "./site.config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sortedPosts = await getSortedPosts();

  const postEntries = await Promise.all(
    sortedPosts.map(async ({ key: abbrlink }) => {
      const post = await getPostBySlug(abbrlink);
      if (!post) return null;

      return {
        url: `${SITE_CONFIG.siteUrl}/${post.category}/${post.abbrlink}`,
        lastModified: post.updated || post.date,
      };
    }),
  ).then((value) => value.filter((item) => item !== null));

  const navItems = SITE_CONFIG.categories.concat(SITE_CONFIG.subpages);

  const routes = navItems.map((item) => ({
    url: `${SITE_CONFIG.siteUrl}/${item.url}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...postEntries];
}
