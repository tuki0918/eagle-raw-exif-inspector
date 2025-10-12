import "@/App.css";
import ImageExifMetadata from "@/components/ImageExifMetadata";
import PreferencesSection from "@/components/PreferencesSection";
import SelectionCopyPopup from "@/components/SelectionCopyPopup";
import ThemeWrapper from "@/components/ThemeWrapper";
import { useEaglePlugin } from "@/hooks/useEaglePlugin";

function App() {
  const { theme, item } = useEaglePlugin();

  return (
    <ThemeWrapper theme={theme}>
      <ImageExifMetadata item={item} />
      <PreferencesSection />
      <SelectionCopyPopup />
    </ThemeWrapper>
  );
}

export default App;
