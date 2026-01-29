import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CounterHomeScreen from '@/features/counters/screens/CounterHomeScreen';   
const Tab = createBottomTabNavigator();

function Placeholder({ title }) {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>{title}</Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Counters') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Goals') {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Counters" component={CounterHomeScreen} />
      <Tab.Screen name="Analytics" children={() => <Placeholder title="Analytics" />} />
      <Tab.Screen name="Goals" children={() => <Placeholder title="Goals" />} />
      <Tab.Screen name="Settings" children={() => <Placeholder title="Settings" />} />
    </Tab.Navigator>
  );
}
