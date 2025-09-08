import "@/App.css";
import { AutoSaveToggle } from "@/components/AutoSaveToggle";
import ImageExifMetadata from "@/components/ImageExifMetadata";
import SelectionCopyPopup from "@/components/SelectionCopyPopup";
import ThemeWrapper from "@/components/ThemeWrapper";
import { useAutoSavePreference } from "@/hooks/useAutoSavePreference";
import { useEaglePlugin } from "@/hooks/useEaglePlugin";

function App() {
  const { autoSaveEnabled } = useAutoSavePreference();
  const { theme, item } = useEaglePlugin(autoSaveEnabled);

  return (
    <ThemeWrapper theme={theme}>
      <ImageExifMetadata item={item} />
      <AutoSaveToggle />
      <SelectionCopyPopup />
    </ThemeWrapper>
  );
}

export default App;
