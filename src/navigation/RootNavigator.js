import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';

const defaultProps = {};
 
export default function RootNavigator() {
  return renderNavigationContainer();
}

const renderNavigationContainer = () => (
  <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
);
