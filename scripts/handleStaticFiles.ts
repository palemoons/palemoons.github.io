import { IPostHeader } from "@/interfaces/post";
import { isDraftPost } from "@/lib/draft";
import { getPostsDir } from "@/lib/env.server";
import fs from "fs";
import matter from "gray-matter";
import { imageSize } from "image-size";
import yaml from "js-yaml";
import path from "path";

const postsDir = path.resolve(process.cwd(), getPostsDir());

const publicImgDir = path.join(process.cwd(), "public", "img");
const imageMetaPath = path.join(process.cwd(), "public", "imageMeta.json");
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
      if (isDraftPost(frontMatter.draft)) return;

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
          if (!fs.existsSync(postImgDir)) fs.mkdirSync(postImgDir, { recursive: true });
          const originalFilePath = path.join(postFolder, post, file);
          const destinationPath = path.join(postImgDir, file);
          fs.copyFileSync(originalFilePath, destinationPath);
        }
      });
    });
  });
});
fs.writeFileSync(path.join(process.cwd(), "public/postIndex.json"), JSON.stringify(Object.fromEntries(postIndex)));
const imageMeta: Record<string, { width: number; height: number }> = {};
const imageFiles = fs.readdirSync(publicImgDir, { recursive: true }).filter((entry) => {
  const fullPath = path.join(publicImgDir, entry.toString());
  return fs.lstatSync(fullPath).isFile() && [".jpg", ".png", ".jpeg", ".webp", ".gif"].includes(path.extname(fullPath));
});

imageFiles.forEach((entry) => {
  const filePath = path.join(publicImgDir, entry.toString());
  const dimensions = imageSize(fs.readFileSync(filePath));

  if (dimensions.width && dimensions.height) {
    imageMeta[path.posix.join("/img", entry.toString().split(path.sep).join(path.posix.sep))] = {
      width: dimensions.width,
      height: dimensions.height,
    };
  }
});

fs.writeFileSync(imageMetaPath, JSON.stringify(imageMeta, null, 2));
