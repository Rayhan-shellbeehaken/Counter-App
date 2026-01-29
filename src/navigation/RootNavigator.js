import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CounterHomeScreen from '@/features/counters/screens/CounterHomeScreen';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Counters" component={CounterHomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
