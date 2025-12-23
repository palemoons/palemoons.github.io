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
    <div className="flex justify-center">
      <div>
        <div className="flex items-center justify-between pt-8 max-[640px]:flex-col-reverse">
          <div className="h-min max-[640px]:text-center">
            <div
              className="my-2 text-[40px] font-semibold"
              id="toc-title"
              style={{ scrollMarginTop: "calc(var(--navbar-height) + 12px)" }}
            >
              {frontMatter.title}
            </div>
            <div className="mt-2 mb-1 text-sm whitespace-pre-line">{frontMatter.description}</div>
            <div className="mb-1 [&>span]:mr-3 [&>span]:text-sm [&>span]:text-[#808080]">
              <span className="mb-4 inline-block">
                发布于 {createdDate.getFullYear()} 年 {createdDate.getMonth() + 1} 月 {createdDate.getDate()} 日
              </span>
              {updatedDate && (
                <>
                  <span className="mb-4 inline-block">|</span>
                  <span className="mb-4 inline-block">
                    更新于 {updatedDate.getFullYear()} 年 {updatedDate.getMonth() + 1} 月 {updatedDate.getDate()} 日
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-center">
            <Image src={avatar} width={160} height={160} alt="avatar" className="rounded-full" />
          </div>
        </div>
        <MarkdownRenderer>{ast}</MarkdownRenderer>
        <Comments id="toc-comments" />
      </div>
      <div className="hidden w-[calc(50vw-490px)] border-l border-l-(--color-border-strong) pt-12 pl-4 max-[1340px]:w-[calc(50vw-420px)] max-[1200px]:w-[calc(50vw-380px)] max-[1080px]:hidden">
        <TableOfContents tocContent={tocContent} />
      </div>
    </div>
  );
}
