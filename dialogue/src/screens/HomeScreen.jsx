import { View, TouchableOpacity, Image } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { signOut } from 'firebase/auth';
import { db, UserRef} from '../../firebase/config';
import { useNavigation } from "@react-navigation/native";
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { collection, getDocs,  query, where} from 'firebase/firestore';


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