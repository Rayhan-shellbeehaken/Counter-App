// src/navigation/TabNavigator.js

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import CounterHomeScreen from '@/features/counters/screens/CounterHomeScreen';
import AnalyticsScreen from '@/features/analytics/screens/AnalyticsScreen';
import GoalsScreen from '@/features/goals/screens/GoalsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

 
export const TabOption = Object.freeze({
  COUNTER: 'Counters',
  ANALYTICS: 'Analytics',
  GOALS: 'Goals',
  SETTINGS: 'Settings',
});

 
const defaultProps = {
  routeName: TabOption.COUNTER,
  focused: false,
  color: '#000',
  size: 24,
};

 
const getTabIcon = (
  routeName = defaultProps.routeName,
  focused = defaultProps.focused
) => {
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
};
 
const renderTabIcon = (
  routeName,
  focused,
  color,
  size
) => {
  const iconName = getTabIcon(routeName, focused);
  return <Ionicons name={iconName} size={size} color={color} />;
};
 
const createScreenOptions = ({ route = {} } = {}) => ({
  tabBarIcon: ({
    focused = defaultProps.focused,
    color = defaultProps.color,
    size = defaultProps.size,
  }) => renderTabIcon(route.name, focused, color, size),

  tabBarActiveTintColor: '#000',
  tabBarInactiveTintColor: 'gray',
  headerShown: false,
});

 
export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={createScreenOptions}>
      <Tab.Screen
        name={TabOption.COUNTER}
        component={CounterHomeScreen}
      />

      <Tab.Screen
        name={TabOption.ANALYTICS}
        component={AnalyticsScreen}
      />

      <Tab.Screen
        name={TabOption.GOALS}
        component={GoalsScreen} // placeholder for now
      />

      <Tab.Screen
        name={TabOption.SETTINGS}
        component={SettingsScreen} // placeholder for now
      />
    </Tab.Navigator>
  );
}
