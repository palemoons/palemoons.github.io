import { Itoc } from "@/interfaces/post";
import { Heading, PhrasingContent, Root } from "mdast";
import { visit } from "unist-util-visit";

const extractToc = (ast: Root): Array<Itoc> => {
  const toc: Itoc[] = [];
  const seenMap = new Map<string, number>();

  visit(ast, "heading", (node) => {
    const heading = node;

    const content = headingToText(heading);
    if (!content) return;

    const lvl = heading.depth; // 1~6

    const base = slugify(content) || "section";
    const prev = seenMap.get(base) ?? 0;
    const seen = prev + 1;
    seenMap.set(base, seen);

    const slug = seen === 1 ? base : `${base}-${seen}`;

    toc.push({
      content,
      slug,
      lvl,
      i: toc.length,
      seen,
    });
  });
  return toc;
};

function headingToText(node: Heading): string {
  const parts: string[] = [];

  const walk = (children: readonly PhrasingContent[]) => {
    children.forEach((c) => {
      if (c.type === "text" || c.type === "inlineCode") parts.push(c.value);
      else if ("children" in c && Array.isArray((c as any).children)) {
        walk((c as any).children);
      }
    });
  };
  walk(node.children as readonly PhrasingContent[]);
  return parts.join("").replace(/\s+/g, " ").trim();
}

function slugify(raw: string): string {
  return (
    raw
      .toLowerCase()
      .trim()
      // replace space with "-"
      .replace(/\s+/g, "-")
      // remove separator and punctuation
      .replace(/[~`!@#$%^&*()+=[\]{}\\|;:'",.<>/?]+/g, "")
      // combine continuous "-"
      .replace(/-+/g, "-")
      // remove "-" on both sides
      .replace(/^-|-$/g, "")
  );
}

export default extractToc;