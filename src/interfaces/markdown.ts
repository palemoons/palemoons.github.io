import { Parent } from "mdast";

export interface IUpdateBlockNode extends Parent {
  type: "updateBlock";
  data?: {
    dateRaw?: string;
    dateText: string;
    [key: string]: unknown;
  };
}

export interface IUpdateHintNode extends Parent {
  type: "updateHint";
  data?: {
    dateRaw?: string;
    dateText: string;
    [key: string]: unknown;
  };
}
