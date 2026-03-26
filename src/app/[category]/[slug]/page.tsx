import SITE_CONFIG from "@/app/site.config";
import Comments from "@/components/Comments";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import { Itoc } from "@/interfaces/post";
import { compileMarkdown } from "@/lib/markdown/parse";
import buildHeadingTree from "@/lib/markdown/toc";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

type PageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post || post.category !== category) {
    notFound();
  }

  const { content, ...frontMatter } = post;
  const { title, description, tags } = frontMatter;
  const abbrlink = slug;
  const createdDate = new Date(frontMatter.date);
  const updatedDate = frontMatter.updated ? new Date(frontMatter.updated) : null;
  const ast = compileMarkdown(content);
  const tocContent = buildHeadingTree(ast).filter((header: Itoc) => header.lvl <= SITE_CONFIG.tocMaxHeader);

  return (
    <section className="flex justify-center gap-4">
      <div className="max-w-2xl px-4">
        <div className="mt-14 mb-10 border-b border-b-(--color-border-strong)">
          <h1 className="mb-4 block text-4xl leading-12 font-semibold" id="toc-title">
            {title}
          </h1>
          <div className="mt-3 mb-3 text-sm leading-relaxed">{description}</div>
          {tags && (
            <div className="mt-2 mb-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Link
                  href={`/tag/${tag}`}
                  className="rounded-xs bg-(--color-tag-bg) px-1 py-0.5 text-xs leading-4 text-(--color-tag-fg) no-underline"
                  key={index.toString()}
                >
                  # {tag}
                </Link>
              ))}
            </div>
          )}
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
            <span className="mr-3">|</span>
            <span className="mr-3">
              遵循
              <Link
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                className="mx-0.5 rounded-sm px-1 py-0.5"
              >
                CC BY-NC-SA 4.0
              </Link>
              许可
            </span>
          </div>
        </div>
        <MarkdownRenderer imgPrefix={abbrlink}>{ast}</MarkdownRenderer>
        <Comments id="toc-comments" />
      </div>
      <TableOfContents
        tocContent={tocContent}
        className="sticky top-(--layout-navbar-height) h-[calc(100vh-var(--layout-navbar-height))] w-70 shrink-0 overflow-x-hidden overflow-y-auto pt-8"
      />
    </section>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post || post.category !== category) {
    notFound();
  }

  return {
    title: `${post.title} | ${SITE_CONFIG.title}`,
    description: post.title,
  };
}

export async function generateStaticParams() {
  const categories = SITE_CONFIG.categories;

  const allParams = await Promise.all(
    categories.map(async (category) => {
      const posts = await getPostsByCategory(category.url);
      return posts.map((post) => ({
        category: category.url,
        slug: post.key,
      }));
    }),
  );

  return allParams.flat();
}
