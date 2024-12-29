import { Feed } from "feed";
import { getSortedPosts } from "@/lib/posts";
import { IPostHeader } from "@/interfaces/Post";
import { SITE_CONFIG } from "@/app/site.config";

export async function GET() {
  const posts: Array<{ key: string; value: IPostHeader }> = getSortedPosts();
  const feed = new Feed({
    title: `RSS Feed | ${SITE_CONFIG.title}`,
    description: `RSS feed for ${SITE_CONFIG.title}.`,
    link: SITE_CONFIG.siteUrl,
    id: SITE_CONFIG.siteUrl,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author}`,
    language: "zh-CN",
  });

  posts.forEach(({ key: abbrlink, value: post }) => {
    feed.addItem({
      title: post.title,
      id: `${SITE_CONFIG.siteUrl}/${abbrlink}`,
      link: `${SITE_CONFIG.siteUrl}/${abbrlink}`,
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
