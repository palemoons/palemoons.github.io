import SITE_CONFIG from "@/app/site.config";
import { Pagination } from "@/components/PostList";
import { countTags, getPostsByTag } from "@/lib/posts";
import { notFound } from "next/navigation";

export default function TagPage({ params }: { params: { slug: string } }) {
  const posts = getPostsByTag(decodeURI(params.slug));
  if (posts.length <= 0) return notFound();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mt-12 mb-3 text-4xl font-semibold">#{decodeURI(params.slug)}</h1>
      <div className="mb-8 text-sm leading-relaxed text-(--color-text-muted)">共归档 {posts.length} 篇文章。</div>
      <Pagination posts={posts} pageSize={SITE_CONFIG.categoryPaginationSize} />
    </div>
  );
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `${decodeURI(params.slug)} | ${SITE_CONFIG.title}`,
    description: `Posts including tag ${decodeURI(params.slug)}`,
  };
}

export function generateStaticParams() {
  const tags = countTags();
  return tags.map((tag) => ({
    slug: tag.name,
  }));
}
