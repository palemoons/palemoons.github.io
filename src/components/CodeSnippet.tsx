"use client";

import SITE_CONFIG from "@/app/site.config";
import ClipBoardIcon from "@/components/icons/ClipBoardIcon";
import CopyIcon from "@/components/icons/CopyIcon";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, github } from "react-syntax-highlighter/dist/esm/styles/hljs";

import FullscreenExpand from "./icons/FullscreenExpand";
import FullscreenShrink from "./icons/FullscreenShrink";

const ACTION_BUTTON_CLASS =
  "inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-(--color-text-muted) hover:bg-(--color-hover) hover:text-(--color-page-fg) focus-visible:bg-(--color-hover) focus-visible:outline-2 focus-visible:outline-(--color-border-strong)";

function CodeAction({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-full right-0 mt-1 rounded-md border border-(--color-surface-border) bg-(--color-page-bg) px-2 py-1 text-xs whitespace-nowrap text-(--color-page-fg) shadow-sm group-hover:visible group-has-focus-visible:visible"
      >
        {label}
      </span>
    </span>
  );
}

function hasCodeBelow({ scrollHeight, clientHeight, scrollTop }: HTMLDivElement) {
  // scrollTop can be fractional even though the measured heights are rounded.
  return scrollHeight - clientHeight - Math.max(0, scrollTop) > 1;
}

const CodeSnippet = (params: { children: string; language?: string; className?: string }) => {
  const { children, language, className } = params;
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const [horizontalScrollbarHeight, setHorizontalScrollbarHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onCopy = (_text: string, success: boolean) => {
    if (!success || copied) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const openFullscreen = () => {
    dialogRef.current?.showModal();
    setFullscreenOpen(true);
  };

  useEffect(() => {
    const scroll = scrollRef.current;
    const code = codeRef.current;
    if (!scroll || !code) return;

    const updateScrollLayout = () => {
      // The scroll container has no border, so this difference is the horizontal scrollbar's height.
      setHorizontalScrollbarHeight(scroll.offsetHeight - scroll.clientHeight);
      setShowBottomFade(hasCodeBelow(scroll));
    };
    const observer = new ResizeObserver(updateScrollLayout);
    observer.observe(scroll);
    observer.observe(code);
    updateScrollLayout();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!fullscreenOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [fullscreenOpen]);

  const copyButton = (
    <CodeAction label={copied ? "已复制" : "复制代码"}>
      <CopyToClipboard text={children} onCopy={onCopy}>
        <button type="button" aria-label="复制代码" className={ACTION_BUTTON_CLASS}>
          {copied ? <CopyIcon aria-hidden="true" /> : <ClipBoardIcon aria-hidden="true" />}
        </button>
      </CopyToClipboard>
      <span role="status" className="sr-only">
        {copied ? "已复制代码" : ""}
      </span>
    </CodeAction>
  );

  const fullscreenExpandButton = (
    <CodeAction label="全屏预览">
      <button
        type="button"
        onClick={openFullscreen}
        className={ACTION_BUTTON_CLASS}
        aria-haspopup="dialog"
        aria-label="全屏预览"
      >
        <FullscreenExpand />
      </button>
    </CodeAction>
  );

  const fullscreenShrinkButton = (
    <CodeAction label="退出预览">
      <button
        type="button"
        onClick={() => dialogRef.current?.close()}
        className={ACTION_BUTTON_CLASS}
        aria-label="退出预览"
      >
        <FullscreenShrink />
      </button>
    </CodeAction>
  );

  const highlightedCode = (
    <SyntaxHighlighter
      PreTag="code"
      language={language}
      style={theme === "light" ? github : atomOneDark}
      showLineNumbers
      className={className}
      customStyle={{
        background: "transparent",
        display: "block",
        overflowX: "visible",
        width: "max-content",
        minWidth: "100%",
        fontSize: "0.875rem",
        lineHeight: "1.6",
      }}
      codeTagProps={{
        style: {
          fontFamily: "var(--font-code)",
          fontSize: "0.875rem",
          lineHeight: "1.6",
        },
      }}
      lineNumberStyle={{
        minWidth: "2rem",
        paddingRight: "0.75rem",
        opacity: 0.45,
        fontVariantNumeric: "tabular-nums",
        userSelect: "none",
      }}
    >
      {children}
    </SyntaxHighlighter>
  );

  return (
    <>
      <div className="my-6 min-w-0 overflow-hidden rounded-lg border border-(--color-surface-border) bg-(--color-surface-bg)">
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-(--color-surface-border) px-3 py-1 text-xs">
          <span className="min-w-0 truncate font-semibold tabular-nums opacity-80">{language ?? ""}</span>
          <div className="flex shrink-0 items-center gap-1">
            {copyButton}
            {fullscreenExpandButton}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="overflow-auto"
          style={{ maxHeight: SITE_CONFIG.maxCodeHeight + horizontalScrollbarHeight }}
          onScroll={(event) => setShowBottomFade(hasCodeBelow(event.currentTarget))}
        >
          <div ref={codeRef}>{highlightedCode}</div>
          {showBottomFade && (
            <div aria-hidden="true" className="pointer-events-none sticky bottom-0 left-0 h-0">
              <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-transparent to-(--color-surface-bg)" />
            </div>
          )}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setFullscreenOpen(false)}
        aria-label="全屏代码预览"
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-(--color-surface-bg) text-(--color-page-fg)"
      >
        <div className="flex h-full flex-col">
          <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-(--color-surface-border) px-3 py-2 text-xs">
            <span className="font-semibold tabular-nums">{language ?? "代码"}</span>
            <div className="flex items-center gap-2">
              {copyButton}
              {fullscreenShrinkButton}
            </div>
          </div>
          {fullscreenOpen && (
            <div
              role="region"
              aria-label="代码内容"
              tabIndex={0}
              className="min-h-0 flex-1 overflow-auto overscroll-contain"
            >
              {highlightedCode}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default CodeSnippet;
