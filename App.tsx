import AppNavigator from "./navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SpiderVerseProvider } from "./context/SpiderVerseContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SpiderVerseProvider>
          <AppNavigator />
        </SpiderVerseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
