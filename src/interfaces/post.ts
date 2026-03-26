type BasePost = {
  fname: string; // Filename, without ".md"
  title: string;
  date: string;
  category: string;
  tags?: string[];
  description: string;
  updated?: string;
  abbrlink?: string;
};

type IPostHeader = BasePost;

interface IPost extends BasePost {
  content: string;
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
  number: string;
}

export type { IPost, IPostHeader, ITag, Itoc };
