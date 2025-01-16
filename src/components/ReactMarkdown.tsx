"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import CopyToClipboard from "react-copy-to-clipboard";
import SyntaxHighlighter from "react-syntax-highlighter";
import hybrid from "react-syntax-highlighter/dist/esm/styles/hljs/hybrid";
import "katex/dist/katex.min.css";
import styles from "./ReactMarkdown.module.css";
import Link from "next/link";
import { SITE_CONFIG } from "@/app/site.config";

export default function ReactMarkdown({ abbrlink, children }: { abbrlink: string; children: string }) {
  const HeadingRenderer = ({ level, children }: { level: number; children?: React.ReactNode }) => {
    const text = React.Children.toArray(children).join("");
    const id =
      text
        .toLowerCase()
        .replace(/[^\p{Script=Han}a-z0-9]+/gu, "-")
        .replace(/^-|-$/g, "") || text;

    const TitleTag = `h${level}` as keyof JSX.IntrinsicElements;
    return (
      <TitleTag id={id} className={styles.anchor}>
        {children}
      </TitleTag>
    );
  };

  return (
    <Markdown
      className={styles.reactMarkdown}
      remarkPlugins={[remarkMath, [remarkGfm, { singleTilde: false }]]}
      rehypePlugins={[[rehypeKatex, { strict: false }], rehypeRaw]}
      components={{
        code({ node, ...props }) {
          const { children, className } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeSnippet language={match[1]} className={className || ""}>
              {String(children).replace(/\n$/, "")}
            </CodeSnippet>
          ) : (
            <code className={`${styles.inlineCode} ${className || ""}`}>{children}</code>
          );
        },
        img({ node, ...props }) {
          const { src, alt, ...rest } = props;
          return src && <CustomImage src={`/img/${abbrlink}/${src}`} alt={alt || ""} {...rest} />;
        },
        a({ node, children, href, ...props }) {
          if (href)
            return (
              <Link href={href} target="_blank" title={href} {...props}>
                {children}
              </Link>
            );
        },
        h1: (props) => <HeadingRenderer level={1} {...props} />,
        h2: (props) => <HeadingRenderer level={2} {...props} />,
        h3: (props) => <HeadingRenderer level={3} {...props} />,
        h4: (props) => <HeadingRenderer level={4} {...props} />,
        h5: (props) => <HeadingRenderer level={5} {...props} />,
        h6: (props) => <HeadingRenderer level={6} {...props} />,
      }}
    >
      {children}
    </Markdown>
  );
}

const CustomImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const { src, alt, className, ...rest } = props;
  return (
    <>
      <img src={src} alt={alt} className={className} {...rest} />
      {alt && <span>{alt}</span>}
    </>
  );
};

const CodeSnippet = (params: { children: string; language?: string; className?: string }) => {
  const { children, language, className } = params;
  const [copied, setCopied] = useState(false);
  const [codeHeight, setCodeHeight] = useState(0);
  const [extended, setExtented] = useState(false);
  const codeRef = useRef<HTMLDivElement | null>(null);
  const onCopy = () => {
    if (copied) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const onExtend = () => {
    setExtented(!extended);
  };
  useEffect(() => {
    if (codeRef.current) setCodeHeight(codeRef.current.clientHeight);
  }, []);
  return (
    <div className={styles.codeWrapper} style={{ maxHeight: !extended ? SITE_CONFIG.maxCodeHeight : "unset" }}>
      <div className={styles.codeHeader}>
        <span>{language}</span>
        {copied ? (
          <div className={`${styles.copyButton} flexItem`}>
            <CopyIcon />
            已复制！
          </div>
        ) : (
          <CopyToClipboard text={children}>
            <div className={`${styles.copyButton} flexItem`} onClick={onCopy}>
              <ClipBoardIcon />
              复制代码
            </div>
          </CopyToClipboard>
        )}
      </div>

      <SyntaxHighlighter
        PreTag={(props) => <code {...props} ref={codeRef} />}
        language={language}
        style={hybrid}
        showLineNumbers
        className={className}
      >
        {children}
      </SyntaxHighlighter>
      {codeHeight > SITE_CONFIG.maxCodeHeight &&
        (!extended ? (
          <div className={styles.extendWrapper} onClick={onExtend}>
            <ExtendIcon />
          </div>
        ) : (
          <div className={styles.foldWrapper} onClick={onExtend}>
            <ExtendIcon />
          </div>
        ))}
    </div>
  );
};

const ClipBoardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2V5Zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v2ZM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5Z"
    />
  </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 1024 1024" {...props}>
    <path
      fill="currentColor"
      d="m778.24 289.513-369.594 369.57-139.613-139.59a34.91 34.91 0 1 0-49.338 49.339l164.282 164.305a34.77 34.77 0 0 0 49.338 0l394.263-394.286a34.91 34.91 0 1 0-49.338-49.338"
    />
  </svg>
);

const ExtendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 1024 1024" {...props}>
    <path
      fill="currentColor"
      d="M515.04 557.19c-11.54 0-23.02-4.39-31.81-13.18L123.34 184.13c-17.57-17.57-17.57-46.04 0-63.61s46.04-17.57 63.61 0L515.04 448.6l328.08-328.08c17.57-17.57 46.04-17.57 63.61 0s17.57 46.04 0 63.61L546.84 544.01c-8.78 8.79-20.26 13.18-31.8 13.18z"
    />
    <path
      fill="currentColor"
      d="M515.04 917.11c-11.54 0-23.02-4.39-31.81-13.18L123.34 544.04c-17.57-17.57-17.57-46.04 0-63.61s46.04-17.57 63.61 0l328.08 328.08 328.08-328.08c17.57-17.57 46.04-17.57 63.61 0s17.57 46.04 0 63.61L546.84 903.93c-8.78 8.79-20.26 13.18-31.8 13.18z"
    />
  </svg>
);
