import { useAutoSavePreference } from "@/hooks/useAutoSavePreference";

export function AutoSaveToggle() {
  const { autoSaveEnabled, setAutoSaveEnabled } = useAutoSavePreference();

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label htmlFor="auto-save-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Auto-save metadata to annotations
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Automatically save EXIF metadata to Eagle item annotations when empty
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id="auto-save-toggle"
            type="checkbox"
            className="sr-only"
            checked={autoSaveEnabled}
            onChange={(e) => setAutoSaveEnabled(e.target.checked)}
          />
          <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
            autoSaveEnabled 
              ? 'bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-600'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 transform ${
              autoSaveEnabled ? 'translate-x-5' : 'translate-x-0.5'
            } mt-0.5`} />
          </div>
        </label>
      </div>
    </div>
  );
}