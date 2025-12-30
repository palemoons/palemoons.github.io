import SITE_CONFIG from "@/app/site.config";
import { Pagination } from "@/components/PostList";
import { getPostsByCategory } from "@/lib/posts";
import { notFound } from "next/navigation";

export default function postArchive({ params }: { params: { category: string } }) {
  const posts = getPostsByCategory(params.category);
  if (posts.length <= 0) return notFound();

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mt-12 mb-3 text-4xl font-semibold">
        {SITE_CONFIG.categories.filter((item) => item.url === params.category)[0].name}
      </h1>
      <div className="mb-8 text-sm leading-relaxed text-(--color-text-muted)">共归档 {posts.length} 篇文章。</div>
      <Pagination posts={posts} pageSize={SITE_CONFIG.categoryPaginationSize} />
    </div>
  );
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const matchedItem = SITE_CONFIG.categories.filter((item) => item.url === params.category);
  if (matchedItem.length > 0)
    return { title: `${matchedItem[0].name} | ${SITE_CONFIG.title}`, description: "Category of blog." };
  else return notFound();
}

export function generateStaticParams() {
  return SITE_CONFIG.categories.map((item) => ({
    category: item.url,
  }));
}
