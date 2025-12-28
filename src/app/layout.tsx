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
      <body className="flex min-h-screen flex-col">
        <ThemeProvider defaultTheme="system">
          <Navbar />
          <main className="flex-1">{children}</main>
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
    <div className="sticky top-0 z-1 h-(--layout-navbar-height) w-full border-b border-(--color-surface-border) bg-(--color-page-bg)/95 backdrop-blur">
      <div className="mx-auto flex h-full items-center justify-between px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 no-underline hover:bg-(--color-hover)"
        >
          <Image src={icoPath} priority={false} width={24} height={24} alt={SITE_CONFIG.title} />
          <div className="text-base font-semibold tracking-tight">{SITE_CONFIG.title}</div>
        </Link>
        <nav className="hidden h-full flex-1 items-center justify-end gap-1 md:flex">
          {navItems.map((navItem, i) => (
            <div key={i.toString()}>
              <Link
                className={classNames(
                  "rounded-md px-3 py-2 text-sm font-medium text-(--color-page-fg) no-underline hover:bg-(--color-hover)",
                  currentPath.replace(/^\/([^\/]*).*$/, "$1") === navItem.url &&
                    "font-semibold text-(--color-page-fg) underline decoration-(--color-link-underline) decoration-1",
                )}
                href={`/${navItem.url}`}
                key={i.toString()}
              >
                {navItem.name}
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex-1 text-right md:hidden" ref={menuRef}>
          {/* Trigger */}
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label="打开菜单"
            aria-expanded={isOpen}
            className="inline-flex items-center justify-center rounded-md p-2 hover:cursor-pointer hover:bg-(--color-hover)"
          >
            <MenuIcon width={20} height={20} className="fill-(--color-icon)" />
          </button>

          {/* Expand area (below navbar) */}
          {isOpen && (
            <div className="absolute top-full right-0 left-0 z-1 border-b border-(--color-surface-border) bg-(--color-page-bg)/95 backdrop-blur">
              <div className="flex flex-col gap-1 px-4 py-2">
                {navItems.map((navItem, i) => {
                  const href = `/${navItem.url}`;
                  const active = currentPath.replace(/^\/([^\/]*).*$/, "$1") === navItem.url;

                  return (
                    <Link
                      key={i.toString()}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={classNames(
                        "rounded-md px-3 py-2 text-sm no-underline hover:bg-(--color-hover)",
                        active && "font-semibold underline decoration-(--color-link-underline) decoration-1",
                      )}
                    >
                      {navItem.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="主题切换"
          onClick={onUpdateTheme}
          className="cursor-pointer rounded-md p-2 hover:bg-(--color-hover)"
        >
          {mounted &&
            (theme === "light" ? (
              <MoonIcon width={20} height={20} className="fill-(--color-icon)" />
            ) : (
              <SunIcon width={20} height={20} className="fill-(--color-icon)" />
            ))}
        </button>
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
