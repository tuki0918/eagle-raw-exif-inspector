import "@/App.css";
import ImageExifMetadata from "@/components/ImageExifMetadata";
import PreferencesSection from "@/components/PreferencesSection";
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
      <PreferencesSection />
      <SelectionCopyPopup />
    </ThemeWrapper>
  );
}

export default App;
