"use client";

import SITE_CONFIG from "@/app/site.config";
import Spinner from "@/components/icons/SpinnerIcon";
import classNames from "classnames";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

type UtterancesTheme = "github-light" | "github-dark";

function getUtterancesTheme(theme?: string): UtterancesTheme {
  return theme === "light" ? "github-light" : "github-dark";
}

export default function Comments(props: React.HTMLAttributes<HTMLDivElement>) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const utterancesTheme = getUtterancesTheme(theme);
    const iframe = element.querySelector("iframe.utterances-frame") as HTMLIFrameElement | null;

    if (iframe) {
      iframe.contentWindow?.postMessage(
        {
          type: "set-theme",
          theme: utterancesTheme,
        },
        "https://utteranc.es",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    // element.replaceChildren();

    const scriptElement = document.createElement("script");
    scriptElement.src = "https://utteranc.es/client.js";
    scriptElement.async = true;
    scriptElement.crossOrigin = "anonymous";
    scriptElement.setAttribute("repo", SITE_CONFIG.commentRepo);
    scriptElement.setAttribute("issue-term", "pathname");
    scriptElement.setAttribute("theme", "github-light");
    scriptElement.setAttribute("theme", utterancesTheme);

    scriptElement.onload = (ev) => {
      const commentsContainer = document.getElementById("comments-container") as HTMLIFrameElement | null;
      if (commentsContainer && commentsContainer.children[1]) {
        // for some reason it shows two comment elements, this is to hide second one.
        const duplicatedIframe = commentsContainer.children[1] as HTMLIFrameElement;
        duplicatedIframe.style.display = "none";
        setLoading(false);
      }
    };

    element.appendChild(scriptElement);
  }, [theme]);

  return (
    <section className="mt-12" {...props}>
      <div className="pb-2 text-2xl">Comments</div>

      <div className="relative">
        <div
          className={classNames(
            "pointer-events-none absolute inset-0 flex h-64 items-center justify-center transition-opacity duration-300",
            loading ? "opacity-100" : "opacity-0",
          )}
        >
          <Spinner width={24} height={24} className="stroke-(--color-icon)" />
        </div>

        <div ref={containerRef} className="min-h-64 w-full" id="comments-container" />
      </div>
    </section>
  );
}
