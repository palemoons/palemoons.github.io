import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { IPostHeader } from "@/interfaces/Post";

const postsDir = path.join(process.cwd(), "_posts");
const publicImgDir = path.join(process.cwd(), "public", "img");
const nonPostDirs = ["about", "scripts"];

const customMatter = (content: string) =>
  matter(content, {
    engines: {
      yaml: (str: string) => yaml.load(str, { schema: yaml.JSON_SCHEMA }) as object,
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
    const posts = fs.readdirSync(postFolder);
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
