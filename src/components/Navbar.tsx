"use client";

import icoPath from "@/app/favicon.ico";
import SITE_CONFIG from "@/app/site.config";
import classNames from "classnames";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import MenuIcon from "./icons/MenuIcon";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";

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

export default Navbar;