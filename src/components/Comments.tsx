"use client";

import React from "react";
import { useTheme } from "next-themes";
import { SITE_CONFIG } from "@/app/site.config";
import Spinner from "./icons/SpinnerIcon";

export default function Comments(props: React.HTMLAttributes<HTMLDivElement>) {
  const { theme } = useTheme();

  return (
    <section className="mt-12" {...props}>
      <div className="pb-2 text-2xl">Comments</div>
      <div className="relative">
        <div className="absolute h-64 w-full text-center leading-[256px] [&>svg]:stroke-[color:var(--color-icon)]">
          <Spinner />
        </div>
        <div
          className="min-h-64 w-full [&_.utterances]:max-w-none"
          ref={(element) => {
            if (!element) return;

            const scriptElement = document.createElement("script");
            scriptElement.setAttribute("src", "https://utteranc.es/client.js");
            scriptElement.setAttribute("repo", SITE_CONFIG.commentRepo);
            scriptElement.setAttribute("issue-term", "pathname");
            scriptElement.setAttribute("theme", theme === "light" ? "github-light" : "github-dark");
            scriptElement.setAttribute("crossorigin", "anonymous");
            scriptElement.setAttribute("async", "true");
            element.replaceChildren(scriptElement);
          }}
        />
      </div>
    </section>
  );
}
