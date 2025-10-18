import "@/App.css";
import ImageExifMetadata from "@/components/ImageExifMetadata";
import Loading from "@/components/Loading";
import SelectionCopyPopup from "@/components/SelectionCopyPopup";
import ThemeWrapper from "@/components/ThemeWrapper";
import { useEaglePlugin } from "@/hooks/useEaglePlugin";

function App() {
  const { theme, item, isLoading } = useEaglePlugin();

  return (
    <ThemeWrapper theme={theme}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ImageExifMetadata item={item} />
          <SelectionCopyPopup />
        </>
      )}
    </ThemeWrapper>
  );
}

export default App;
