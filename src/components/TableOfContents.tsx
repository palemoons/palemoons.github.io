"use client";

import type { Itoc } from "@/interfaces/post";
import classNames from "classnames";
import Link from "next/link";
import React, { ReactNode, useEffect, useRef, useState } from "react";

import SettingIcon from "./icons/SettingIcon";

type Props = {
  tocContent: Array<Itoc>;
} & React.HTMLAttributes<HTMLDivElement>;

const TableOfContents = ({ tocContent, ...props }: Props): ReactNode => {
  const { className, ...rest } = props;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);

  const tocIndent = {
    1: "ml-0",
    2: "ml-4",
    3: "ml-8",
    4: "ml-12",
    5: "ml-16",
    6: "ml-20",
  } as const;

  // update activeId by observing heading
  useEffect(() => {
    if (!tocContent?.length) return;

    const navbarHeight = getComputedStyle(document.documentElement).getPropertyValue("--layout-navbar-height") || "0px";

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        const id = (visible[0].target as HTMLElement).id;
        if (id) setActiveId(id);
      },
      {
        root: null,
        rootMargin: `-${navbarHeight} 0px -50% 0px`,
        threshold: 0,
      },
    );
    const headingElements = tocContent.map((v) => document.getElementById(v.slug)).filter(Boolean) as HTMLElement[];
    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [tocContent]);

  // scroll active heading to center (desktop)
  useEffect(() => {
    if (!desktopContainerRef.current || !activeId) return;

    const element = desktopContainerRef.current.querySelector(".toc-active") as HTMLElement | null;
    if (!element) return;

    const container = desktopContainerRef.current;
    const containerHeight = container.clientHeight;
    const elementOffsetTop = element.offsetTop;
    const elementHeight = element.clientHeight;
    const scrollTop = elementOffsetTop - containerHeight / 2 + elementHeight / 2;
    container.scrollTo({ top: scrollTop, behavior: "smooth" });
  }, [activeId]);

  // scroll active heading to center when opening
  useEffect(() => {
    if (!mobileOpen || !mobileListRef.current || !activeId) return;
    const element = mobileListRef.current.querySelector(".toc-active") as HTMLElement | null;
    if (!element) return;

    const container = mobileListRef.current;
    const containerHeight = container.clientHeight;
    const elementOffsetTop = element.offsetTop;
    const elementHeight = element.clientHeight;
    const scrollTop = elementOffsetTop - containerHeight / 2 + elementHeight / 2;
    container.scrollTo({ top: scrollTop, behavior: "smooth" });
  }, [mobileOpen, activeId]);

  // disable background scrolling when opening
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const onClickItem = () => {
    closeMobileToc();
  };

  const openMobileToc = () => {
    setMounted(true);
    requestAnimationFrame(() => setMobileOpen(true));
  };

  const closeMobileToc = () => {
    setMobileOpen(false);
    window.setTimeout(() => setMounted(false), 300);
  };

  return (
    <>
      {/* Desktop */}
      <aside
        ref={desktopContainerRef}
        {...rest}
        className={classNames("hidden p-4 text-(--color-page-fg) md:block", className ?? "")}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-base font-semibold tracking-tight">文章目录</div>
          <span className="text-xs opacity-60">TOC</span>
        </div>

        {tocContent.length > 0 ? (
          <nav className="space-y-1">
            {tocContent.map((value, index) => (
              <div
                key={index.toString()}
                className={classNames(
                  "flex items-start gap-2 text-sm leading-6",
                  tocIndent[(value.lvl + 1) as 1 | 2 | 3 | 4 | 5 | 6],
                )}
              >
                <span className="py-1 opacity-60">{value.number}</span>
                <Link
                  href={`#${value.slug}`}
                  className={classNames(
                    "block flex-1 truncate rounded-sm px-2 py-1 hover:bg-(--color-hover)",
                    activeId === value.slug
                      ? "toc-active font-semibold underline decoration-(--color-link-underline) decoration-1 underline-offset-4 opacity-100"
                      : "no-underline opacity-80 hover:opacity-100",
                  )}
                >
                  {value.content}
                </Link>
              </div>
            ))}
          </nav>
        ) : (
          <div className="py-2 pl-4 text-sm leading-6 opacity-60">本文未划分章节</div>
        )}

        <div className="mt-3 flex items-center gap-4 text-sm opacity-80">
          <Link className="rounded-md py-1 no-underline hover:bg-(--color-hover) hover:opacity-100" href="#toc-title">
            顶部
          </Link>
          <span className="opacity-50">|</span>
          <Link
            className="rounded-md py-1 no-underline hover:bg-(--color-hover) hover:opacity-100"
            href="#toc-comments"
          >
            评论
          </Link>
        </div>
      </aside>

      {/* Mobile Floating Button */}
      <button
        type="button"
        onClick={openMobileToc}
        className={classNames(
          "fixed right-4 bottom-4 z-50 md:hidden",
          "rounded-sm border border-(--color-border-muted) shadow-sm",
          "bg-(--color-page-bg) p-1.5",
          "cursor-pointer opacity-90 hover:opacity-100",
        )}
        aria-label="打开文章目录"
      >
        <SettingIcon />
      </button>

      {/* Mobile */}
      {mounted && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className={classNames(
              "absolute inset-0 bg-black/30",
              mobileOpen ? "opacity-100" : "opacity-0",
              "transition-opacity duration-250 ease-in-out",
            )}
            aria-label="关闭目录"
            onClick={closeMobileToc}
          />

          <div
            className={classNames(
              "absolute right-0 bottom-0 left-0",
              "bg-(--color-page-bg) text-(--color-page-fg) shadow-lg",
              mobileOpen ? "translate-y-0" : "translate-y-full",
              "transition-transform duration-250 ease-in-out",
            )}
          >
            <div className="px-4 pt-3 pb-2">
              <div className="mx-auto h-1 w-10 rounded-full bg-(--color-border-muted) opacity-80" />
              <div className="mt-3 flex items-center justify-between">
                <div className="text-base font-semibold tracking-tight">文章目录</div>
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-sm opacity-80 hover:bg-(--color-hover) hover:opacity-100"
                  onClick={closeMobileToc}
                >
                  关闭
                </button>
              </div>
            </div>

            <div ref={mobileListRef} className="max-h-[60vh] overflow-auto px-4 pb-4">
              <nav className="space-y-1">
                {tocContent.map((value, index) => (
                  <div
                    key={index.toString()}
                    className={classNames(
                      "flex items-start gap-2 text-sm leading-6",
                      tocIndent[(value.lvl + 1) as 1 | 2 | 3 | 4 | 5 | 6],
                    )}
                  >
                    <span className="py-1 opacity-60">{value.number}</span>
                    <Link
                      href={`#${value.slug}`}
                      onClick={onClickItem}
                      className={classNames(
                        "block flex-1 truncate rounded-sm px-2 py-2",
                        activeId === value.slug
                          ? "toc-active underline decoration-(--color-link-underline) decoration-2 underline-offset-4 opacity-100"
                          : "no-underline opacity-80 hover:opacity-100",
                      )}
                    >
                      {value.content}
                    </Link>
                  </div>
                ))}
              </nav>

              <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
                <Link
                  className="rounded-md px-2 py-2 no-underline hover:bg-(--color-hover) hover:opacity-100"
                  href="#toc-title"
                  onClick={onClickItem}
                >
                  顶部
                </Link>
                <span className="opacity-50">|</span>
                <Link
                  className="rounded-md px-2 py-2 no-underline hover:bg-(--color-hover) hover:opacity-100"
                  href="#toc-comments"
                  onClick={onClickItem}
                >
                  评论
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableOfContents;
