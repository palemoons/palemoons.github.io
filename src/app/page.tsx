import React from "react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import BlogList from "@/components/BlogList";
import styles from "./page.module.css";
import { getPostsByCategory } from "@/lib/posts";

export const metadata: Metadata = {
  generator: "Next.js",
  title: "Palemoons' Archive",
  description: "Palemoons' personal website.",
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
    <section>
      <div id="introduction">
        <div className={styles.siteTitle}>你好，来访者。</div>
        <div className={styles.siteDesc}>这里是Palemoons的网络存档点。</div>
        <div className={styles.siteDesc}>
          本站主要堆放本人工作学习期间的{<Link href="/note">记录</Link>}以及生活中的一些
          {<Link href="article">随笔</Link>}。如果想了解更多信息，可在{<Link href="/about">关于</Link>}页面查阅。
        </div>
      </div>
      <div id="recent-notes">
        <div className={styles.sectionTitle}>近期笔记</div>
        <BlogList posts={recentNotes} size={5} />
        <Link href="/note" className={styles.more}>
          更多文章...
        </Link>
        <div className={styles.sectionTitle}>最新杂谈</div>
        <BlogList posts={recentArticles} size={5} />
        <Link href="/article" className={styles.more}>
          更多文章...
        </Link>
      </div>
    </section>
  );
};

export default Index;
