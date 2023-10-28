import { Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticatedUserProvider, { AuthenticatedUserContext } from './context/AuthticationContext';
import { useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';


///////////////////////////////////////////////////////////
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';


////////////////////////SCREEN USER///////////////////////
import ProfileScreen from './src/screens/ProfileScreen';
import HelpScreen from './src/screens/HelpScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FactureScreenUser from './src/screens/FactureScreenUser';
import DocumentCopro from './src/screens/DocumentCopro';
import MessageScreen from './src/screens/MessageScreen';


////////////////////ADMIN///////////////////////////////
import AdminScreen from './src/screens/admin/AdminScreen';
import DocumentScreen from './src/screens/admin/DocumentScreen';
import FactureScreen from './src/screens/admin/FactureScreen';
import UserScreen from './src/screens/admin/UserScreen';



const loadingGIF = require("./assets/loading.gif");
const Stack = createNativeStackNavigator();


function AuthStack() {

  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  
  return(
    <Stack.Navigator>
        <Stack.Screen options={{ 
        headerTitle:'Connect City',
        headerTintColor:'#ffffff',
        headerTitleStyle: { fontWeight: 'bold'},
        headerStyle:{backgroundColor:'blue'}, 
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name= 'HomeScreen'
        component={HomeScreen}  />

      <Stack.Screen options={{
        headerTitle: 'Help',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'blue' },
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name='HelpScreen'
        component={HelpScreen} />


      <Stack.Screen options={{
        headerTitle: 'Profile',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'blue' },
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name='ProfileScreen'
        component={ProfileScreen} />


      <Stack.Screen options={{
        headerTitle: 'Search',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'blue' },
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name='SearchScreen'
        component={SearchScreen} />


      <Stack.Screen options={{
        headerTitle: '',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'blue' },
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name='MessageScreen'
        component={MessageScreen} />

      <Stack.Screen options={{
        headerTitle: 'Factures',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'blue' },
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name='FactureScreenUser'
        component={FactureScreenUser} />

      <Stack.Screen options={{
        headerTitle: 'Documents',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'blue' },
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name='DocumentCopro'
        component={DocumentCopro} />


      {/* ////////////////////////ICI PAGES ADMIN//////////////////////// */}


      <Stack.Screen options={{
        headerTitle: 'Admin',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'black' },
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name='AdminScreen'
        component={AdminScreen} />


      <Stack.Screen options={{
        headerTitle: 'Documents',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'black' },
        headerShown: true,
        headerBackTitleVisible: false, // Définir un espace vide comme titre de l'écran précédent
        }}
        name='DocumentScreen'
        component={DocumentScreen} />


      <Stack.Screen options={{
        headerTitle: 'Factures',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'black' },
        headerShown: true,
        headerBackTitleVisible: false,
        }}
        name='FactureScreen'
        component={FactureScreen} />


      <Stack.Screen options={{
        headerTitle: 'Users',
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: { backgroundColor: 'black' },
        headerShown: true,
        headerBackTitleVisible: false,
        }}
        name='UserScreen'
        component={UserScreen} />

    </Stack.Navigator>

  )
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user)=>{
      if(user)
      
      { setUser(user)
        //console.log(user)
      setIsLoading(false)}
      else{
        setIsLoading(false);
      }
    });
    
  }, []);
  

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