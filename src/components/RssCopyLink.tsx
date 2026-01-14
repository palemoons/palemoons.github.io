import InfoIcon from "@/components/icons/InfoIcon";
import classNames from "classnames";
import { useId, useMemo, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function RssCopyLink({ siteUrl }: { siteUrl: string }) {
  const tooltipId = useId();
  const [isCopy, setIsCopy] = useState<Boolean>(false);
  const [tipOpen, setTipOpen] = useState(false);
  const rssUrl = useMemo(() => `${siteUrl}/feed`, [siteUrl]);

  const onCopy = () => {
    if (isCopy) return;
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 1200);
  };

  return (
    <CopyToClipboard text={rssUrl} onCopy={onCopy}>
      <div className="inline-flex items-baseline gap-1 select-none">
        <span
          className="relative inline-flex items-center"
          onMouseEnter={() => setTipOpen(true)}
          onMouseLeave={() => setTipOpen(false)}
        >
          <button
            type="button"
            aria-label="RSS 订阅提示"
            aria-describedby={tooltipId}
            aria-expanded={tipOpen}
            onClick={(e) => {
              e.stopPropagation(); // disable rss link copy
              setTipOpen(!tipOpen);
            }}
          >
            <InfoIcon width={10} height={10} className="fill-(--color-icon)" />
          </button>

          {tipOpen && (
            <span
              role="tooltip"
              id={tooltipId}
              className={classNames(
                "pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2",
                "rounded-md border bg-(--color-page-bg) px-2 py-1 text-xs whitespace-nowrap",
                "border-(--color-surface-border) text-(--color-page-fg) shadow-sm",
              )}
            >
              点击右侧文字复制链接订阅
            </span>
          )}
        </span>

        <span
          className="cursor-pointer text-sm underline decoration-(--color-link-underline) decoration-1 underline-offset-3 hover:decoration-[1.5px]"
          role="button"
          onClick={onCopy}
        >
          {isCopy ? "已复制!" : "RSS Feed"}
        </span>
      </div>
    </CopyToClipboard>
  );
}
