"use client";
import { useTheme } from "next-themes";
import { SITE_CONFIG } from "@/app/site.config";
import Spinner from "./Spinner";
import styles from "./Comments.module.css";

export default function Comments() {
  const { theme } = useTheme();

  return (
    <section className={styles.comments}>
      <div className={styles.title}>Comments</div>
      <div className={styles.loading}>
        <div className={styles.spinner}>
          <Spinner />
        </div>
        <div
          className={styles.container}
          ref={(element) => {
            if (!element) return;

            const scriptElement = document.createElement("script");
            scriptElement.setAttribute("src", "https://utteranc.es/client.js");
            scriptElement.setAttribute("repo", SITE_CONFIG.commentRepo);
            scriptElement.setAttribute("issue-term", "pathname");
            scriptElement.setAttribute("theme", theme === "light" ? "github-light" : "github-dark");
            scriptElement.setAttribute("crossorigin", "anonymous");
            scriptElement.setAttribute("async", "true");
            element.replaceChildren(scriptElement);
          }}
        />
      </div>
    </section>
  );
}
