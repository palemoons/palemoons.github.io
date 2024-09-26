import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import styles from "./page.module.css";
import ReactMarkdown from "@/components/ReactMarkdown";
import { IPostHeader } from "@/interfaces/Post";

export default function Page({ params }: { params: { category: string; slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();
  const { content, ...frontMatter } = post;
  const { title, description, tags } = frontMatter;
  const createdDate = new Date(frontMatter.date);
  const updatedDate = frontMatter.updated ? new Date(frontMatter.updated) : null;
  return (
    <>
      <div className={styles.postHeader}>
        <div className={styles.postTitle}>{title}</div>
        <div className={styles.postDesc}>{description}</div>
        {tags && (
          <div>
            {tags.map((tag, index) => (
              <div key={index.toString()} className="flexItem">
                <Link href={`/tag/${tag}`} className={styles.postTag}>
                  # {tag}
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className={styles.postTime}>
          <span>
            发布于 {createdDate.getFullYear()} 年 {createdDate.getMonth() + 1} 月 {createdDate.getDate()} 日
          </span>
          {updatedDate && (
            <>
              <span>|</span>
              <span>
                更新于 {updatedDate.getFullYear()} 年 {updatedDate.getMonth() + 1} 月 {updatedDate.getDate()} 日
              </span>
            </>
          )}
          <span>|</span>
          <span>
            遵循{" "}
            <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
              CC BY-NC-SA 4.0
            </Link>{" "}
            许可
          </span>
        </div>
      </div>
      <div>
        <ReactMarkdown frontMatter={frontMatter as IPostHeader}>{content}</ReactMarkdown>
      </div>
    </>
  );
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  return { title: `${post.title} | ${process.env.TITLE}`, description: post.title };
}

export function generateStaticParams() {
  const categories = ["note", "article"];
  return categories
    .map((category) =>
      getPostsByCategory(category).map((post) => ({
        category,
        slug: post.key,
      })),
    )
    .flat();
}
