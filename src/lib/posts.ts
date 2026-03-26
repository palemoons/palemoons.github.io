import { IPost, IPostHeader, ITag } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";
import path from "path";

const rawPostsDir = process.env.POSTS_DIR;
if (!rawPostsDir) throw new Error("POSTS_DIR is not defined in environment variables");

const postsDir = path.resolve(process.cwd(), rawPostsDir);
const publicDir = path.join(process.cwd(), "public");
const postIndexPath = path.join(publicDir, "postIndex.json");

// cache postIndex

let cachedPostIndex: Record<string, IPostHeader> | null = null;

async function loadPostIndex(): Promise<Record<string, IPostHeader>> {
  // use cache
  if (cachedPostIndex) return cachedPostIndex;
  const raw = await fs.promises.readFile(postIndexPath, "utf-8");
  const parsed = JSON.parse(raw);
  cachedPostIndex = parsed;
  return parsed;
}

export async function getSortedPosts() {
  const postIndex = await loadPostIndex();
  return Object.entries(postIndex)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => (a.value.date < b.value.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<IPost | null> {
  const postIndex = await loadPostIndex();

  const realSlug = postIndex[slug];
  if (!realSlug) return null;

  const year = new Date(realSlug.date).getFullYear();
  const fullPath = path.join(postsDir, realSlug.category, year.toString(), realSlug.fname, `${realSlug.fname}.md`);

  const fileContents = await fs.promises.readFile(fullPath, "utf8");

  const { data, content } = customMatter(fileContents);
  const { tags, ...rest } = data;

  return {
    tags: tags?.split(",").map((v: string) => v.trim()),
    category: realSlug.category,
    fname: realSlug.fname,
    ...rest,
    content,
  } as IPost;
}

export async function getPostsByCategory(category: string) {
  const postIndex = await loadPostIndex();

  return Object.entries(postIndex)
    .filter(([_, post]) => post.category === category)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => (a.value.date < b.value.date ? 1 : -1));
}

export async function getPostsByTag(tag: string) {
  const postIndex = await loadPostIndex();

  return Object.entries(postIndex)
    .filter(([_, post]) => post.tags?.includes(tag))
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => (a.value.date < b.value.date ? 1 : -1));
}

export async function countTags(): Promise<ITag[]> {
  const postIndex = await loadPostIndex();

  const tagCount: Record<string, number> = {};

  Object.values(postIndex).forEach((post) => {
    post.tags?.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount).map(([name, count]) => ({
    name,
    count,
  }));
}

// Get About content
export async function getAboutPost(): Promise<IPost | null> {
  const fpath = path.join(postsDir, "about", "about.md");

  try {
    const post = await fs.promises.readFile(fpath, "utf-8");
    const { data, content } = customMatter(post);

    return {
      fname: "about",
      category: "about",
      ...data,
      content,
    } as IPost;
  } catch {
    return null;
  }
}

const customMatter = (content: string) =>
  matter(content, {
    engines: {
      yaml: (str: string) => yaml.load(str, { schema: yaml.JSON_SCHEMA }) as object,
    },
  });
