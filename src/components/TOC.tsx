"use client";

import { Itoc } from "@/interfaces/post";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const TOC = ({ tocContent, ...props }: { tocContent: Array<Itoc> } & React.HTMLAttributes<HTMLDivElement>) => {
  const headingBase = "my-[2px] truncate whitespace-nowrap text-ellipsis no-underline hover:underline [&]:text-inherit";
  const headingList = [
    headingBase,
    `${headingBase} ml-3`,
    `${headingBase} ml-6`,
    `${headingBase} ml-9`,
    `${headingBase} ml-12`,
    `${headingBase} ml-[60px]`,
  ];
  const { className, ...rest } = props;
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50% 0px",
        threshold: 0,
      },
    );
    const headingElements = tocContent.map((toc) => document.getElementById(toc.slug));
    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });
    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [tocContent]);

  useEffect(() => {
    if (containerRef.current && activeId) {
      const element = document.getElementsByClassName("toc-active")[0] as HTMLElement;
      if (element) {
        const container = containerRef.current;
        const containerHeight = container.clientHeight;
        const elementOffsetTop = element.offsetTop;
        const elementHeight = element.clientHeight;

        const scrollTop = elementOffsetTop - containerHeight / 2 + elementHeight / 2;
        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  return (
    <div ref={containerRef} {...rest}>
      <div className="title my-4 text-2xl font-semibold">目录</div>
      {tocContent.map((value, index) => {
        return (
          <Link key={index.toString()} href={`#${value.slug}`}>
            {value.content}
          </Link>
        );
      })}
      <div className="mt-4 [&>span]:mx-2">
        <Link className="inline no-underline hover:underline" href="#toc-title">
          顶部
        </Link>
        <span>|</span>
        <Link className="inline no-underline hover:underline" href="#toc-comments">
          评论
        </Link>
      </div>
    </div>
  );
};

const MobileTOC = ({ tocContent, ...props }: { tocContent: Array<Itoc> } & React.HTMLAttributes<HTMLDivElement>) => {
  const tocRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tocRef.current && !tocRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tocRef]);
  return (
    <div ref={tocRef} {...props}>
      <div
        className="h-9 w-9 rounded border border-[color:var(--color-border-strong)] bg-[color:var(--color-page-bg)] text-center leading-[44px] hover:cursor-pointer hover:bg-[color:var(--color-hover)] [&>svg]:fill-[color:var(--color-icon)]"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <SettingIcon />
      </div>
      <TOC tocContent={tocContent} />
    </div>
  );
};

const SettingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} className="icon" viewBox="0 0 1024 1024" {...props}>
    <style>
      {
        "@keyframes spinner_zKoa{to{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,to{stroke-dasharray:42 150;stroke-dashoffset:-59}}"
      }
    </style>
    <g
      style={{
        transformOrigin: "center",
        animation: "spinner_zKoa 2s linear infinite",
      }}
    >
      <path d="M512 697.6c102.4 0 182.4-83.2 182.4-185.6 0-102.4-83.2-185.6-182.4-185.6-102.4 0-182.4 83.2-182.4 185.6 0 102.4 83.2 185.6 182.4 185.6zm0-51.2c-73.6 0-134.4-60.8-134.4-134.4 0-73.6 60.8-134.4 134.4-134.4 73.6 0 134.4 60.8 134.4 134.4 0 73.6-60.8 134.4-134.4 134.4z" />
      <path d="M249.015 843.179c35.2 28.8 73.6 51.2 112 67.2 41.6-38.4 96-60.8 150.4-60.8 57.6 0 108.8 22.4 150.4 60.8 41.6-16 80-38.4 112-67.2-12.8-54.4-3.2-112 22.4-163.2 28.8-48 73.6-86.4 128-102.4 3.2-22.4 6.4-44.8 6.4-67.2 0-22.4-3.2-44.8-6.4-67.2-54.4-16-99.2-54.4-128-102.4-28.8-48-35.2-108.8-22.4-163.2-35.2-28.8-73.6-51.2-112-67.2-41.6 38.4-92.8 60.8-150.4 60.8-54.4 0-108.8-22.4-150.4-60.8-41.6 16-80 38.4-112 67.2 12.8 54.4 3.2 112-22.4 163.2-28.8 48-73.6 86.4-128 102.4-3.2 22.4-6.4 44.8-6.4 67.2 0 22.4 3.2 44.8 6.4 67.2 54.4 16 99.2 54.4 128 102.4 25.6 51.2 35.2 108.8 22.4 163.2m112 115.2c-54.4-19.2-105.6-48-150.4-89.6-6.4-6.4-9.6-16-6.4-22.4 16-48 9.6-99.2-16-140.8-25.6-44.8-64-73.6-112-83.2-9.6-3.2-16-9.6-16-19.2-6.4-28.8-9.6-60.8-9.6-89.6 0-28.8 3.2-57.6 9.6-89.6 3.2-9.6 9.6-16 16-19.2 48-12.8 89.6-41.6 112-83.2 25.6-44.8 28.8-92.8 16-140.8-3.2-9.6 0-19.2 6.4-22.4 44.8-38.4 96-67.2 150.4-89.6 9.6-3.2 16 0 22.4 6.4 35.2 35.2 80 57.6 128 57.6s96-19.2 128-57.6c6.4-6.4 16-9.6 22.4-6.4 54.4 19.2 105.6 48 150.4 89.6 6.4 6.4 9.6 16 6.4 22.4-16 48-9.6 99.2 16 140.8 25.6 44.8 64 73.6 112 83.2 9.6 3.2 16 9.6 16 19.2 6.4 28.8 9.6 60.8 9.6 89.6 0 28.8-3.2 57.6-9.6 89.6-3.2 9.6-9.6 16-16 19.2-48 12.8-89.6 41.6-112 83.2-25.6 44.8-28.8 92.8-16 140.8 3.2 9.6 0 19.2-6.4 22.4-44.8 38.4-96 67.2-150.4 89.6-9.6 3.2-16 0-22.4-6.4-35.2-35.2-80-57.6-128-57.6s-96 19.2-128 57.6c-3.2 3.2-9.6 6.4-16 6.4h-6.4z" />
    </g>
  </svg>
);

export { TOC, MobileTOC };
