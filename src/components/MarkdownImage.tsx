"use client";

import Spinner from "@/components/icons/SpinnerIcon";
import classNames from "classnames";
import { useEffect, useState } from "react";

const FALLBACK_SIZE = 300;
const PREVIEW_TRANSITION_MS = 180;
const PORTRAIT_RATIO = 1.2;

export default function MarkdownImage({
  src,
  alt = "",
  width,
  height,
}: {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [previewMounted, setPreviewMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const finalWidth = width ?? FALLBACK_SIZE;
  const finalHeight = height ?? FALLBACK_SIZE;
  const isPortrait = finalHeight / finalWidth >= PORTRAIT_RATIO;

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const openPreview = () => {
    setPreviewMounted(true);
    requestAnimationFrame(() => setPreviewVisible(true));
  };

  const closePreview = () => {
    setPreviewVisible(false);
    window.setTimeout(() => setPreviewMounted(false), PREVIEW_TRANSITION_MS);
  };

  useEffect(() => {
    if (!previewMounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [previewMounted]);

  return (
    <>
      <button
        type="button"
        onClick={openPreview}
        className="relative mx-auto block max-w-full overflow-hidden rounded-lg border border-(--color-surface-border) bg-(--color-surface-bg) cursor-zoom-in"
        aria-label={alt ? `预览图片：${alt}` : "预览图片"}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-(--color-surface-bg)">
            <Spinner width={28} height={28} className="stroke-(--color-icon)" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={classNames(
            "block transition-opacity duration-300",
            isPortrait ? "max-h-168 w-auto max-w-full" : "h-auto max-w-full",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      </button>

      {previewMounted && (
        <div
          className={classNames(
            "fixed inset-0 z-50 flex items-center justify-center p-6 transition-colors duration-200",
            previewVisible ? "bg-black/80" : "bg-black/0",
          )}
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
          aria-label={alt ? `图片预览：${alt}` : "图片预览"}
        >
          <img
            src={src}
            alt={alt}
            className={classNames(
              "max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out transition duration-200 ease-out",
              previewVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
