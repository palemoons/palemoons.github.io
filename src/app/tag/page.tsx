import Link from "next/link";
import pinyin from "pinyin";
import { countTags } from "@/lib/posts";
import { ITag } from "@/interfaces/Post";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `文章分类 | ${process.env.TITLE}`,
  description: "Tags of the blog."
};

export default function TagArchive() {
  const tagRecord = sortTagsByAlphabet(countTags());
  const tagList = Object.entries(tagRecord);
  return (
    <div>
      <div className={styles.siteTitle}>文章分类</div>
      {tagList.map((value, index) => {
        const [letter, tags] = value;
        if (tags.length)
          return (
            <div key={index.toString()}>
              <div className={styles.tagLetter}>{letter.toUpperCase()}</div>
              <div className={styles.tagContainer}>
                {tags.map((tag, i) => (
                  <Link href={`/tag/${tag.name}`} className={`${styles.tagLink} flexItem`} key={i.toString()}>
                    # {tag.name} ({tag.count})
                  </Link>
                ))}
              </div>
              {index < tagList.length - 1 && <hr className={styles.tagBorder} />}
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
