import type { FormatState } from "@/hooks/useJsonFormatter";
import {
  Braces,
  Check,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FieldActionButtonsProps {
  fieldName: string;
  isFavorite: boolean;
  isHidden: boolean;
  onToggleFavorite: (fieldName: string) => void;
  onToggleHidden: (fieldName: string) => void;
  canFormat?: boolean;
  formatState?: FormatState;
  onToggleFormat?: (fieldName: string) => void;
  showFavorite?: boolean;
  showHidden?: boolean;
  onCopy: () => Promise<void>;
  fieldDisplayName: string;
}

const FieldActionButtons = ({
  fieldName,
  isFavorite,
  isHidden,
  onToggleFavorite,
  onToggleHidden,
  canFormat = false,
  formatState = "none",
  onToggleFormat,
  showFavorite = true,
  showHidden = true,
  onCopy,
  fieldDisplayName,
}: FieldActionButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await onCopy();
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1000);
    } catch {
      alert(i18next.t("message.copyFailed"));
    }
  };

  const copyButtonLabel = `${i18next.t("message.copyFieldValue")}: ${fieldDisplayName}`;

  const getFormatButtonColor = () => {
    switch (formatState) {
      case "formatted":
        return "text-blue-500";
      default:
        return "text-gray-400 dark:text-gray-500";
    }
  };

  const getFormatButtonTitle = () => {
    switch (formatState) {
      case "formatted":
        return i18next.t("message.expandJson");
      case "expanded":
        return i18next.t("message.unformatJson");
      default:
        return i18next.t("message.formatJson");
    }
  };

  const getFormatButtonIcon = () => {
    if (formatState === "expanded") {
      return <ChevronDown size={16} />;
    }
    return <Braces size={16} />;
  };

  return (
    <div className="flex items-center gap-1 ml-2">
      <button
        type="button"
        onClick={handleCopy}
        className={`rounded p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${
          copied ? "text-green-500" : "text-gray-400 dark:text-gray-500"
        }`}
        title={copied ? i18next.t("message.copied") : copyButtonLabel}
        aria-label={copied ? i18next.t("message.copied") : copyButtonLabel}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      {canFormat && onToggleFormat && (
        <button
          type="button"
          onClick={() => onToggleFormat(fieldName)}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${getFormatButtonColor()}`}
          title={getFormatButtonTitle()}
          aria-label={getFormatButtonTitle()}
        >
          {getFormatButtonIcon()}
        </button>
      )}
      {showFavorite && (
        <button
          type="button"
          onClick={() => onToggleFavorite(fieldName)}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            isFavorite ? "text-yellow-500" : "text-gray-400 dark:text-gray-500"
          }`}
          title={
            isFavorite
              ? i18next.t("message.removeFavorite")
              : i18next.t("message.addFavorite")
          }
          aria-label={
            isFavorite
              ? i18next.t("message.removeFavorite")
              : i18next.t("message.addFavorite")
          }
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      )}
      {showHidden && (
        <button
          type="button"
          onClick={() => onToggleHidden(fieldName)}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            isHidden
              ? "text-gray-600 dark:text-gray-400"
              : "text-gray-400 dark:text-gray-500"
          }`}
          title={
            isHidden
              ? i18next.t("message.showField")
              : i18next.t("message.hideField")
          }
          aria-label={
            isHidden
              ? i18next.t("message.showField")
              : i18next.t("message.hideField")
          }
        >
          {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

export default FieldActionButtons;
