import { SITE_CONFIG } from "@/app/site.config";
import Comments from "@/components/Comments";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import { Itoc } from "@/interfaces/post";
import { compileMarkdown } from "@/lib/markdown/parse";
import extractToc from "@/lib/markdown/toc";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import classNames from "classnames";
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
      <div className="container w-170">
        <div className="border-b border-b-(--color-quote-fg)">
          <div
            className="mt-12 mb-3 block text-[40px] font-semibold leading-12"
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
                    className="mr-1.5 mb-1 rounded-xs bg-(--color-inline-bg) px-1.5 py-0.75 text-sm leading-4.5 text-(--color-inline-fg) no-underline"
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
      <TableOfContents
        tocContent={tocContent}
        className={classNames(
          "sticky top-(--layout-navbar-height)",
          "w-70 h-[calc(100vh-var(--layout-navbar-height))]",
          "overflow-y-auto overflow-x-hidden",
        )}
      />
    </div>
  );
}

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
