import avatar from "@/assets/avatar.jpg";
import Comments from "@/components/Comments";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MobileTOC, TOC } from "@/components/TOC";
import { Itoc } from "@/interfaces/post";
import { getAboutPost } from "@/lib/posts";
import toc from "markdown-toc-unlazy";
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
  const tocContent = handleTocHeader(
    toc(content).json.filter((header: Itoc) => header.lvl <= SITE_CONFIG.tocMaxHeader),
  );
  return (
    <div className="flex justify-center">
      <div className="w-[calc(50vw-490px)] border-l border-l-[color:var(--color-border-strong)] pt-12 pl-4 max-[1340px]:w-[calc(50vw-420px)] max-[1200px]:w-[calc(50vw-380px)] max-[1080px]:hidden" />
      <div className="container max-[1340px]:max-w-[720px] max-[1200px]:max-w-[640px]">
        <div className="flex items-center justify-between pt-8 max-[640px]:flex-col-reverse">
          <div className="h-min max-[640px]:text-center">
            <div
              className="my-2 text-[40px] font-semibold"
              id="toc-title"
              style={{ scrollMarginTop: "calc(var(--navbar-height) + 12px)" }}
            >
              {frontMatter.title}
            </div>
            <div className="mt-2 mb-1 whitespace-pre-line text-sm">{frontMatter.description}</div>
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
        <MarkdownRenderer abbrlink={""}>{content}</MarkdownRenderer>
        <Comments id="toc-comments" />
      </div>
      <div className="hidden w-[calc(50vw-490px)] border-l border-l-[color:var(--color-border-strong)] pt-12 pl-4 max-[1340px]:w-[calc(50vw-420px)] max-[1200px]:w-[calc(50vw-380px)] max-[1080px]:hidden">
        <TOC
          tocContent={tocContent}
          className="sticky top-[var(--navbar-height)] h-[calc(100vh-var(--navbar-height)-24px)] w-full overflow-y-auto"
        />
      </div>
      <MobileTOC tocContent={tocContent} className="fixed bottom-4 right-4 z-[1] min-[1080px]:hidden" />
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
