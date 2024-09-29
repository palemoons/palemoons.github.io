import Link from "next/link";
import styles from "./Footer.module.css";
import { SITE_CONFIG } from "@/app/site.config";

const Footer = () => {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || "未知";

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContainer}>
          <span>
            Built on{" "}
            <Link href="https://nextjs.org/" target="_blank">
              NextJS
            </Link>
          </span>
          <span className={styles.dot}> · </span>
          <span>
            Powered by{" "}
            <Link href={SITE_CONFIG.siteRepo} target="_blank">
              Github
            </Link>
          </span>
        </div>
        <div className={styles.footerContainer}>
          <span>© 2020-{new Date().getFullYear()} by Palemoons</span>
          <span className={styles.dot}> · </span>
          <span>Deployed on {buildTime}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
