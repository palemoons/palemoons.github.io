"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Itoc } from "@/interfaces/Post";
import styles from "./TOC.module.css";

const TOC = ({ tocContent, ...props }: { tocContent: Array<Itoc> } & React.HTMLAttributes<HTMLDivElement>) => {
  const stylesList = [styles.toc_h1, styles.toc_h2, styles.toc_h3, styles.toc_h4, styles.toc_h5];
  const { className, ...rest } = props;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -80% 0px",
        threshold: 1.0,
      },
    );
    const headingElements = tocContent.map((toc) => document.getElementById(toc.content));
    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });
    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [tocContent]);
  return (
    <div className={`${styles.toc_wrapper} ${className || ""}`} {...rest}>
      <div className={styles.toc}>
        <div className={styles.title}>目录</div>
        {tocContent.map((value) => (
          <Link
            className={`${stylesList[value.lvl]} ${activeId === value.content ? styles.active : ""}`}
            key={value.i.toString()}
            href={`#${value.slug}`}
          >
            {value.content}
          </Link>
        ))}
        <div className={styles.fixedLink}>
          <Link className={styles.toTop} href="#toc-title">
            顶部
          </Link>
          <span>|</span>
          <Link className={styles.toComments} href="#toc-comments">
            评论
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TOC;
