import SITE_CONFIG from "@/app/site.config";
import { IPostHeader } from "@/interfaces/post";
import { getSiteUrl } from "@/lib/env.server";
import { getSortedPosts } from "@/lib/posts";
import { Feed } from "feed";

export const dynamic = "force-static";

export async function GET() {
  const posts: Array<{ key: string; value: IPostHeader }> = await getSortedPosts();
  const siteUrl = getSiteUrl();

  const feed = new Feed({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    link: siteUrl,
    id: siteUrl,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author}`,
    language: "zh-CN",
    updated: new Date(),
  });

  posts.forEach(({ key: abbrlink, value: post }) => {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/${post.category}/${abbrlink}`,
      link: `${siteUrl}/${post.category}/${abbrlink}`,
      description: post.description,
      date: new Date(post.date),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
