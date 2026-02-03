import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
 
import CounterHomeScreen from "@/features/counters/screens/CounterHomeScreen";
 
export const TabOption = Object.freeze({
  COUNTER: "Counters",
  ANALYTICS: "Analytics",
  GOALS: "Goals",
  SETTINGS: "Settings",
});

 
function getTabIcon(routeName, focused) {
  switch (routeName) {
    case TabOption.COUNTER:
      return focused ? "add-circle" : "add-circle-outline";
    case TabOption.ANALYTICS:
      return focused ? "bar-chart" : "bar-chart-outline";
    case TabOption.GOALS:
      return focused ? "flag" : "flag-outline";
    case TabOption.SETTINGS:
      return focused ? "settings" : "settings-outline";
    default:
      return "ellipse-outline";
  }
}

function Placeholder({ route }) {
 
  const title = route.params?.title || "Default";
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{title}</Text>
    </View>
  );
}
 
const BottomTabs = createBottomTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      const iconName = getTabIcon(route.name, focused);
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: "#000",
    tabBarInactiveTintColor: "gray",
    headerShown: false,
  }),
  screens: {
    [TabOption.COUNTER]: {
      screen: CounterHomeScreen,
    },
    [TabOption.ANALYTICS]: {
      screen: Placeholder,
      initialParams: { title: "Analytics" },  
    },
    [TabOption.GOALS]: {
      screen: Placeholder,
      initialParams: { title: "Goals" },
    },
    [TabOption.SETTINGS]: {
      screen: Placeholder,
      initialParams: { title: "Settings" },
    },
  },
});
 
export const Navigation = createStaticNavigation(BottomTabs);
 
export default function TabNavigator() {
  return <Navigation />;
}