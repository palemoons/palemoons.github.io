"use client";

import { renderMarkdownAst } from "@/lib/markdown/render";
import { Root } from "mdast";

export function MarkdownRenderer({ abbrlink, children }: { abbrlink?: string; children: Root }) {
  return renderMarkdownAst(children, abbrlink ?? "");
}
