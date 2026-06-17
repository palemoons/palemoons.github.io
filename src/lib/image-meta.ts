import fs from "fs";
import path from "path";

type ImageMeta = {
  width: number;
  height: number;
};

type ImageMetaMap = Record<string, ImageMeta>;

const imageMetaPath = path.join(process.cwd(), "public", "imageMeta.json");

let imageMetaCache: ImageMetaMap | null = null;

const readImageMeta = (): ImageMetaMap => {
  if (imageMetaCache) return imageMetaCache;

  try {
    const raw = fs.readFileSync(imageMetaPath, "utf8");
    imageMetaCache = JSON.parse(raw) as ImageMetaMap;
  } catch {
    imageMetaCache = {};
  }

  return imageMetaCache;
};

export const getImageMeta = (src: string): ImageMeta | null => {
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
  return readImageMeta()[normalizedSrc] ?? null;
};

