import { View, TouchableOpacity, Image, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { useNavigation } from "@react-navigation/native";
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { collection, getDocs,  query, where} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';


  const userAvatar = require("../../assets/profile.png")

  const HomeScreen = () => {
  const navigation = useNavigation();

  //ici je recupere des information via le context API
  const {user, userAvatrUrl, setUserAvatarUrl} = useContext(AuthenticatedUserContext);

  const [isLoading, setIsLoading] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>(
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          {!userAvatrUrl ? (
            <Image source={userAvatar} className='h-10 w-10 rounded-full' />
          ): (
            <Image source={{ uri:userAvatrUrl }} className='h-10 w-10 rounded-full' />
          )}
        </TouchableOpacity>
      ),

      headerLeft: () =>(
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          {!userAvatrUrl ? (
            <Ionicons name="search" size={24} color="white"><Text className='w-[80%] text-base py-2 px-1 mx-5 mb-5'>Search</Text></Ionicons>
          ): (
            <Image source={{ uri:userAvatrUrl }} className='h-10 w-10 rounded-full' />
          )}
        </TouchableOpacity>
      )
      
    })
  })

  const UserRef = collection(db, "Users");
  const queryResult = query( UserRef , where('email', '==', user.email));

  useEffect(() => {
    if (!user) return;
    async function DocFinder(queryResult) {
      const querySnapshot = await getDocs(queryResult);
      querySnapshot.forEach((doc) => {
        const {profilePic} = doc.data();
        setUserAvatarUrl(profilePic);
        });
      }
      DocFinder(queryResult);
    }, []);

  return (
    <>
    {isLoading ? (
      <View className='items-center justify-center h-full'>
        <ActivityIndicator size='large' color='red' />
      </View>
    ):(
      <FlatList />
    )}

    <View className='flex flex-row-reverse absolute bottom-[10%] right-[7%]'>
      <View>
        <TouchableOpacity onPress={()=> navigation.navigate('HelpScreen')} className='bg-orange-500 h-16 w-16 rounded-full items-center justify-center'>
          <Ionicons name="help" size={30} color="white" /><Text className='text-white'>Help</Text>
        </TouchableOpacity>
      </View>
    </View>

    </>
  )
}

export default HomeScreen