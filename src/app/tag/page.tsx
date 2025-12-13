import Link from "next/link";
import pinyin from "pinyin";
import { countTags } from "@/lib/posts";
import { ITag } from "@/interfaces/post";
import classNames from "classnames";
import { Metadata } from "next";
import { SITE_CONFIG } from "../site.config";

export const metadata: Metadata = {
  title: `文章分类 | ${SITE_CONFIG.title}`,
  description: "Tags of the blog.",
};

export default function TagArchive() {
  const tagRecord = sortTagsByAlphabet(countTags());
  const tagList = Object.entries(tagRecord);
  return (
    <div className="container">
      <div className="mt-12 mb-6 text-[40px] font-semibold">文章分类</div>
      {tagList.map((value, index) => {
        const [letter, tags] = value;
        if (tags.length)
          return (
            <div key={index.toString()}>
              <div className="text-[32px] font-semibold">{letter.toUpperCase()}</div>
              <div className="mt-2 pb-1">
                {tags.map((tag, i) => (
                  <Link
                    href={`/tag/${tag.name}`}
                    className={classNames(
                      "flexItem mr-[6px] mb-1 rounded-[2px] bg-[color:var(--color-inline-bg)] px-[6px] py-[3px] text-sm leading-[18px] text-[color:var(--color-inline-fg)] no-underline",
                    )}
                    key={i.toString()}
                  >
                    # {tag.name} ({tag.count})
                  </Link>
                ))}
              </div>
              {index < tagList.length - 1 && (
                <hr className="mt-0 mb-4 border-none border-b border-b-[color:var(--color-quote-fg)]" />
              )}
            </div>
          );
        else return null;
      })}
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
