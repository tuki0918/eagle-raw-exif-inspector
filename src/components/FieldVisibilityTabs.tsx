import { Settings } from "lucide-react";

export type FieldVisibilityTab = "visible" | "hidden" | "settings";

interface FieldVisibilityTabsProps {
  activeTab: FieldVisibilityTab;
  visibleCount: number;
  hiddenCount: number;
  onChange: (tab: FieldVisibilityTab) => void;
}

const FieldVisibilityTabs = ({
  activeTab,
  visibleCount,
  hiddenCount,
  onChange,
}: FieldVisibilityTabsProps) => {
  const tabs: Array<{
    id: Exclude<FieldVisibilityTab, "settings">;
    label: string;
    count: number;
  }> = [
    {
      id: "visible",
      label: i18next.t("message.visibleFields"),
      count: visibleCount,
    },
    {
      id: "hidden",
      label: i18next.t("message.hiddenFields"),
      count: hiddenCount,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label={i18next.t("message.fieldVisibility")}
      className="mb-4 flex items-stretch gap-2"
    >
      <div className="grid min-w-0 flex-1 grid-cols-2 gap-1 rounded-lg bg-black/5 p-1 dark:bg-black/20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`${tab.id}-fields-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-fields-panel`}
              onClick={() => onChange(tab.id)}
              className={`min-w-0 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-blue-300"
                  : "text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
            >
              <span>{tab.label}</span> <span>({tab.count})</span>
            </button>
          );
        })}
      </div>
      <button
        id="settings-fields-tab"
        type="button"
        role="tab"
        aria-label={i18next.t("message.displaySettings")}
        aria-selected={activeTab === "settings"}
        aria-controls="settings-fields-panel"
        onClick={() => onChange("settings")}
        className={`flex size-11 shrink-0 self-start items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
          activeTab === "settings"
            ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:text-blue-300 dark:ring-white/10"
            : "bg-black/5 text-gray-500 hover:bg-black/10 dark:bg-black/20 dark:text-gray-400 dark:hover:bg-white/10"
        }`}
      >
        <Settings size={16} />
      </button>
    </div>
  );
};

export default FieldVisibilityTabs;
