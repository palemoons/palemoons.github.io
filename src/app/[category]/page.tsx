import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import { getPostsByCategory } from "@/lib/posts";
import styles from "./page.module.css";
import { SITE_CONFIG } from "../site.config";

export default function postArchive({ params }: { params: { category: string } }) {
  const posts = getPostsByCategory(params.category);
  if (posts.length <= 0) return notFound();

  return (
    <>
      <div className={styles.siteTitle}>
        {SITE_CONFIG.categories.filter((item) => item.url === params.category)[0].name}
      </div>
      <div>共归档 {posts.length} 篇文章。</div>
      <Pagination posts={posts} />
    </>
  );
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const matchedItem = SITE_CONFIG.categories.filter((item) => item.url === params.category);
  if (matchedItem.length > 0)
    return { title: `${matchedItem[0].name} | ${SITE_CONFIG.title}`, description: "Category of blog." };
  else return notFound();
}

export function generateStaticParams() {
  return SITE_CONFIG.categories.map((item) => ({
    category: item.url,
  }));
}
