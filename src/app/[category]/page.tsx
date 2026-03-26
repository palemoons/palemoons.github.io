import SITE_CONFIG from "@/app/site.config";
import { Pagination } from "@/components/PostList";
import { getPostsByCategory } from "@/lib/posts";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-static";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function postArchive({ params }: PageProps) {
  const { category } = await params;

  const posts = await getPostsByCategory(category);
  if (posts.length <= 0) notFound();

  const matchedItem = SITE_CONFIG.categories.find((item) => item.url === category);
  if (!matchedItem) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mt-12 mb-3 text-4xl font-semibold">
        {matchedItem.name}
      </h1>
      <div className="mb-8 text-sm leading-relaxed text-(--color-text-muted)">
        共归档 {posts.length} 篇文章。
      </div>
      <Pagination posts={posts} pageSize={SITE_CONFIG.categoryPaginationSize} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;

  const matchedItem = SITE_CONFIG.categories.find((item) => item.url === category);
  if (!matchedItem) notFound();

  return {
    title: `${matchedItem.name} | ${SITE_CONFIG.title}`,
    description: "Category of blog.",
  };
}

export async function generateStaticParams() {
  return SITE_CONFIG.categories.map((item) => ({
    category: item.url,
  }));
}