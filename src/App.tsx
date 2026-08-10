import "@/App.css";
import ImageExifMetadata from "@/components/ImageExifMetadata";
import SelectionCopyPopup from "@/components/SelectionCopyPopup";
import ThemeWrapper from "@/components/ThemeWrapper";
import { useEaglePlugin } from "@/hooks/useEaglePlugin";

function App() {
  const { theme, item, itemId } = useEaglePlugin();

  return (
    <ThemeWrapper theme={theme}>
      <ImageExifMetadata item={item} itemId={itemId} />
      <SelectionCopyPopup />
    </ThemeWrapper>
  );
}

export default App;
