import { Root } from "mdast";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

import remarkDirectiveUpdate from "./remarkDirectiveUpdate";

export function compileMarkdown(source: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkDirectiveUpdate);

  const tree = processor.parse(source);
  const ast = processor.runSync(tree) as Root;

  return ast;
}
