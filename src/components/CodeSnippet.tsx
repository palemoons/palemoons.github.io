"use client";

import { SITE_CONFIG } from "@/app/site.config";
import ClipBoardIcon from "@/components/icons/ClipBoardIcon";
import CopyIcon from "@/components/icons/CopyIcon";
import ExtendIcon from "@/components/icons/ExtendIcon";
import classNames from "classnames";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, github } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeSnippet = (params: { children: string; language?: string; className?: string }) => {
  const { children, language, className } = params;
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [codeHeight, setCodeHeight] = useState(0);
  const [extended, setExtented] = useState(false);
  const codeRef = useRef<HTMLDivElement | null>(null);

  const onCopy = () => {
    if (copied) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const onExtend = () => setExtented(!extended);

  useEffect(() => {
    if (codeRef.current) setCodeHeight(codeRef.current.clientHeight);
  }, []);

  const canToggle = codeHeight > SITE_CONFIG.maxCodeHeight;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-(--color-surface-border) bg-(--color-surface-bg)">
      <div className="flex items-center justify-between gap-3 border-b border-(--color-surface-border) px-3 py-2 text-xs opacity-80">
        <span className="font-semibold tabular-nums">{language ?? ""}</span>

        {copied ? (
          <button type="button" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 opacity-80">
            <CopyIcon />
            已复制！
          </button>
        ) : (
          <CopyToClipboard text={children}>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 opacity-80"
            >
              <ClipBoardIcon />
              复制代码
            </button>
          </CopyToClipboard>
        )}
      </div>

      <div className="relative">
        <div
          className={classNames("overflow-auto", extended ? "max-h-none" : `max-h-[${SITE_CONFIG.maxCodeHeight}px]`)}
        >
          <SyntaxHighlighter
            PreTag={(props) => <code {...props} ref={codeRef} />}
            language={language}
            style={theme === "light" ? github : atomOneDark}
            showLineNumbers
            className={className}
            customStyle={{
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
        </div>

        {canToggle && !extended && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-transparent to-(--color-surface-bg)" />
            <button
              type="button"
              onClick={onExtend}
              className={classNames(
                "absolute right-2 bottom-2",
                "inline-flex items-center gap-1.5",
                "rounded-md border px-2 py-1 text-xs",
                "border-(--color-surface-border) bg-(--color-surface-bg)",
                "opacity-90 hover:bg-(--color-hover) hover:opacity-100",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border-strong)",
                "transition-[background,opacity] duration-150",
              )}
              aria-label="展开代码"
            >
              <ExtendIcon />
              展开
            </button>
          </>
        )}

        {canToggle && extended && (
          <button
            type="button"
            onClick={onExtend}
            className={classNames(
              "absolute right-2 bottom-2",
              "inline-flex items-center gap-1.5",
              "rounded-md border px-2 py-1 text-xs",
              "border-(--color-surface-border) bg-(--color-surface-bg)",
              "opacity-90 hover:bg-(--color-hover) hover:opacity-100",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border-strong)",
              "transition-[background,opacity] duration-150",
            )}
            aria-label="收起代码"
          >
            <ExtendIcon />
            收起
          </button>
        )}
      </div>
    </div>
  );
};

export default CodeSnippet;
