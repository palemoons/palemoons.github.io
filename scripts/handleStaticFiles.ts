import { IPostHeader } from "@/interfaces/post";
import { loadEnvConfig } from "@next/env";
import fs from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";
import path from "path";

loadEnvConfig(process.cwd());
const rawPostsDir = process.env.POSTS_DIR;
if (!rawPostsDir) throw new Error("POSTS_DIR is not defined in environment variables");
const postsDir = path.resolve(process.cwd(), rawPostsDir);

const publicImgDir = path.join(process.cwd(), "public", "img");
const nonPostDirs = ["about", "scripts", ".git"];

const ONLY_STRING_SCHEMA = new yaml.Schema({
  explicit: [
    new yaml.Type("tag:yaml.org,2002:str", {
      kind: "scalar",
      resolve: () => true,
      construct: (data) => (data != null ? data.toString() : ""),
    }),
  ],
});

const customMatter = (content: string) =>
  matter(content, {
    engines: {
      yaml: (str: string) => yaml.load(str, { schema: ONLY_STRING_SCHEMA }) as Record<string, any>,
    },
  });

if (!fs.existsSync(publicImgDir)) fs.mkdirSync(publicImgDir, { recursive: true });

const postIndex: Map<string, IPostHeader> = new Map();
const categories = fs
  .readdirSync(postsDir)
  .filter((category) => fs.lstatSync(path.join(postsDir, category)).isDirectory() && !nonPostDirs.includes(category));
categories.forEach((category) => {
  const postYearFolders = fs.readdirSync(path.join(postsDir, category));
  postYearFolders.forEach((yearFolder) => {
    const postFolder = path.join(postsDir, category, yearFolder);
    const posts = fs.readdirSync(postFolder).filter((f) => !f.startsWith("."));
    posts.forEach((post) => {
      const fullPath = path.join(postFolder, post, `${post}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      // Use gray-matter to parse the post metadata section
      const { data: frontMatter } = customMatter(fileContents);

      const postInfo: IPostHeader = {
        title: frontMatter.title,
        category: category,
        date: frontMatter.date,
        fname: post,
        description: frontMatter.description || "",
        tags: frontMatter.tags?.split(",").map((value: string) => value.trim()) || [],
      };
      postIndex.set(frontMatter.abbrlink, postInfo);

      const files = fs.readdirSync(path.join(postFolder, post));
      files.forEach((file) => {
        const ext = path.extname(file);
        if ([".jpg", ".png", ".jpeg", ".webp", ".gif"].includes(ext)) {
          const postImgDir = path.join(publicImgDir, frontMatter.abbrlink);
          if (!fs.existsSync(postImgDir)) fs.mkdirSync(postImgDir);
          const originalFilePath = path.join(postFolder, post, file);
          const destinationPath = path.join(postImgDir, file);
          fs.copyFileSync(originalFilePath, destinationPath);
        }
      });
    });
  });
});
fs.writeFileSync(path.join(process.cwd(), "public/postIndex.json"), JSON.stringify(Object.fromEntries(postIndex)));
