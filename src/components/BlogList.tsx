import Link from "next/link";
import styles from "./BlogList.module.css";
import { IPostHeader } from "@/interfaces/Post";

const BlogList = ({ posts, size = -1 }: { posts: Array<{ key: string; value: IPostHeader }>; size?: number }) => {
  const postsData = size > 0 ? posts.slice(0, size) : posts;
  return (
    <div>
      {postsData.map((post, index) => {
        const { key: abbrlink, value: postInfo } = post;
        const { title, category, date } = postInfo;
        return (
          <div key={index.toString()} className={styles.listItem}>
            <Link href={`/${category}/${abbrlink}`} className={styles.href}>
              {title}
            </Link>
            <Link href={`/${category}/${abbrlink}`} className={`${styles.href} ${styles.date}`}>
              {date}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;
