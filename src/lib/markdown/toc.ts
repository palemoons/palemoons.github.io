import { Itoc } from "@/interfaces/post";
import { Root } from "mdast";
import { visit } from "unist-util-visit";

import createSlugger from "./slug";
import { headingToText } from "./text";

const extractToc = (ast: Root): Array<Itoc> => {
  const toc: Itoc[] = [];
  const slugger = createSlugger();
  visit(ast, "heading", (node) => {
    const content = headingToText(node);
    if (!content) return;

    const slug = slugger(content);

    toc.push({
      content,
      slug,
      lvl: node.depth,
      i: toc.length,
      seen: 0,
    });
  });
  return addTocNumbers(handleTocHeader(toc));
};

const handleTocHeader = (tocContent: Array<Itoc>): Array<Itoc> => {
  const minLvl = Math.min(...tocContent.map((header) => header.lvl));
  return tocContent.map((header) => {
    const { lvl, ...rest } = header;
    return {
      lvl: lvl - minLvl,
      ...rest,
    };
  });
};

const addTocNumbers = (toc: Array<Itoc>): Array<Itoc> => {
  const counters = Array(6).fill(0); // lvl 1..6 -> idx 0..5

  return toc.map((item) => {
    counters[item.lvl] += 1;
    counters.fill(0, item.lvl + 1);

    const parts = counters.slice(0, item.lvl + 1).filter((n) => n > 0);
    return { ...item, number: parts.join(".") };
  });
};

export default extractToc;
