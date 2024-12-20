"use client";
import { Metadata } from "next";
import { SITE_CONFIG } from "./site.config";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={`${styles.notfound} container`}>
      <div className={styles.title}>Oops!</div>
      <div>This page could not be found.</div>
    </div>
  );
}

export const metadata: Metadata = {
  title: `404 | ${SITE_CONFIG.title}`,
  description: "404 | Not Found",
};
