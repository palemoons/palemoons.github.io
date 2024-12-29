import { notFound } from "next/navigation";
import { Pagination } from "@/components/PostList";
import { countTags, getPostsByTag } from "@/lib/posts";
import styles from "./page.module.css";
import { SITE_CONFIG } from "@/app/site.config";

export default function TagPage({ params }: { params: { slug: string } }) {
  const posts = getPostsByTag(decodeURI(params.slug));
  if (posts.length <= 0) return notFound();
  return (
    <div className="container">
      <div className={styles.siteTitle}>
        <span className={styles.tag}>#{decodeURI(params.slug)}</span>
      </div>
      <div>共归档 {posts.length} 篇文章。</div>
      <Pagination posts={posts} pageSize={SITE_CONFIG.categoryPaginationSize} />
    </div>
  );
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `${decodeURI(params.slug)} | ${SITE_CONFIG.title}`,
    description: `Posts including tag ${decodeURI(params.slug)}`,
  };
}

export function generateStaticParams() {
  const tags = countTags();
  return tags.map((tag) => ({
    slug: encodeURI(tag.name),
  }));
}
