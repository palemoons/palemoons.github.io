"use client";

import Spinner from "@/components/icons/SpinnerIcon";
import classNames from "classnames";
import { type PointerEvent, useEffect, useRef, useState } from "react";

const FALLBACK_SIZE = 300;
const PREVIEW_TRANSITION_MS = 180;
const PORTRAIT_RATIO = 1.2;
const MAX_PREVIEW_SCALE = 4;
const WHEEL_ZOOM_PER_PIXEL = Math.log(1.15) / 100;
const DEFAULT_ZOOM = { scale: 1, x: 0, y: 0 };

function clampOffset(offset: number, imageSize: number, viewportSize: number) {
  const limit = Math.max(0, (imageSize - viewportSize) / 2);
  return Math.max(-limit, Math.min(limit, offset));
}

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
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const finalWidth = width ?? FALLBACK_SIZE;
  const finalHeight = height ?? FALLBACK_SIZE;
  const isPortrait = finalHeight / finalWidth >= PORTRAIT_RATIO;

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const openPreview = () => {
    setZoom(DEFAULT_ZOOM);
    setPreviewMounted(true);
    requestAnimationFrame(() => setPreviewVisible(true));
  };

  const closePreview = () => {
    dragRef.current = null;
    setPreviewVisible(false);
    window.setTimeout(() => setPreviewMounted(false), PREVIEW_TRANSITION_MS);
  };

  const startDrag = (event: PointerEvent<HTMLImageElement>) => {
    if (!previewVisible || zoom.scale === 1 || event.button !== 0 || dragRef.current) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const moveDrag = (event: PointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current;
    const preview = previewRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !preview) return;

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    drag.x = event.clientX;
    drag.y = event.clientY;

    const { clientWidth: imageWidth, clientHeight: imageHeight } = event.currentTarget;
    const { clientWidth: viewportWidth, clientHeight: viewportHeight } = preview;
    setZoom((current) => {
      const x = clampOffset(current.x + dx, imageWidth * current.scale, viewportWidth);
      const y = clampOffset(current.y + dy, imageHeight * current.scale, viewportHeight);
      return x === current.x && y === current.y ? current : { ...current, x, y };
    });
  };

  const stopDrag = (event: PointerEvent<HTMLImageElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
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

  useEffect(() => {
    const preview = previewRef.current;
    const image = previewImageRef.current;
    if (!previewVisible || !preview || !image) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      if (event.target !== image || event.deltaY === 0) return;

      const { deltaMode, deltaY, clientX, clientY } = event;
      const viewport = preview.getBoundingClientRect();
      const imageWidth = image.clientWidth;
      const imageHeight = image.clientHeight;
      if (!imageWidth || !imageHeight) return;

      let pixels = deltaY;
      if (deltaMode === WheelEvent.DOM_DELTA_LINE) pixels *= 32;
      if (deltaMode === WheelEvent.DOM_DELTA_PAGE) pixels *= viewport.height;

      const anchorX = clientX - viewport.left - viewport.width / 2;
      const anchorY = clientY - viewport.top - viewport.height / 2;
      setZoom((current) => {
        const scale = Math.max(
          1,
          Math.min(MAX_PREVIEW_SCALE, current.scale * Math.exp(-pixels * WHEEL_ZOOM_PER_PIXEL)),
        );
        if (scale === current.scale) return current;
        if (scale === 1) return DEFAULT_ZOOM;

        const ratio = scale / current.scale;
        return {
          scale,
          x: clampOffset(anchorX + (current.x - anchorX) * ratio, imageWidth * scale, viewport.width),
          y: clampOffset(anchorY + (current.y - anchorY) * ratio, imageHeight * scale, viewport.height),
        };
      });
    };

    const observer = new ResizeObserver(() => {
      const width = preview.clientWidth;
      const height = preview.clientHeight;
      const imageWidth = image.clientWidth;
      const imageHeight = image.clientHeight;
      setZoom((current) => {
        const x = clampOffset(current.x, imageWidth * current.scale, width);
        const y = clampOffset(current.y, imageHeight * current.scale, height);
        return x === current.x && y === current.y ? current : { ...current, x, y };
      });
    });
    observer.observe(preview);
    observer.observe(image);
    preview.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      observer.disconnect();
      preview.removeEventListener("wheel", onWheel);
    };
  }, [previewVisible]);

  return (
    <>
      <button
        type="button"
        onClick={openPreview}
        className="relative mx-auto block max-w-full cursor-zoom-in overflow-hidden rounded-lg border border-(--color-surface-border) bg-(--color-surface-bg)"
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
          ref={previewRef}
          className={classNames(
            "fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-6 transition-colors duration-200",
            previewVisible ? "bg-black/80" : "bg-black/0",
          )}
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
          aria-label={alt ? `图片预览：${alt}` : "图片预览"}
        >
          <img
            ref={previewImageRef}
            src={src}
            alt={alt}
            draggable={false}
            style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})` }}
            className={classNames(
              "max-h-[90vh] max-w-[90vw] touch-none object-contain transition-[opacity,scale] duration-200 ease-out select-none",
              zoom.scale > 1 && "cursor-grab active:cursor-grabbing",
              previewVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onLostPointerCapture={stopDrag}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
