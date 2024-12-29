import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import matter from "gray-matter";
import { IPost, IPostHeader, ITag } from "@/interfaces/Post";

const postsDir = path.join(process.cwd(), "_posts");
const publicDir = path.join(process.cwd(), "public");
const postIndexPath = path.join(publicDir, "postIndex.json");

export const getSortedPosts = () => {
  const posts = Object.entries(JSON.parse(fs.readFileSync(postIndexPath, "utf-8"))) as Array<[string, IPostHeader]>;
  return posts
    .map((value) => ({ key: value[0], value: value[1] }))
    .sort((a, b) => (a.value.date < b.value.date ? 1 : -1));
};

export const getPostBySlug = (slug: string) => {
  const abbrlinkMap = new Map(Object.entries(JSON.parse(fs.readFileSync(postIndexPath, "utf-8")))) as Map<
    string,
    IPostHeader
  >;
  const realSlug = abbrlinkMap.get(slug);
  if (!realSlug) return null;
  const year = new Date(realSlug.date).getFullYear();
  const fullPath = path.join(postsDir, realSlug.category, year.toString(), realSlug.fname, `${realSlug.fname}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const { tags, ...rest } = data;
  const frontMatter = {
    tags: tags?.split(",").map((value: string) => value.trim()),
    category: realSlug.category,
    fname: realSlug.fname,
    ...rest,
  };

  return { ...frontMatter, content } as IPost;
};

export const getPostsByCategory = (category: string) => {
  const postArray = Object.entries(JSON.parse(fs.readFileSync(postIndexPath, "utf-8"))) as Array<[string, IPostHeader]>;
  const posts = postArray.filter((value) => {
    const postInfo = value[1];
    return postInfo.category === category;
  });
  return posts
    .map((value) => ({ key: value[0], value: value[1] }))
    .sort((a, b) => (a.value.date < b.value.date ? 1 : -1));
};

export const getPostsByTag = (tag: string) => {
  const postIndexArray = Object.entries(JSON.parse(fs.readFileSync(postIndexPath, "utf-8"))) as Array<
    [string, IPostHeader]
  >;
  const posts = postIndexArray.filter((value) => {
    const postInfo = value[1] as IPostHeader;
    return postInfo.tags.includes(tag);
  });
  return posts
    .map((value) => ({ key: value[0], value: value[1] }))
    .sort((a, b) => (a.value.date < b.value.date ? 1 : -1));
};

export const countTags = () => {
  const postIndex = new Map(
    Object.entries(JSON.parse(fs.readFileSync(postIndexPath, "utf-8"))) as Array<[string, IPostHeader]>,
  );
  const tagCount: Record<string, number> = {};

  for (let postInfo of postIndex.values()) {
    const tags = postInfo.tags;
    tags?.forEach((tag) => {
      if (tag in tagCount) tagCount[tag] += 1;
      else tagCount[tag] = 1;
    });
  }

  const tags: Array<ITag> = Object.entries(tagCount).map(([name, count]) => ({
    name,
    count,
  }));
  return tags;
};

// Get About content
export const getAboutPost = () => {
  const fpath = path.join(postsDir, "about", "about.md");

  if (!fs.existsSync(fpath)) return null;

  const post = fs.readFileSync(fpath, "utf-8");
  const { data, content } = customMatter(post);

  return {
    fname: "about",
    category: "about",
    ...data,
    content,
  } as IPost;
};

const customMatter = (content: string) =>
  matter(content, {
    engines: {
      yaml: (str: string) => yaml.load(str, { schema: yaml.JSON_SCHEMA }) as object,
    },
  });
