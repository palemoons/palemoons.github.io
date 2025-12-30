import { Feed } from "feed";
import { getSortedPosts } from "@/lib/posts";
import { IPostHeader } from "@/interfaces/post";
import SITE_CONFIG from "@/app/site.config";

export async function GET() {
  const posts: Array<{ key: string; value: IPostHeader }> = getSortedPosts();
  const feed = new Feed({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    link: SITE_CONFIG.siteUrl,
    id: SITE_CONFIG.siteUrl,
    favicon: `${SITE_CONFIG.siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author}`,
    language: "zh-CN",
    updated: SITE_CONFIG.buildTime,
  });

  posts.forEach(({ key: abbrlink, value: post }) => {
    feed.addItem({
      title: post.title,
      id: `${SITE_CONFIG.siteUrl}/${post.category}/${abbrlink}`,
      link: `${SITE_CONFIG.siteUrl}/${post.category}/${abbrlink}`,
      description: post.description,
      date: new Date(post.date),
    });
  });

  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
