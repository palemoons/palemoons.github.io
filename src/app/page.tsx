import { BlogList } from "@/components/PostList";
import { getPostsByCategory } from "@/lib/posts";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import React from "react";

import { SITE_CONFIG } from "./site.config";

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  generator: SITE_CONFIG.generator,
  alternates: {
    types: {
      "application/rss+xml": [
        {
          title: SITE_CONFIG.title,
          url: `${SITE_CONFIG.siteUrl}/feed`,
        },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
};

const Index = () => {
  const recentNotes = getPostsByCategory("note");
  const recentArticles = getPostsByCategory("article");
  return (
    <section className="m-auto max-w-2xl px-4">
      <div
        id="introduction"
        className="mb-6 [&_a]:underline [&_a]:decoration-(--color-link-underline) [&_a]:decoration-1 [&_a:hover]:decoration-[1.5px]"
      >
        <div className="mt-16 mb-4 text-4xl font-semibold">你好，来访者。</div>
        <div className="mb-3 text-base leading-8 font-extralight">这里是 Palemoons 的网络存档点。</div>
        <div className="text-base leading-8 font-extralight [&>a]:mx-1">
          本站主要堆放本人工作学习期间的{<Link href="/note">记录</Link>}以及生活中的一些
          {<Link href="article">随笔</Link>}。
        </div>
        <div className="text-base leading-8 font-extralight [&>a]:mx-1">
          如果想了解更多信息，可在{<Link href="/about">关于</Link>}页面查阅。
        </div>
      </div>
      <div id="recent-notes">
        <div className="mt-14 mb-5 text-2xl font-semibold">近期笔记</div>
        <BlogList className="mb-3" posts={recentNotes} size={SITE_CONFIG.landingPageListSize} />
        <div className="mb-10">
          <Link href="/note" className="text-sm decoration-(--color-link-underline) hover:underline">
            更多笔记...
          </Link>
        </div>
        <div className="mt-14 mb-5 text-2xl font-semibold">最新杂谈</div>
        <BlogList className="mb-3" posts={recentArticles} size={SITE_CONFIG.landingPageListSize} />
        <div>
          <Link href="/article" className="text-sm decoration-(--color-link-underline) hover:underline">
            更多杂谈...
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Index;
