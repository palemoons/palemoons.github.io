"use client";

import icoPath from "@/app/favicon.ico";
import { SITE_CONFIG } from "@/app/site.config";
import { RssCopyLink } from "@/components/RssCopyLink";
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
          <main>{children}</main>
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
  return (
    <footer className="mx-4 mt-4 border-t border-(--color-border-strong) py-4 text-sm font-extralight">
      <div className="flex flex-col items-center gap-1 sm:gap-0">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
          <span>
            © 2020 - {new Date().getFullYear()} by {SITE_CONFIG.author}
          </span>
          <span className="hidden sm:inline">·</span>
          <RssCopyLink siteUrl={SITE_CONFIG.siteUrl} />
        </div>

        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
          <span>
            Built on{" "}
            <Link
              href="https://nextjs.org/"
              target="_blank"
              className="underline decoration-(--color-link-underline) decoration-1 underline-offset-3 hover:decoration-[1.5px]"
            >
              NextJS
            </Link>
          </span>
          <span className="hidden sm:inline">·</span>
          <span>
            Powered by{" "}
            <Link
              href={SITE_CONFIG.siteRepo}
              target="_blank"
              className="underline decoration-(--color-link-underline) decoration-1 underline-offset-3 hover:decoration-[1.5px]"
            >
              GitHub
            </Link>
          </span>
          <span className="hidden sm:inline">·</span>
          <span>Deployed on {SITE_CONFIG.buildTime.toISOString().split("T")[0]}</span>
        </div>
      </div>
    </footer>
  );
};

export default RootLayout;
