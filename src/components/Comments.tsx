"use client";

import SITE_CONFIG from "@/app/site.config";
import Spinner from "@/components/icons/SpinnerIcon";
import classNames from "classnames";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export default function Comments(props: React.HTMLAttributes<HTMLDivElement>) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    setLoading(true);
    element.replaceChildren();

    const s = document.createElement("script");
    s.src = "https://utteranc.es/client.js";
    s.setAttribute("repo", SITE_CONFIG.commentRepo);
    s.setAttribute("issue-term", "pathname");
    s.setAttribute("theme", theme === "light" ? "github-light" : "github-dark");
    s.setAttribute("crossorigin", "anonymous");
    s.async = true;

    const observer = new MutationObserver(() => {
      const iframe = element.querySelector("iframe.utterances-frame");
      if (iframe) {
        setLoading(false);
        observer.disconnect();
      }
    });

    observer.observe(element, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [theme]);

  return (
    <section className="mt-12" {...props}>
      <div className="pb-2 text-2xl">Comments</div>

      <div className="relative">
        {/* Spinner overlay */}
        <div
          className={classNames(
            "pointer-events-none absolute inset-0 flex h-64 items-center justify-center transition-opacity duration-300",
            loading ? "opacity-100" : "opacity-0",
          )}
        >
          <Spinner width={24} height={24} className="stroke-(--color-icon)" />
        </div>

        {/* Utterances container */}
        <div
          className="min-h-64 w-full"
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
