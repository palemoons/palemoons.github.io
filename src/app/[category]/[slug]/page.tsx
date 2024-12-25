import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import toc from "markdown-toc-unlazy";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import { Itoc } from "@/interfaces/Post";
import styles from "./page.module.css";
import ReactMarkdown from "@/components/ReactMarkdown";
import { TOC, MobileTOC } from "@/components/TOC";
import Comments from "@/components/Comments";
import { SITE_CONFIG } from "@/app/site.config";

export default function Page({ params }: { params: { category: string; slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();
  const { content, ...frontMatter } = post;
  const { title, description, tags } = frontMatter;
  const createdDate = new Date(frontMatter.date);
  const updatedDate = frontMatter.updated ? new Date(frontMatter.updated) : null;
  const tocContent = handleTocHeader(toc(content).json).filter(
    (header: Itoc) => header.lvl <= SITE_CONFIG.tocMaxHeader,
  );
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.tocWrapper} />
      <div className={`${styles.postWrapper} container`}>
        <div className={styles.postHeader}>
          <div className={styles.postTitle} id="toc-title">
            {title}
          </div>
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
          <ReactMarkdown abbrlink={frontMatter.abbrlink!}>{content}</ReactMarkdown>
        </div>
        <Comments id="toc-comments" />
      </div>
      <div className={styles.tocWrapper}>
        <TOC tocContent={tocContent} className={styles.toc} />
      </div>
      <MobileTOC tocContent={tocContent} className={styles.mobileTOC} />
    </div>
  );
}

const handleTocHeader = (tocContent: Array<Itoc>) => {
  const minLvl = Math.min(...tocContent.map((header) => header.lvl));
  return tocContent.map((header) => {
    const { lvl, ...rest } = header;
    return {
      lvl: lvl - minLvl,
      ...rest,
    };
  });
};

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  return { title: `${post.title} | ${SITE_CONFIG.title}`, description: post.title };
}

export function generateStaticParams() {
  const categories = SITE_CONFIG.categories;
  return categories
    .map((category) =>
      getPostsByCategory(category.url).map((post) => ({
        category: category.url,
        slug: post.key,
      })),
    )
    .flat();
}
