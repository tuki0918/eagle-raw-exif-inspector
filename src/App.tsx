import "@/App.css";
import ImageExifMetadata from "@/components/ImageExifMetadata";
import ThemeWrapper from "@/components/ThemeWrapper";
import { useEaglePlugin } from "@/hooks/useEaglePlugin";

function App() {
  const { theme, item } = useEaglePlugin();

  return (
    <ThemeWrapper theme={theme}>
      <ImageExifMetadata item={item} />
    </ThemeWrapper>
  );
}

export default App;
