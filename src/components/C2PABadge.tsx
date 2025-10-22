import type { C2PAInfo } from "@/types/c2pa.d.ts";
import { extractC2PAMetadata } from "@/utils/c2pa";
import { Info } from "lucide-react";

interface C2PABadgeProps {
  c2paInfo: C2PAInfo;
  onDetailsClick?: () => void;
}

const C2PABadge = ({ c2paInfo, onDetailsClick }: C2PABadgeProps) => {
  if (!c2paInfo.hasC2PA) {
    return null;
  }

  const metadata = extractC2PAMetadata(c2paInfo);
  const validationStatus = metadata?.validationStatus || "unknown";

  // Determine icon and styling based on validation status
  const getStatusConfig = () => {
    switch (validationStatus) {
      case "valid":
        return {
          className: "bg-green-50 border-green-200 text-green-800",
          label: "Content Credentials Verified",
        };
      case "warning":
        return {
          className: "bg-yellow-50 border-yellow-200 text-yellow-800",
          label: "Content Credentials (Warnings)",
        };
      case "error":
        return {
          className: "bg-red-50 border-red-200 text-red-800",
          label: "Content Credentials (Issues)",
        };
      default:
        return {
          className: "bg-blue-50 border-blue-200 text-blue-800",
          label: "Content Credentials",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`mb-4 p-3 rounded-lg border-2 ${config.className} transition-all`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <img
            src="/content_credentials_logo.svg"
            alt="Content Credentials"
            className="h-5 w-auto"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm">{config.label}</h3>
            {onDetailsClick && (
              <button
                onClick={onDetailsClick}
                className="text-xs px-2 py-1 rounded hover:bg-white/50 transition-colors flex items-center gap-1"
                type="button"
              >
                <Info className="w-3 h-3" />
                Details
              </button>
            )}
          </div>

          {metadata && (
            <div className="text-xs space-y-1 opacity-90">
              {metadata.claimGenerator && (
                <div className="truncate">
                  <span className="font-medium">Generator:</span>{" "}
                  {metadata.claimGenerator}
                </div>
              )}
              {metadata.signatureIssuer && (
                <div className="truncate">
                  <span className="font-medium">Issuer:</span>{" "}
                  {metadata.signatureIssuer}
                </div>
              )}
              {metadata.signatureTime && (
                <div className="truncate">
                  <span className="font-medium">Signed:</span>{" "}
                  {new Date(metadata.signatureTime).toLocaleString()}
                </div>
              )}
              {metadata.hasIngredients && (
                <div>
                  <span className="font-medium">Ingredients:</span>{" "}
                  {metadata.ingredientCount}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default C2PABadge;
