import { IUpdateBlockNode, IUpdateHintNode } from "@/interfaces/markdown";
import type { Parent, Root } from "mdast";
import { visit } from "unist-util-visit";

type DirectiveNode = Parent & {
  type: "containerDirective" | "leafDirective" | "textDirective";
  name?: string;
  attributes?: Record<string, unknown>;
};

// Custom plugin for handling directive
export default function remarkDirectiveUpdate() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      const dir = node as DirectiveNode;
      if (!parent || index == null) return;

      if (dir.name === "update") {
        const rawDate = (dir.attributes?.date as string | undefined) ?? undefined;
        let dateText = "未知时间";
        if (rawDate) {
          const date = new Date(rawDate);
          if (!Number.isNaN(date.getTime())) {
            dateText = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
          }
        }

        if (dir.type === "containerDirective") {
          const updateBlockNode: IUpdateBlockNode = {
            type: "updateBlock",
            children: dir.children ?? [],
            data: {
              ...(dir.attributes || {}),
              dateRaw: rawDate,
              dateText,
            },
          };
          (parent.children as any[])[index] = updateBlockNode;
        }
      }
    });
  };
}
