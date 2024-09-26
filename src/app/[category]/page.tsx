import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import { getPostsByCategory } from "@/lib/posts";
import styles from "./page.module.css";

const navItems = [
  { title: "技术笔记", category: "note" },
  { title: "生活杂谈", category: "article" },
];

export default function postArchive({ params }: { params: { category: string } }) {
  const posts = getPostsByCategory(params.category);
  if (posts.length <= 0) return notFound();

  return (
    <>
      <div className={styles.siteTitle}>{navItems.filter((item) => item.category === params.category)[0].title}</div>
      <div>共归档 {posts.length} 篇文章。</div>
      <Pagination posts={posts} />
    </>
  );
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const matchedItem = navItems.filter((item) => item.category === params.category);
  if (matchedItem.length > 0)
    return { title: `${matchedItem[0].title} | ${process.env.TITLE}`, description: "Category of blog." };
  else return notFound();
}

export function generateStaticParams() {
  return navItems.map((item) => ({
    category: item.category,
  }));
}
