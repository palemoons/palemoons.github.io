import { ITag } from "@/interfaces/post";
import { countTags } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import pinyin from "pinyin";

import { SITE_CONFIG } from "../site.config";

export const metadata: Metadata = {
  title: `文章分类 | ${SITE_CONFIG.title}`,
  description: "Tags of the blog.",
};

export default function TagArchive() {
  const tagRecord = sortTagsByAlphabet(countTags());
  const tagList = Object.entries(tagRecord);
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mt-12 mb-6 text-4xl font-semibold">文章分类</div>
      <div className="flex flex-wrap gap-x-4 gap-y-3">
        {tagList.map((value) => {
          const [_, tags] = value;
          if (!tags.length) return null;
          return tags.map((tag, i) => (
            <Link
              href={`/tag/${tag.name}`}
              className="rounded-xs bg-(--color-tag-bg) px-2 py-0.5 text-xs leading-4 text-(--color-tag-fg) no-underline"
              key={i.toString()}
            >
              # {tag.name} ({tag.count})
            </Link>
          ));
        })}
      </div>
    </div>
  );
}

const sortTagsByAlphabet = (tagList: Array<ITag>) => {
  const sortedTags: Record<string, Array<ITag>> = {};

  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    sortedTags[letter] = [];
  }
  sortedTags["#"] = [];

  tagList.forEach((tag) => {
    const firstChar = tag.name[0];
    const pinyinChar = pinyin(firstChar, { style: 4 })[0][0].toLowerCase();
    if (pinyinChar >= "a" && pinyinChar <= "z") sortedTags[pinyinChar].push(tag);
    else sortedTags["#"].push(tag);
  });

  Object.keys(sortedTags).forEach((letter) => {
    sortedTags[letter].sort((a, b) => a.name.localeCompare(b.name));
  });

  return sortedTags;
};
