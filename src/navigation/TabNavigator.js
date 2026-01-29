import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CounterHomeScreen from '@/features/counters/screens/CounterHomeScreen';

const Tab = createBottomTabNavigator();

 

export const TabOption = Object.freeze({
  COUNTER: 'Counters',
  ANALYTICS: 'Analytics',
  GOALS: 'Goals',
  SETTINGS: 'Settings',
});

 

function getTabIcon(routeName=' ', focused = false) {
  switch (routeName) {
    case TabOption.COUNTER:
      return focused ? 'add-circle' : 'add-circle-outline';

    case TabOption.ANALYTICS:
      return focused ? 'bar-chart' : 'bar-chart-outline';

    case TabOption.GOALS:
      return focused ? 'flag' : 'flag-outline';

    case TabOption.SETTINGS:
      return focused ? 'settings' : 'settings-outline';

    default:
      return 'ellipse-outline';
  }
}

function createScreenOptions({ route = {} } = {}){
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

 

function Placeholder({ title = '' } = {}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{title}</Text>
    </View>
  );
}

 

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={createScreenOptions}>
      <Tab.Screen name={TabOption.COUNTER} component={CounterHomeScreen} />
      <Tab.Screen name={TabOption.ANALYTICS} children={() => <Placeholder title="Analytics" />} />
      <Tab.Screen name={TabOption.GOALS} children={() => <Placeholder title="Goals" />} />
      <Tab.Screen name={TabOption.SETTINGS} children={() => <Placeholder title="Settings" />} />
    </Tab.Navigator>
  );
}
