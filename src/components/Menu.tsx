import { ReactNode, SVGProps, useRef, useEffect, useState } from "react";
import styles from "./Menu.module.css";

const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={200}
    height={200}
    viewBox="0 0 1024 1024"
    {...props}
  >
    <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z" />
  </svg>
);

const Menu = ({
  children,
  ...props
}: { children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    // close menu if click outside of it
    if (menuRef.current && !menuRef.current.contains(event.target as Node))
      setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  return (
    <div {...props}>
      <div className={styles.menu} onClick={handleToggleMenu} ref={menuRef}>
        <div className={`${styles.menuIcon} flexItem w-full h-full`}>
          <MenuIcon />
        </div>
        {isOpen && <div className={styles.menuList}>{children}</div>}
      </div>
    </div>
  );
};

const MenuItem = ({
  children,
  ...props
}: { children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <div className={styles.menuItem}>{children}</div>
    </div>
  );
};

export { Menu, MenuItem };
