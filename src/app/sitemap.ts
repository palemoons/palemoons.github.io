import { getSortedPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/env.server";
import { MetadataRoute } from "next";

import SITE_CONFIG from "./site.config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sortedPosts = await getSortedPosts();
  const siteUrl = getSiteUrl();

  const postEntries: MetadataRoute.Sitemap = sortedPosts.map(({ key, value }) => ({
    url: `${siteUrl}/${value.category}/${key}`,
    lastModified: new Date(value.updated || value.date),
  }));

  const navItems = SITE_CONFIG.categories.concat(SITE_CONFIG.subpages);

  const routes: MetadataRoute.Sitemap = navItems.map((item) => ({
    url: `${siteUrl}/${item.url}`,
    lastModified: new Date(),
  }));

  return [...routes, ...postEntries];
}
