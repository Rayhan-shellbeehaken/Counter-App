import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CounterHomeScreen from '@/features/counters/screens/CounterHomeScreen';

const Tab = createBottomTabNavigator();
 
function getTabIcon(routeName, focused) {
  switch (routeName) {
    case 'Counters':
      return focused ? 'add-circle' : 'add-circle-outline';

    case 'Analytics':
      return focused ? 'bar-chart' : 'bar-chart-outline';

    case 'Goals':
      return focused ? 'flag' : 'flag-outline';

    case 'Settings':
      return focused ? 'settings' : 'settings-outline';

    default:
      return 'ellipse-outline';
  }
}
 
function createScreenOptions({ route }) {
  return {
    tabBarIcon: ({ focused = false, color = '#000', size = 24 }) => {
      const iconName = getTabIcon(route.name, focused);
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#000',
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
  };
}
 

function Placeholder({ title }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{title}</Text>
    </View>
  );
}
 

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={createScreenOptions}>
      <Tab.Screen name="Counters" component={CounterHomeScreen} />
      <Tab.Screen name="Analytics" children={() => <Placeholder title="Analytics" />} />
      <Tab.Screen name="Goals" children={() => <Placeholder title="Goals" />} />
      <Tab.Screen name="Settings" children={() => <Placeholder title="Settings" />} />
    </Tab.Navigator>
  );
}
