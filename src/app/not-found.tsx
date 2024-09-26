"use client";
import { Metadata } from "next";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notfound}>
      <div className={styles.title}>Oops!</div>
      <div>This page could not be found.</div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "404 | Palemoons' Archive",
  description: "404 | Not Found",
};
