"use client";

import { useState } from "react";
import { IPostHeader } from "@/interfaces/Post";
import styles from "./Pagination.module.css";
import BlogList from "./BlogList";

export default function Pagination({
  posts,
  pageSize = 10,
}: {
  posts: Array<{ key: string; value: IPostHeader }>;
  pageSize?: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
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
          <div key={index.toString()} className={styles.yearContainer}>
            <div className={styles.yearTitle}>{year}</div>
            <BlogList posts={posts} />
          </div>
        ))}
      </div>

      <div className={styles.pageSetter}>
        <button onClick={() => handleSetPage(1)} disabled={currentPage === 1}>
          首页
        </button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          上一页
        </button>
        <span className="flexItem">
          {currentPage} / {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          下一页
        </button>
        <button onClick={() => handleSetPage(totalPages)} disabled={currentPage === totalPages}>
          末页
        </button>
      </div>
    </>
  );
}
