"use client";

import { ThemeProvider } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SVGProps, useEffect, useState, useRef } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import classNames from "classnames";
import icoPath from "@/app/favicon.ico";
import { SITE_CONFIG } from "@/app/site.config";
import styles from "./layout.module.css";
import "./global.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system">
          <Navbar />
          <main className="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-2B1J5RE75M" />
    </html>
  );
};

const Navbar = () => {
  const navItems = SITE_CONFIG.categories.concat(SITE_CONFIG.subpages);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const onToggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const onClickOutside = (event: MouseEvent) => {
    // close menu if click outside of it
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
  };
  const onUpdateTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };
  useEffect(() => {
    setMounted(true);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);
  return (
    <div className={styles.navi}>
      <div className="h-full container flex">
        <Link href="/" className="flexItem url">
          <Image
            src={icoPath}
            priority={false}
            width={32}
            height={32}
            alt={SITE_CONFIG.title}
            className={styles.siteIcon}
          />
          <div className={styles.title}>{SITE_CONFIG.title}</div>
        </Link>
        <nav className={styles.links}>
          {navItems.map((navItem, i) => (
            <div className="flexItem" key={i.toString()}>
              <Link
                className={classNames(styles.linkItem, {
                  [styles.selected]: currentPath.replace(/^\/([^\/]*).*$/, "$1") === navItem.url,
                })}
                href={`/${navItem.url}`}
                key={i.toString()}
              >
                {navItem.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className={styles.menuWrapper}>
          <div className={styles.menu} onClick={onToggleMenu} ref={menuRef}>
            <div className={classNames(styles.menuIcon, "flexItem", "w-full", "h-full")}>
              <MenuIcon />
            </div>
            {isOpen && (
              <div className={styles.menuList}>
                {navItems.map((navItem, i) => (
                  <div key={i.toString()} className={styles.menuItem}>
                    <Link href={`/${navItem.url}`} className="url">
                      {navItem.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={classNames(styles.darkIcon, "flexItem", "h-full")} onClick={onUpdateTheme}>
          <div className="flexItem">{mounted && (theme === "light" ? <MoonIcon /> : <SunIcon />)}</div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [isCopy, setIsCopy] = useState<Boolean>(false);
  const [isHover, setIsHover] = useState<Boolean>(false);
  const [isHoverIcon, setIsHoverIcon] = useState<Boolean>(false);
  const onCopy = () => {
    if (isCopy) return;
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 1200);
  };
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContainer}>
          <span>
            © 2020-{new Date().getFullYear()} by {SITE_CONFIG.author}
          </span>
          <span className={styles.dot}> · </span>
          <CopyToClipboard text={`${SITE_CONFIG.siteUrl}/feed`}>
            <div className={styles.rss} onClick={onCopy}>
              <InfoIcon
                className={styles.infoIcon}
                onMouseOver={() => {
                  setIsHoverIcon(true);
                }}
                onMouseLeave={() => {
                  setIsHoverIcon(false);
                }}
              />
              {isHoverIcon && <span className={styles.tips}>受GitHub Pages限制，无法在线查看XML文件</span>}

              <span
                onMouseOver={() => {
                  setIsHover(true);
                }}
                onMouseLeave={() => {
                  setIsHover(false);
                }}
                className={styles.rssLink}
              >
                RSS Feed
              </span>
              {isHover &&
                (isCopy ? (
                  <span className={styles.tips}>已复制到剪贴板</span>
                ) : (
                  <span className={styles.tips}>点击以复制RSS链接</span>
                ))}
            </div>
          </CopyToClipboard>
        </div>
      </div>
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
        <span className={styles.dot}> · </span>
        <span>Deployed on {SITE_CONFIG.buildTime.toISOString().split("T")[0]}</span>
      </div>
    </footer>
  );
};

const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6zm-6 6a8 8 0 0 0 8 8 8.006 8.006 0 0 0 6.957-4.045c-.316.03-.636.045-.957.045-5.523 0-10-4.477-10-10 0-.321.015-.64.045-.957A8.006 8.006 0 0 0 4 12zm14.164-9.709L19 2.5v1l-.836.209a2 2 0 0 0-1.455 1.455L16.5 6h-1l-.209-.836a2 2 0 0 0-1.455-1.455L13 3.5v-1l.836-.209A2 2 0 0 0 15.29.836L15.5 0h1l.209.836a2 2 0 0 0 1.455 1.455zm5 5L24 7.5v1l-.836.209a2 2 0 0 0-1.455 1.455L21.5 11h-1l-.209-.836a2 2 0 0 0-1.455-1.455L18 8.5v-1l.836-.209a2 2 0 0 0 1.455-1.455L20.5 5h1l.209.836a2 2 0 0 0 1.455 1.455z" />
  </svg>
);

const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
  </svg>
);

const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={200} height={200} viewBox="0 0 1024 1024" {...props}>
    <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z" />
  </svg>
);

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 1024 1024" {...props}>
    <path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512zm0-938.667c-234.667 0-426.667 192-426.667 426.667s192 426.667 426.667 426.667 426.667-192 426.667-426.667S746.667 85.333 512 85.333zm0 512c-25.6 0-42.667-17.066-42.667-42.666V256c0-25.6 17.067-42.667 42.667-42.667S554.667 230.4 554.667 256v298.667c0 21.333-17.067 42.666-42.667 42.666zm0 81.067c25.6 0 46.933 21.333 46.933 46.933S537.6 772.267 512 772.267s-46.933-21.334-46.933-46.934S486.4 678.4 512 678.4z" />
  </svg>
);

export default RootLayout;
