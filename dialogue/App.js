import { Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AuthenticatedUserProvider, { AuthenticatedUserContext } from './context/AuthticationContext';
import { useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import ProfileScreen from './src/screens/ProfileScreen';
import FactureScreen from './src/screens/FactureScreen';
import HelpScreen from './src/screens/HelpScreen';


const loadingGIF = require("./assets/loading.gif");
const Stack = createNativeStackNavigator();

function AuthStack(){
  return(
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack(){
  return(
    <Stack.Navigator>
        <Stack.Screen options={{ 
        headerTitle:'Connect City',
        headerTintColor:'#ffffff',
        headerTitleStyle: { fontWeight: 'bold'},
        headerStyle:{backgroundColor:'blue'}, 
        headerShown: true,
        }}
        name= 'HomeScreen'
        component={HomeScreen}  />

        <Stack.Screen options={{ 
        headerTitle:'Facture',
        headerTintColor:'#ffffff',
        headerTitleStyle: { fontWeight: 'bold'},
        headerStyle:{backgroundColor:'blue'}, 
        headerShown: true,
        }}
        name= 'FactureScreen'
        component={FactureScreen}  />

        <Stack.Screen options={{ 
        headerTitle:'Help',
        headerTintColor:'#ffffff',
        headerTitleStyle: { fontWeight: 'bold'},
        headerStyle:{backgroundColor:'blue'}, 
        headerShown: true,
        }}
        name= 'HelpScreen'
        component={HelpScreen}  />
      

      <Stack.Screen options={{
        headerTitle:'Profile',
        headerTintColor:'#ffffff',
        headerTitleStyle: { fontWeight: 'bold'},
        headerStyle:{backgroundColor:'blue'},
        headerShown: true,
        }}
        name='ProfileScreen' 
        component={ProfileScreen} />
    </Stack.Navigator>
    
  )
}

function RootNavigator(){
  const { user, setUser } = useContext(AuthenticatedUserContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user)=>{
      if(user)
      { setUser(user)
      setIsLoading(false)}
      else{
          setIsLoading(false)
      }
    })
  }, [])

  //console.log('utilisateur =', user);

  return (
    <NavigationContainer>
      {isLoading === true && !user ?(
        <Image source={loadingGIF} className='my-40 h-max w-max'/>
      ): isLoading === false && !user? (
        <AuthStack />
      ):(<MainStack />)}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
        <RootNavigator />
        <StatusBar style='auto' />
    </AuthenticatedUserProvider>
  );
}