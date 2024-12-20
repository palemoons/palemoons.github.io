import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import toc from "markdown-toc-unlazy";
import { getAboutPost } from "@/lib/posts";
import ReactMarkdown from "@/components/ReactMarkdown";
import Comments from "@/components/Comments";
import TOC from "@/components/TOC";
import { Itoc } from "@/interfaces/Post";
import avatar from "@/assets/avatar.jpg";
import styles from "./page.module.css";
import { SITE_CONFIG } from "../site.config";

export const metadata: Metadata = {
  title: `关于 | ${SITE_CONFIG.title}`,
  description: "About the blog and author.",
};

export default function AboutPage() {
  const post = getAboutPost();
  if (!post) return notFound();
  const { content, ...frontMatter } = post;
  const createdDate = new Date(frontMatter.date);
  const updatedDate = frontMatter.updated ? new Date(frontMatter.updated) : null;
  const tocContent = handleTocHeader(
    toc(content).json.filter((header: Itoc) => header.lvl <= SITE_CONFIG.tocMaxHeader),
  );
  return (
    <div className={styles.pageWrapper}>
      <TOC tocContent={tocContent} style={{ visibility: "hidden" }} className={styles.toc} />
      <div className={`${styles.postWrapper} container`}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>{frontMatter.title}</div>
            <div className={styles.description}>{frontMatter.description}</div>
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
            </div>
          </div>
          <div className={styles.avatarContainer}>
            <Image src={avatar} width={160} height={160} alt="avatar" className={styles.avatar} />
          </div>
        </div>

        <ReactMarkdown abbrlink={frontMatter.abbrlink!}>{content}</ReactMarkdown>
        <Comments />
      </div>
      <TOC tocContent={tocContent} className={styles.toc} />
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
