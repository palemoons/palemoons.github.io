import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import { countTags, getPostsByTag } from "@/lib/posts";
import styles from "./page.module.css";

export default function TagPage({ params }: { params: { slug: string } }) {
  const posts = getPostsByTag(decodeURI(params.slug));
  if (posts.length <= 0) return notFound();
  return (
    <>
      <div className={styles.siteTitle}>
        <span className={styles.tag}>#{decodeURI(params.slug)}</span>
      </div>
      <div>共归档 {posts.length} 篇文章。</div>
      <Pagination posts={posts} />
    </>
  );
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `${decodeURI(params.slug)} | ${process.env.TITLE}`,
    description: `Posts including tag ${params.slug}`,
  };
}

export function generateStaticParams() {
  const tags = countTags();
  return tags.map((tag) => ({
    slug: tag.name,
  }));
}
