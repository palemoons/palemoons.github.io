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
}

interface ITag {
  name: string;
  count: number;
}

export type { IPost, IPostHeader, ITag };
