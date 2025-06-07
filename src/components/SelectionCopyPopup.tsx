import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const HIDE_DELAY = 1000; // ms
const POPUP_HEIGHT = 36; // px, popup height (adjustable)
const POPUP_MIN_WIDTH = 72; // px, should match min-w-[72px]
const MARGIN = 16; // px, margin

const popupContainerClass =
  "fixed z-50 transition-all duration-200 ease-out opacity-100 translate-y-0";
const popupBoxClass =
  "flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg shadow-2xl bg-neutral-900/90 dark:bg-neutral-900/90 border border-neutral-800 min-w-[72px] w-auto";
const buttonBaseClass =
  "flex justify-between items-center w-full text-xs font-semibold px-2 py-1 rounded-md transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-neutral-400";
const buttonActiveClass =
  "cursor-pointer text-white hover:bg-neutral-800 active:bg-neutral-700";
const copiedClass = "text-green-400";
const iconClass = "w-4 h-4";
const textClass = "ml-1 w-full text-center";

const SelectionCopyPopup = () => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const text = selection.toString();
      // Hide if only whitespace is selected
      if (!text.trim()) {
        setShow(false);
        return;
      }
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      // Adjust to avoid hiding at the top of the screen
      let top = rect.top + window.scrollY - POPUP_HEIGHT - MARGIN; // use MARGIN
      if (top < window.scrollY) {
        // If there is not enough space above, show below
        top = rect.bottom + window.scrollY + MARGIN;
      }
      let left = rect.left + window.scrollX + rect.width / 2;
      // Adjust to avoid being cut off at the left/right edge of the screen
      const halfWidth = POPUP_MIN_WIDTH / 2;
      const minLeft = window.scrollX + halfWidth + MARGIN; // use MARGIN
      const maxLeft = window.scrollX + window.innerWidth - halfWidth - MARGIN;
      // さらに余白を確保するため、minLeft/maxLeftを調整
      left = Math.max(minLeft, Math.min(left, maxLeft));
      setSelectedText(text);
      setPosition({
        top,
        left,
      });
      setShow(true);
      setCopied(false);
    } else {
      setShow(false);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!selectedText) return;
    try {
      await navigator.clipboard.writeText(selectedText);
      setCopied(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        setShow(false);
      }, HIDE_DELAY);
    } catch (e) {
      alert(i18next.t("message.copyFailed"));
    }
  }, [selectedText]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  if (!show) return null;

  const icon = copied ? (
    <Check className={iconClass} />
  ) : (
    <Copy className={iconClass} />
  );
  const text = copied ? i18next.t("message.copied") : i18next.t("message.copy");
  const ariaLabel = text;

  return (
    <div
      className={popupContainerClass}
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, 0)",
        pointerEvents: "auto",
      }}
    >
      <div className={popupBoxClass} style={{ minHeight: 28 }}>
        {!copied ? (
          <button
            type="button"
            className={`${buttonBaseClass} ${buttonActiveClass}`}
            onClick={handleCopy}
            aria-label={ariaLabel}
          >
            <span className="flex items-center">{icon}</span>
            <span className={textClass}>{text}</span>
          </button>
        ) : (
          <div
            className={`${buttonBaseClass} ${copiedClass}`}
            aria-label={ariaLabel}
          >
            <span className="flex items-center">{icon}</span>
            <span className={textClass}>{text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionCopyPopup;
