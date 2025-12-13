import { SITE_CONFIG } from "@/app/site.config";
import Comments from "@/components/Comments";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MobileTOC, TOC } from "@/components/TOC";
import { Itoc } from "@/interfaces/post";
import { compileMarkdown } from "@/lib/markdown/compileMarkdown";
import extractToc from "@/lib/markdown/extractToc";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { category: string; slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();
  const { content, ...frontMatter } = post;
  const { title, description, tags } = frontMatter;
  const abbrlink = params.slug;
  const createdDate = new Date(frontMatter.date);
  const updatedDate = frontMatter.updated ? new Date(frontMatter.updated) : null;

  const ast = compileMarkdown(content);
  const tocContent = extractToc(ast).filter((header: Itoc) => header.lvl <= SITE_CONFIG.tocMaxHeader);
  return (
    <div className="flex justify-center">
      <div className="container max-[1340px]:max-w-[720px] max-[1200px]:max-w-[640px]">
        <div className="border-b border-b-[color:var(--color-quote-fg)]">
          <div
            className="mt-12 mb-3 block text-[40px] font-semibold leading-[48px]"
            id="toc-title"
            style={{ scrollMarginTop: "calc(var(--navbar-height) + 12px)" }}
          >
            {title}
          </div>
          <div className="mt-2 mb-1 text-sm">{description}</div>
          {tags && (
            <div>
              {tags.map((tag, index) => (
                <div key={index.toString()} className="flexItem">
                  <Link
                    href={`/tag/${tag}`}
                    className="mr-[6px] mb-1 rounded-[2px] bg-[color:var(--color-inline-bg)] px-[6px] py-[3px] text-sm leading-[18px] text-[color:var(--color-inline-fg)] no-underline"
                  >
                    # {tag}
                  </Link>
                </div>
              ))}
            </div>
          )}
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
            <span className="mb-4 inline-block">|</span>
            <span className="mb-4 inline-block">
              遵循{" "}
              <Link
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                className="text-[#808080]"
              >
                CC BY-NC-SA 4.0
              </Link>{" "}
              许可
            </span>
          </div>
        </div>
        <div>
          <MarkdownRenderer abbrlink={abbrlink}>{ast}</MarkdownRenderer>
        </div>
        <Comments id="toc-comments" />
      </div>
      <TOC
        tocContent={tocContent}
        className="sticky top-[var(--navbar-height)] h-[calc(100vh-var(--navbar-height)-24px)] w-full overflow-y-auto"
      />
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
