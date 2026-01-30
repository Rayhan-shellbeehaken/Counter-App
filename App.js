import RootNavigator from "@/navigation/RootNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function App() {
  return (
    <GestureHandlerRootView>
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
