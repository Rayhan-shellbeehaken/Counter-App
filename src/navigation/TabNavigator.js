import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 
import CounterHomeScreen from '@/features/counters/screens/CounterHomeScreen';
import { Text, View } from 'react-native';

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
    <Tab.Navigator>
      <Tab.Screen name="Counters" component={CounterHomeScreen} />
      <Tab.Screen name="Analytics" children={() => <Placeholder title="Analytics" />} />
      <Tab.Screen name="Goals" children={() => <Placeholder title="Goals" />} />
      <Tab.Screen name="Settings" children={() => <Placeholder title="Settings" />} />
    </Tab.Navigator>
  );
}
