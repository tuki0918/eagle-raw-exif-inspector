import { useEffect, useState } from "react";
import { renderValue } from "@/utils/renderValue";

const HIDDEN_KEYS_STORAGE_KEY = "exifMetadataHiddenKeys";

function getHiddenKeys(): string[] {
  try {
    const v = localStorage.getItem(HIDDEN_KEYS_STORAGE_KEY);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}
function setHiddenKeys(keys: string[]) {
  localStorage.setItem(HIDDEN_KEYS_STORAGE_KEY, JSON.stringify(keys));
}

const TABS = [
  { key: "all", label: "すべて" },
  { key: "visible", label: "👁 表示" },
  { key: "hidden", label: "🚫 非表示" },
];

const ImageExifMetadata = ({
  item,
}: {
  item: {
    [key: string]: unknown;
  } | null;
}) => {
  const [tab, setTab] = useState("all");
  const [hiddenKeys, setHiddenKeysState] = useState<string[]>(getHiddenKeys());

  useEffect(() => {
    setHiddenKeysState(getHiddenKeys());
  }, [item]);

  const handleHide = (key: string) => {
    const next = [...hiddenKeys, key];
    setHiddenKeys(next);
    setHiddenKeysState(next);
  };
  const handleShow = (key: string) => {
    const next = hiddenKeys.filter((k) => k !== key);
    setHiddenKeys(next);
    setHiddenKeysState(next);
  };

  if (item == null) {
    return (
      <div className="py-3 px-4 info-message rounded-md text-center">
        {i18next.t("message.notFound")}
      </div>
    );
  }

  const entries = Object.entries(item);
  let filteredEntries = entries;
  if (tab === "visible") {
    filteredEntries = entries.filter(([key]) => !hiddenKeys.includes(key));
  } else if (tab === "hidden") {
    filteredEntries = entries.filter(([key]) => hiddenKeys.includes(key));
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-md border ${tab === t.key ? "bg-white border-black" : "bg-gray-100 border-transparent"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} {t.key === "visible" && `(${entries.length - hiddenKeys.length}/${entries.length})`} {t.key === "hidden" && `(${hiddenKeys.length}/${entries.length})`}
          </button>
        ))}
      </div>
      {filteredEntries.map(([key, value]) => (
        <div key={key} className="flex flex-col md:flex-row items-start md:items-center mb-2 group">
          <div className="py-3 item-label min-w-[120px]">{key}</div>
          <div className="py-3 px-4 item-value rounded-md flex-1">{renderValue(value)}</div>
          {hiddenKeys.includes(key) ? (
            <button
              className="ml-2 text-green-600 hover:underline"
              onClick={() => handleShow(key)}
              title="表示に戻す"
            >
              👁
            </button>
          ) : (
            <button
              className="ml-2 text-gray-400 hover:text-red-500"
              onClick={() => handleHide(key)}
              title="非表示にする"
            >
              🚫
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default ImageExifMetadata;
