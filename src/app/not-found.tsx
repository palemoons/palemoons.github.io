"use client";

import { SITE_CONFIG } from "./site.config";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={`${styles.notfound} container`}>
      <title>{`404 | ${SITE_CONFIG.title}`}</title>
      <div className={styles.title}>Oops!</div>
      <div>This page could not be found.</div>
    </div>
  );
}
