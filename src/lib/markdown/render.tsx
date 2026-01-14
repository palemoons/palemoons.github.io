"use client";

import CodeSnippet from "@/components/CodeSnippet";
import { IUpdateBlockNode, IUpdateHintNode } from "@/interfaces/markdown";
import classNames from "classnames";
import katex from "katex";
import "katex/dist/katex.min.css";
import type { PhrasingContent, Root, RootContent } from "mdast";
import path from "path";
import React from "react";
import type { ReactNode } from "react";

import createSlugger from "./slug";
import headingToText from "./text";

type MarkdownNode = RootContent | IUpdateBlockNode | IUpdateHintNode;

const renderMarkdownAst = (root: Root, img_prefix: string): ReactNode => {
  const renderNode = createRenderNode(img_prefix);

  return (
    <article
      className={classNames(
        "text-base leading-8 font-extralight",
        // paragraph
        "[&>p]:my-5",
        // heading
        "[&>h2]:mt-10 [&>h2]:mb-4",
        "[&>h3]:mt-8 [&>h3]:mb-3",
        // list
        "[&>ol]:my-4 [&>ul]:my-4",
        // table
        "[&>pre]:my-6 [&>table]:my-6",
      )}
    >
      {root.children.map((node, index) => (
        <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
      ))}
    </article>
  );
};

const createRenderNode = (img_prefix: string) => {
  const slugger = createSlugger();
  const renderNode = (node: MarkdownNode): ReactNode => {
    switch (node.type) {
      //inline elements
      case "text":
        return node.value;

      case "strong":
        return (
          <strong className="font-semibold text-(--color-page-fg)">{renderPhrasingChildren(node.children)}</strong>
        );

      case "emphasis":
        return <em className="text-(--color-page-fg) italic">{renderPhrasingChildren(node.children)}</em>;

      case "delete":
        return <del className="line-through decoration-(--color-page-fg)">{renderPhrasingChildren(node.children)}</del>;

      case "inlineCode":
        return (
          <code className="font-code mx-0.5 rounded-md bg-(--color-inline-bg) px-1.5 py-0.5 text-sm text-(--color-inline-fg)">
            {node.value}
          </code>
        );

      case "link":
        return (
          <a
            href={node.url}
            title={node.title ?? undefined}
            target="_blank"
            className={classNames(
              "mx-0.5 rounded-sm",
              "underline decoration-(--color-link-underline) decoration-1",
              "hover:decoration-[1.5px]",
            )}
          >
            {renderPhrasingChildren(node.children)}
          </a>
        );

      case "image":
        const finalSrc = path.join("/img", img_prefix, node.url);
        return renderImage(finalSrc, node.alt ?? "");

      case "break":
        return <br />;

      // block elements
      case "paragraph": {
        const hasBlockImage = node.children.some((c) => c.type === "image");
        if (hasBlockImage) return <div>{renderPhrasingChildren(node.children)}</div>;
        else return <p>{renderPhrasingChildren(node.children)}</p>;
      }

      case "heading": {
        const Tag = (`h${node.depth}` as keyof JSX.IntrinsicElements) || "h6";
        const text = headingToText(node);
        const id = slugger(text);
        const headingClass = {
          1: "mt-10 mb-4 scroll-mt-(--layout-navbar-height) text-3xl font-semibold",
          2: "mt-8 mb-3 scroll-mt-(--layout-navbar-height) text-2xl font-semibold",
          3: "mt-8 mb-2 scroll-mt-(--layout-navbar-height) text-xl font-semibold",
          4: "mt-6 mb-2 scroll-mt-(--layout-navbar-height) text-lg font-semibold",
          5: "mt-5 mb-1 scroll-mt-(--layout-navbar-height) text-base font-semibold",
          6: "mt-4 mb-1 scroll-mt-(--layout-navbar-height) text-sm font-semibold",
        } as const;

        return (
          <Tag id={id} className={headingClass[node.depth as 1 | 2 | 3 | 4 | 5 | 6]}>
            {renderPhrasingChildren(node.children)}
          </Tag>
        );
      }

      case "blockquote":
        return (
          <blockquote className="my-6 rounded-sm border-l-4 border-(--color-border-strong) bg-(--color-quote-bg) px-4 py-2 text-(--color-quote-fg)">
            <div className="space-y-2 text-sm leading-6">
              {node.children.map((child, i) => (
                <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
              ))}
            </div>
          </blockquote>
        );

      case "list": {
        const ListTag = (node.ordered ? "ol" : "ul") as keyof JSX.IntrinsicElements;
        const start = node.start ?? undefined;

        const className = classNames(
          "my-4 ml-6 space-y-1.5",
          "marker:text-[var(--color-text-muted)]",
          node.ordered ? "list-decimal" : "list-disc",
        );

        return (
          <ListTag start={start} className={className}>
            {node.children.map((item, i) => (
              <React.Fragment key={i}>{renderNode(item)}</React.Fragment>
            ))}
          </ListTag>
        );
      }

      case "listItem": {
        const hasCheckbox = typeof node.checked === "boolean";

        if (hasCheckbox)
          return (
            <li className="-ml-6 flex list-none items-center gap-2 leading-7">
              <input
                type="checkbox"
                checked={Boolean(node.checked)}
                readOnly
                className="h-4 w-4 rounded-sm accent-(--color-text-muted)"
              />
              <div>
                {node.children.map((child, i) => (
                  <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
                ))}
              </div>
            </li>
          );
        else
          return (
            <li className="leading-7">
              {node.children.map((child, i) => (
                <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
              ))}
            </li>
          );
      }

      case "code": {
        const language = node.lang && typeof node.lang === "string" ? node.lang : undefined;

        return <CodeSnippet language={language}>{node.value}</CodeSnippet>;
      }

      case "thematicBreak":
        return <hr />;

      case "html": {
        const raw = node.value.trim();
        // <table>
        if (/^<table\b/i.test(raw))
          return (
            <div
              className={classNames(
                "my-6 overflow-x-auto",
                "[&_table]:w-full",
                "[&_table]:border-collapse",
                "[&_table]:text-sm",
                "[&_td]:border [&_th]:border",
                "[&_th]:border-(--color-surface-border)",
                "[&_td]:border-(--color-surface-border)",
                "[&_td]:px-3 [&_th]:px-3",
                "[&_td]:py-2 [&_th]:py-2",
                "[&_td]:align-top [&_th]:align-top",
                "[&_th]:bg-(--color-surface-bg)",
                "[&_th]:font-semibold",
                "[&_thead_th]:border-b-2",
              )}
              dangerouslySetInnerHTML={{ __html: raw }}
            />
          );
        // <img>
        if (/^<img\b/i.test(raw)) {
          const srcMatch = raw.match(/src=["']([^"']+)["']/i);
          const altMatch = raw.match(/alt=["']([^"']*)["']/i);

          const src = srcMatch?.[1];
          if (!src) return null;

          const finalSrc = path.join("/img", img_prefix, src);
          return renderImage(finalSrc, altMatch?.[1]);
        }
        return null;
      }

      // remark-gfm
      case "table": {
        const [headerRow, ...bodyRows] = node.children;
        const alignList = node.align ?? null;
        const alignClass = {
          left: "text-left",
          center: "text-center",
          right: "text-right",
        };

        return (
          <table className="my-6 w-full border-collapse overflow-x-auto text-sm">
            {headerRow && (
              <thead>
                <tr>
                  {headerRow.children.map((cell, i) => (
                    <th
                      key={i}
                      className={classNames(
                        "px-3 py-2 text-center align-middle font-semibold",
                        "border border-(--color-surface-border)",
                        "bg-(--color-surface-bg)",
                      )}
                    >
                      {cell.children.map((child, j) => (
                        <React.Fragment key={j}>{renderNode(child)}</React.Fragment>
                      ))}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            {bodyRows.length > 0 && (
              <tbody>
                {bodyRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.children.map((cell, i) => (
                      <td
                        key={i}
                        className={classNames(
                          "px-3 py-2 align-middle",
                          "border border-(--color-surface-border)",
                          "tabular-nums",
                          alignList && alignClass[alignList[i] as "left" | "center" | "right"],
                        )}
                      >
                        {cell.children.map((child, j) => (
                          <React.Fragment key={j}>{renderNode(child)}</React.Fragment>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        );
      }

      case "tableRow":
        return (
          <tr>
            {node.children.map((cell, i) => (
              <React.Fragment key={i}>{renderNode(cell)}</React.Fragment>
            ))}
          </tr>
        );

      case "tableCell":
        return (
          <td>
            {node.children.map((child, i) => (
              <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
            ))}
          </td>
        );

      // remark-math
      case "inlineMath": {
        const html = katex.renderToString(node.value, {
          displayMode: false,
          throwOnError: false,
        });
        return <span dangerouslySetInnerHTML={{ __html: html }} />;
      }

      case "math": {
        const html = katex.renderToString(node.value, {
          displayMode: true,
          throwOnError: false,
        });
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      }

      // directive update
      case "updateBlock":
        return (
          <div className="my-6 rounded-lg border border-(--color-surface-border) bg-(--color-surface-bg) py-3">
            <div className="mb-2 flex items-center gap-2 px-4 text-xs text-(--color-accent-update)">
              <span>更新于 {node.data?.dateText ?? "未知时间"}</span>
            </div>
            <div className="mb-3 h-px bg-(--color-surface-border) opacity-60" />
            <div className="space-y-2 px-4 text-sm leading-7">
              {node.children.map((child, i) => (
                <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPhrasingChildren = (children: PhrasingContent[]): ReactNode => {
    return children.map((child, index) => <React.Fragment key={index}>{renderNode(child)}</React.Fragment>);
  };

  const renderImage = (src: string, alt?: string): ReactNode => {
    return (
      <figure className="my-6">
        <img
          src={src}
          alt={alt ?? ""}
          className="mx-auto max-w-full rounded-lg border border-(--color-surface-border)"
          loading="lazy"
        />
        {alt && <figcaption className="mt-2 text-center text-sm opacity-70">{alt}</figcaption>}
      </figure>
    );
  };

  return renderNode;
};

export default renderMarkdownAst;
