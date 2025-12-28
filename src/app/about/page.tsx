import avatar from "@/assets/avatar.jpg";
import Comments from "@/components/Comments";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import { Itoc } from "@/interfaces/post";
import { compileMarkdown } from "@/lib/markdown/parse";
import buildHeadingTree from "@/lib/markdown/toc";
import { getAboutPost } from "@/lib/posts";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  const ast = compileMarkdown(content);
  const tocContent = buildHeadingTree(ast).filter((header: Itoc) => header.lvl <= SITE_CONFIG.tocMaxHeader);
  return (
    <section className="flex justify-center gap-4">
      <div className="max-w-2xl px-4">
        <div className="mt-14 mb-10 flex flex-col-reverse gap-4 border-b border-b-(--color-quote-fg) md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-4 block text-4xl leading-12 font-semibold" id="toc-title">
              {frontMatter.title}
            </h1>
            <div className="mt-3 mb-3 text-sm leading-relaxed whitespace-pre-line">{frontMatter.description}</div>
            <div className="mt-2 mb-3 text-sm leading-relaxed text-(--color-text-muted)">
              <span className="mr-3">
                发布于 {createdDate.getFullYear()} 年 {createdDate.getMonth() + 1} 月 {createdDate.getDate()} 日
              </span>
              {updatedDate && (
                <>
                  <span className="mr-3">|</span>
                  <span className="mr-3">
                    更新于 {updatedDate.getFullYear()} 年 {updatedDate.getMonth() + 1} 月 {updatedDate.getDate()} 日
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="inline-flex shrink-0 items-center">
            <Image src={avatar} width={128} height={128} alt="avatar" className="rounded-full" />
          </div>
        </div>
        <MarkdownRenderer>{ast}</MarkdownRenderer>
        <Comments id="toc-comments" />
      </div>
      <TableOfContents
        tocContent={tocContent}
        className="sticky top-(--layout-navbar-height) h-[calc(100vh-var(--layout-navbar-height))] w-70 shrink-0 overflow-x-hidden overflow-y-auto pt-8"
      />
    </section>
  );
}
