"use client";

import { compileMarkdown } from "@/lib/markdown/compileMarkdown";
import { renderMarkdownAst } from "@/lib/markdown/renderMarkdownAst";

export function MarkdownRenderer({ abbrlink, children }: { abbrlink: string; children: string }) {
  const ast = compileMarkdown(children);
  return renderMarkdownAst(ast, abbrlink);
}
