"use client";

import { renderMarkdownAst } from "@/lib/markdown/renderMarkdownAst";
import { Root } from "mdast";

export function MarkdownRenderer({ abbrlink, children }: { abbrlink?: string; children: Root }) {
  return renderMarkdownAst(children, abbrlink ?? "");
}
