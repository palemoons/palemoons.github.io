"use client";

import renderMarkdownAst from "@/lib/markdown/render";
import { Root } from "mdast";

const MarkdownRenderer = ({ imgPrefix = "", children }: { imgPrefix?: string; children: Root }) => {
  return renderMarkdownAst(children, imgPrefix);
};

export default MarkdownRenderer;
