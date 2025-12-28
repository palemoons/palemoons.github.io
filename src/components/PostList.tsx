"use client";

import { IPostHeader } from "@/interfaces/post";
import classnames from "classnames";
import Link from "next/link";
import { useState } from "react";

interface BlogListProps {
  posts: Array<{ key: string; value: IPostHeader }>;
  size?: number;
}
const BlogList = ({ posts, size, ...componentProps }: BlogListProps & React.ComponentProps<"div">) => {
  const { className, ...restProps } = componentProps;
  const postsData = size ? posts.slice(0, size) : posts;
  return (
    <div className={classnames("flex flex-col gap-6", className)} {...restProps}>
      {postsData.map((post, index) => {
        const { key: abbrlink, value: postInfo } = post;
        const { title, category, description, date } = postInfo;
        return (
          <div className="flex flex-col gap-1" key={index.toString()}>
            <div className="text-sm tabular-nums opacity-60">{date}</div>
            <div>
              <Link
                href={`/${category}/${abbrlink}`}
                className="text-base font-semibold no-underline hover:underline hover:decoration-(--color-link-underline)"
              >
                {title}
              </Link>
            </div>
            {description && <p className="text-sm leading-6 opacity-70">{description}</p>}
          </div>
        );
      })}
    </div>
  );
};

const Pagination = ({
  posts,
  pageSize = 10,
}: {
  posts: Array<{ key: string; value: IPostHeader }>;
  pageSize?: number;
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(posts.length / pageSize);
  const currentPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const splittedPostsRecord: Record<string, Array<{ key: string; value: IPostHeader }>> = {};
  currentPosts.forEach((post) => {
    const year = new Date(post.value.date).getFullYear().toString();
    if (year in splittedPostsRecord) splittedPostsRecord[year].push(post);
    else splittedPostsRecord[year] = [post];
  });
  const splittedPosts = Object.entries(splittedPostsRecord).sort((a, b) => Number(b[0]) - Number(a[0]));

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleSetPage = (toPage: number) => {
    setCurrentPage(toPage);
  };
  return (
    <>
      <div>
        {splittedPosts.map(([year, posts], index) => (
          <section key={index.toString()} className="mt-6 mb-12">
            <h2 className="mb-4 text-3xl font-semibold">{year}</h2>
            <BlogList posts={posts} />
          </section>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <button
          className="rounded-sm px-2 py-1 text-(--color-page-fg) enabled:cursor-pointer enabled:hover:bg-(--color-hover) disabled:opacity-40"
          onClick={() => handleSetPage(1)}
          disabled={currentPage === 1}
        >
          首页
        </button>

        <button
          className="rounded-sm px-2 py-1 text-(--color-page-fg) enabled:cursor-pointer enabled:hover:bg-(--color-hover) disabled:opacity-40"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          上一页
        </button>

        <span className="mx-2 text-(--color-text-muted) select-none">
          {currentPage} / {totalPages}
        </span>

        <button
          className="rounded-sm px-2 py-1 text-(--color-page-fg) enabled:cursor-pointer enabled:hover:bg-(--color-hover) disabled:opacity-40"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>

        <button
          className="rounded-sm px-2 py-1 text-(--color-page-fg) enabled:cursor-pointer enabled:hover:bg-(--color-hover) disabled:opacity-40"
          onClick={() => handleSetPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          末页
        </button>
      </div>
    </>
  );
};

export { BlogList, Pagination };
