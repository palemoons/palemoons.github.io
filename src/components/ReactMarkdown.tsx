"use client";

import { useState, SVGProps, ImgHTMLAttributes } from "react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import CopyToClipboard from "react-copy-to-clipboard";
import SyntaxHighlighter from "react-syntax-highlighter";
import hybrid from "react-syntax-highlighter/dist/esm/styles/hljs/hybrid";
import "katex/dist/katex.min.css";
import path from "path";
import { encodeImgName } from "@/lib/images";
import { IPostHeader } from "@/interfaces/Post";
import styles from "./ReactMarkdown.module.css";
import Link from "next/link";

export default function ReactMarkdown({ frontMatter, children }: { frontMatter: IPostHeader; children: string }) {
  const { fname, category, date } = frontMatter;
  const imgPath = path.join(category, new Date(date).getFullYear().toString(), fname);
  return (
    <Markdown
      className={styles.reactMarkdown}
      remarkPlugins={[remarkMath, [remarkGfm, { singleTilde: false }]]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
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
          return (
            src && (
              <CustomImage
                src={`/img/${encodeImgName(imgPath, path.basename(src))}${path.extname(src)}`}
                alt={alt || ""}
                {...rest}
              />
            )
          );
        },
        a({ node, children, href, ...props }) {
          if (href)
            return (
              <Link href={href} target="_blank" title={href} {...props}>
                {children}
              </Link>
            );
        },
      }}
    >
      {children}
    </Markdown>
  );
}

const CustomImage = (props: ImgHTMLAttributes<HTMLImageElement>) => {

  return (
    <>
      <img src={props.src} alt={props.alt} {...props} />
      {props.alt && <span>{props.alt}</span>}
    </>
  );
};

const CodeSnippet = (params: { children: string; language?: string; className?: string }) => {
  const { children, language, className } = params;
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (copied) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <>
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

      <SyntaxHighlighter PreTag="code" language={language} style={hybrid} showLineNumbers className={className}>
        {children}
      </SyntaxHighlighter>
    </>
  );
};

const ClipBoardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2V5Zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v2ZM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5Z"
    />
  </svg>
);

const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 1024 1024" {...props}>
    <path
      fill="currentColor"
      d="m778.24 289.513-369.594 369.57-139.613-139.59a34.91 34.91 0 1 0-49.338 49.339l164.282 164.305a34.77 34.77 0 0 0 49.338 0l394.263-394.286a34.91 34.91 0 1 0-49.338-49.338"
    />
  </svg>
);
