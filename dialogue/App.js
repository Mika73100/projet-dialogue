import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    {/* Pour afficher la première page de navigation je met initialRouteName 
    et pour cacher le nom de page sur la page je met headershown a faux */}
      <Stack.Navigator initialRouteName='HomeScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
      </Stack.Navigator>
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}