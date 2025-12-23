import type { Heading, PhrasingContent } from "mdast";

const headingToText = (node: Heading): string => {
  const parts: string[] = [];
  const walk = (children: readonly PhrasingContent[]) => {
    for (const c of children) {
      if (c.type === "text") parts.push(c.value);
      else if (c.type === "inlineCode") parts.push(c.value);
      else if ("children" in c && Array.isArray((c as any).children)) {
        walk((c as any).children);
      }
    }
  };
  walk(node.children as readonly PhrasingContent[]);
  return parts.join("").replace(/\s+/g, " ").trim();
};

export default headingToText;
