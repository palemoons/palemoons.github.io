import SITE_CONFIG from "@/app/site.config";
import { Pagination } from "@/components/PostList";
import { countTags, getPostsByTag } from "@/lib/posts";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;

  const posts = await getPostsByTag(decodeURIComponent(slug));
  if (posts.length <= 0) return notFound();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mt-12 mb-3 text-4xl font-semibold">#{decodeURIComponent(slug)}</h1>
      <div className="mb-8 text-sm leading-relaxed text-(--color-text-muted)">共归档 {posts.length} 篇文章。</div>
      <Pagination posts={posts} pageSize={SITE_CONFIG.categoryPaginationSize} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: `${decodeURIComponent(slug)} | ${SITE_CONFIG.title}`,
    description: `Posts including tag ${decodeURIComponent(slug)}`,
  };
}

export async function generateStaticParams() {
  const tags = await countTags();
  return tags.map((tag) => ({
    slug: encodeURIComponent(tag.name),
  }));
}
