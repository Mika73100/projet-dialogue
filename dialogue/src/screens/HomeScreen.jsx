import { View, TouchableOpacity, Image } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigation } from "@react-navigation/native";


const userAvatar = require("../../assets/profile.png")
const HomeScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>(
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Image source={userAvatar} className='h-10 w-10 rounded-full'/>
        </TouchableOpacity>
      )
    })
  })


  return (
    <View className=''>
      <TouchableOpacity>

      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen