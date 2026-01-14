"use client";

import SITE_CONFIG from "@/app/site.config";
import Link from "next/link";

import RssCopyLink from "./RssCopyLink";

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

export default Footer;
