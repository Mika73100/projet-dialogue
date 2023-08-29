import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

const HomeScreen = () => {
  return (
    <View className=''>
      <TouchableOpacity onPress={() => signOut(auth)}>
        <Text>
          Deconnexion
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen