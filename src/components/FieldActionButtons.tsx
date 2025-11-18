import type { FormatState } from "@/hooks/useJsonFormatter";
import { Braces, ChevronDown, Eye, EyeOff, Star } from "lucide-react";

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
}: FieldActionButtonsProps) => {
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
