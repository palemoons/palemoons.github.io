"use client";

import Link from "next/link";
import { useState } from "react";
import { IPostHeader } from "@/interfaces/post";

const BlogList = ({ posts, size = -1 }: { posts: Array<{ key: string; value: IPostHeader }>; size?: number }) => {
  const postsData = size > 0 ? posts.slice(0, size) : posts;
  return (
    <div>
      {postsData.map((post, index) => {
        const { key: abbrlink, value: postInfo } = post;
        const { title, category, date } = postInfo;
        return (
          <div key={index.toString()} className="my-3 flex w-full justify-between text-base">
            <Link href={`/${category}/${abbrlink}`} className="no-underline hover:underline">
              {title}
            </Link>
            <Link
              href={`/${category}/${abbrlink}`}
              className="no-underline hover:underline max-sm:hidden"
            >
              {date}
            </Link>
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
          <div key={index.toString()} className="mt-2 mb-6">
            <div className="text-4xl font-semibold">{year}</div>
            <BlogList posts={posts} />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          className="border border-transparent bg-transparent text-base hover:cursor-pointer disabled:cursor-not-allowed"
          onClick={() => handleSetPage(1)}
          disabled={currentPage === 1}
        >
          首页
        </button>
        <button
          className="border border-transparent bg-transparent text-base hover:cursor-pointer disabled:cursor-not-allowed"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          上一页
        </button>
        <span className="flexItem mx-2 text-base">
          {currentPage} / {totalPages}
        </span>
        <button
          className="border border-transparent bg-transparent text-base hover:cursor-pointer disabled:cursor-not-allowed"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
        <button
          className="border border-transparent bg-transparent text-base hover:cursor-pointer disabled:cursor-not-allowed"
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
