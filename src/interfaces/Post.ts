interface IPost {
  fname: string; // Filename, without ".md"
  category: string;
  title: string;
  date: string;
  updated?: string;
  tags?: Array<string>;
  abbrlink?: string;
  description: string;
  content: string;
}

interface IPostHeader {
  fname: string;
  title: string;
  date: string;
  category: string;
  tags: Array<string>;
  description: string;
}

interface ITag {
  name: string;
  count: number;
}

interface Itoc {
  content: string;
  slug: string;
  lvl: number;
  i: number;
  seen: number;
  number?: string;
}

export type { IPost, IPostHeader, ITag, Itoc };
