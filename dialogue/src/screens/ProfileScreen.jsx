import { View, Text, Image } from 'react-native'
import React from 'react'

const userAvatar = require("../../assets/profile.png")

const ProfileScreen = () => {
  return (
    <View>
      <Image source={userAvatar} className='h-10 w-10 rounded-full'/>
    </View>
  )
}

export default ProfileScreen