"use client";

import { IUpdateBlockNode, IUpdateHintNode } from "@/interfaces/markdown";
import type { PhrasingContent, Root, RootContent, Table } from "mdast";
import path from "path";
import React from "react";
import type { ReactNode } from "react";

type MarkdownNode = RootContent | IUpdateBlockNode | IUpdateHintNode;

export function renderMarkdownAst(root: Root, abbrlink: string): ReactNode {
  const renderNode = createRenderNode(abbrlink);

  return (
    <>
      {root.children.map((node, index) => (
        <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
      ))}
    </>
  );
}

const createRenderNode = (abbrlink: string) => {
  const renderNode = (node: MarkdownNode): ReactNode => {
    switch (node.type) {
      //inline elements
      case "text":
        return node.value;

      case "strong":
        return <strong>{renderPhrasingChildren(node.children)}</strong>;

      case "emphasis":
        return <em>{renderPhrasingChildren(node.children)}</em>;

      case "delete":
        return <del>{renderPhrasingChildren(node.children)}</del>;

      case "inlineCode":
        return <code>{node.value}</code>;

      case "link":
        return (
          <a href={node.url} title={node.title ?? undefined} about="_blank">
            {renderPhrasingChildren(node.children)}
          </a>
        );

      case "image":
        const finalSrc = path.join("/img", abbrlink, node.url);
        return (
          <>
            <img src={finalSrc} alt={node.alt ?? ""} />
            {node.alt && <span>{node.alt}</span>}
          </>
        );

      case "break":
        return <br />;

      // block elements
      case "paragraph":
        return <p>{renderPhrasingChildren(node.children)}</p>;

      case "heading": {
        const Tag = (`h${node.depth}` as keyof JSX.IntrinsicElements) || "h6";
        return <Tag>{renderPhrasingChildren(node.children)}</Tag>;
      }

      case "blockquote":
        return (
          <blockquote>
            {node.children.map((child, i) => (
              <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
            ))}
          </blockquote>
        );

      case "list": {
        const ListTag = node.ordered ? "ol" : "ul";
        const start = node.start ?? undefined;
        return (
          <ListTag start={start}>
            {node.children.map((item, i) => (
              <React.Fragment key={i}>{renderNode(item)}</React.Fragment>
            ))}
          </ListTag>
        );
      }

      case "listItem": {
        const hasCheckbox = typeof node.checked === "boolean";
        return (
          <li>
            {hasCheckbox && (
              <input type="checkbox" checked={Boolean(node.checked)} readOnly style={{ marginRight: "0.5em" }} />
            )}
            {node.children.map((child, i) => (
              <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
            ))}
          </li>
        );
      }

      case "code":
        return (
          <pre>
            <code className={node.lang ? `language-${node.lang}` : undefined}>{node.value}</code>
          </pre>
        );

      case "thematicBreak":
        return <hr />;

      // remark-gfm
      case "table":
        return renderTable(node);

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

      // directive update
      case "updateBlock": {
        return (
          <div>
            <div>更新于：{node.data?.dateText ?? "未知时间"}</div>
            <div>
              {node.children.map((child, i) => (
                <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
              ))}
            </div>
          </div>
        );
      }

      case "updateHint": {
        return (
          <div>
            <span>NEW</span>
            本节内容添加于 {node.data?.dateText ?? "未知时间"}
          </div>
        );
      }

      default:
        return null;
    }
  };

  const renderPhrasingChildren = (children: PhrasingContent[]): ReactNode => {
    return children.map((child, index) => <React.Fragment key={index}>{renderNode(child)}</React.Fragment>);
  };

  const renderTable = (node: Table): ReactNode => {
    const [headerRow, ...bodyRows] = node.children;

    return (
      <table>
        {headerRow && (
          <thead>
            <tr>
              {headerRow.children.map((cell, i) => (
                <th key={i}>
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
                {row.children.map((cell, cellIndex) => (
                  <td key={cellIndex}>
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
  };

  return renderNode;
};
