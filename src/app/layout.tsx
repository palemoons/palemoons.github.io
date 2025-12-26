"use client";

import icoPath from "@/app/favicon.ico";
import { SITE_CONFIG } from "@/app/site.config";
import InfoIcon from "@/components/icons/InfoIcon";
import MenuIcon from "@/components/icons/MenuIcon";
import MoonIcon from "@/components/icons/MoonIcon";
import SunIcon from "@/components/icons/SunIcon";
import { codeFont, textFont } from "@/lib/font";
import { GoogleAnalytics } from "@next/third-parties/google";
import classNames from "classnames";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import "./global.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${textFont.variable} ${codeFont.variable} ${textFont.className}`}
    >
      <body>
        <ThemeProvider defaultTheme="system">
          <Navbar />
          <main className="m-auto max-w-2xl px-4">{children}</main>
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
    <div className="sticky top-0 z-1 h-(--navbar-height) w-full border-b-[0.5px] border-b-(--color-border-strong) bg-(--color-page-bg)">
      <div className="container flex h-full">
        <Link href="/" className="flexItem url">
          <Image
            src={icoPath}
            priority={false}
            width={32}
            height={32}
            alt={SITE_CONFIG.title}
            className="h-6 w-6 p-1.5"
          />
          <div className="px-1 text-base leading-6 font-semibold">{SITE_CONFIG.title}</div>
        </Link>
        <nav className="hidden h-full flex-auto justify-end md:inline-flex">
          {navItems.map((navItem, i) => (
            <div className="flexItem" key={i.toString()}>
              <Link
                className={classNames(
                  "w-21 rounded-xs border border-transparent p-0.5 text-center text-base leading-9 text-(--color-page-fg) no-underline",
                  {
                    "text-(--color-quote-bg)": currentPath.replace(/^\/([^\/]*).*$/, "$1") === navItem.url,
                  },
                )}
                href={`/${navItem.url}`}
                key={i.toString()}
              >
                {navItem.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="inline-flex flex-auto items-center justify-end pr-1 md:hidden">
          <div className="relative h-9 w-9" onClick={onToggleMenu} ref={menuRef}>
            <div className="flexItem h-full w-full rounded-xs border border-transparent hover:cursor-pointer hover:bg-(--color-hover) [&>svg]:h-[66.7%] [&>svg]:w-[66.7%] [&>svg]:fill-(--color-icon)">
              <MenuIcon />
            </div>
            {isOpen && (
              <div className="absolute top-full right-0 z-1 mt-1 w-24 rounded-xs border border-(--color-border-strong) bg-(--color-page-bg) py-1 shadow">
                {navItems.map((navItem, i) => (
                  <div key={i.toString()} className="px-1 py-1 text-center hover:bg-(--color-hover)">
                    <Link href={`/${navItem.url}`} className="url">
                      {navItem.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flexItem h-full flex-none cursor-pointer" onClick={onUpdateTheme}>
          <div className="flexItem h-9 w-9 rounded-xs border border-transparent hover:bg-(--color-hover)">
            {mounted &&
              (theme === "light" ? (
                <MoonIcon className="h-6 w-6 fill-(--color-icon)" />
              ) : (
                <SunIcon className="h-6 w-6 fill-(--color-icon)" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [isCopy, setIsCopy] = useState<Boolean>(false);

  const onCopy = () => {
    if (isCopy) return;
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 1200);
  };
  return (
    <footer className="static mx-4 mt-4 border-t border-(--color-border-strong) py-4">
      <div>
        <div className="mb-0.5 text-sm leading-4.5">
          <span>
            © 2020-{new Date().getFullYear()} by {SITE_CONFIG.author}
          </span>
          <span> · </span>
          <CopyToClipboard text={`${SITE_CONFIG.siteUrl}/feed`}>
            <div className="flex items-center">
              <span className="group relative inline-flex items-center [&>svg]:fill-(--color-page-fg)">
                <InfoIcon aria-describedby="icon-desc" />
                <span
                  role="tooltip"
                  id="icon-desc"
                  className="invisible absolute bottom-[180%] left-1/2 -ml-20.25 w-37.5 cursor-pointer rounded-xs bg-(--color-hover) px-1.5 py-1 text-center group-hover:visible after:absolute after:top-full after:left-1/2 after:-ml-1.25 after:border-[5px] after:border-solid after:border-t-(--color-hover) after:border-r-transparent after:border-b-transparent after:border-l-transparent after:content-['']"
                >
                  点击链接以复制
                </span>
              </span>
              <span className="ml-1 cursor-pointer underline" onClick={onCopy}>
                {isCopy ? "已复制!" : "RSS Feed"}
              </span>
            </div>
          </CopyToClipboard>
        </div>
      </div>
      <div className="mb-0.5 flex items-end justify-center text-sm leading-4.5 max-[640px]:flex-col max-[640px]:items-center [&>span]:mx-1">
        <span>
          Built on{" "}
          <Link href="https://nextjs.org/" target="_blank">
            NextJS
          </Link>
        </span>
        <span className="mx-1"> · </span>
        <span>
          Powered by{" "}
          <Link href={SITE_CONFIG.siteRepo} target="_blank">
            Github
          </Link>
        </span>
        <span className="mx-1"> · </span>
        <span>Deployed on {SITE_CONFIG.buildTime.toISOString().split("T")[0]}</span>
      </div>
    </footer>
  );
};

export default RootLayout;
