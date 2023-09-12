import { View, TouchableOpacity, Image, Text } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { db, UserRef} from '../../firebase/config';
import { useNavigation } from "@react-navigation/native";
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { collection, getDocs,  query, where} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';


  const userAvatar = require("../../assets/profile.png")

  const HomeScreen = () => {
  const navigation = useNavigation();

  //ici je recupere des information via le context API
  const {user, userAvatrUrl, setUserAvatarUrl} = useContext(AuthenticatedUserContext)

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
        <TouchableOpacity onPress={() => navigation.navigate('HelpScreen')}>
          {!userAvatrUrl ? (
            <Ionicons name="help" size={24} color="white"><Text className='w-[80%] text-base py-2 px-1 mx-5 mb-5'>Help</Text></Ionicons>
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
    <View className=''>
      <TouchableOpacity>

      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen