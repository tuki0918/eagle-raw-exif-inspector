import type {
  ExifDisplaySettingKey,
  ExifDisplaySettings,
} from "@/hooks/useExifDisplaySettings";

interface MetadataSettingsProps {
  settings: ExifDisplaySettings;
  onChange: (key: ExifDisplaySettingKey, value: boolean) => void;
}

const settingItems: Array<{
  key: ExifDisplaySettingKey;
  labelKey: string;
}> = [
  { key: "autoFormatJson", labelKey: "message.autoFormatJson" },
  { key: "collapseLongValues", labelKey: "message.collapseLongValues" },
  { key: "favoritesFirst", labelKey: "message.favoritesFirst" },
  { key: "showFullFieldPaths", labelKey: "message.showFullFieldPaths" },
  {
    key: "includeFieldNameInCopy",
    labelKey: "message.includeFieldNameInCopy",
  },
];

const MetadataSettings = ({ settings, onChange }: MetadataSettingsProps) => (
  <div className="rounded-lg bg-black/5 p-1 dark:bg-black/20">
    <div className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
      {i18next.t("message.displaySettings")}
    </div>
    <div className="flex flex-col gap-1">
      {settingItems.map((item) => {
        const isEnabled = settings[item.key];

        return (
          <button
            key={item.key}
            type="button"
            role="switch"
            aria-checked={isEnabled}
            onClick={() => onChange(item.key, !isEnabled)}
            className="flex w-full items-center justify-between gap-3 rounded-md bg-white/70 px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-blue-500 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
          >
            <span>{i18next.t(item.labelKey)}</span>
            <span
              aria-hidden="true"
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                isEnabled ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  isEnabled ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default MetadataSettings;
