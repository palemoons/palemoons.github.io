"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SVGProps, useEffect, useState } from "react";
import { Menu, MenuItem } from "./Menu";
import icoPath from "@/app/favicon.ico";
import styles from "./Navbar.module.css";
import { SITE_CONFIG } from "@/app/site.config";

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

const Navbar = ({ ...props }) => {
  const navItems = SITE_CONFIG.categories.concat(SITE_CONFIG.subpages);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const currentPath = usePathname();
  useEffect(() => {
    setMounted(true);
  }, []);
  const onUpdateTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div className={styles.navi} {...props}>
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
                className={`${styles.linkItem} ${currentPath.replace(/^\/([^\/]*).*$/, "$1") === navItem.url ? styles.selected : ""}`}
                href={`/${navItem.url}`}
                key={i.toString()}
              >
                {navItem.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className={styles.menu}>
          <Menu>
            {navItems.map((navItem, i) => (
              <MenuItem key={i.toString()}>
                <Link href={navItem.url} className="url">
                  {navItem.name}
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div className={`flexItem ${styles.darkIcon} h-full`} onClick={onUpdateTheme}>
          <div className="flexItem">{mounted && (theme === "light" ? <MoonIcon /> : <SunIcon />)}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
