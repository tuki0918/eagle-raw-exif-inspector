import { AutoSaveToggle } from "@/components/AutoSaveToggle";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const PreferencesSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 text-sm w-full"
        aria-expanded={isExpanded}
      >
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span>Preferences</span>
      </button>

      {isExpanded && (
        <div className="mt-2 px-2">
          <AutoSaveToggle />
        </div>
      )}
    </div>
  );
};

export default PreferencesSection;
