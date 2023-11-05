import { View, TouchableOpacity, Image, Text } from 'react-native'
import React from 'react'

const ChatItem = ({navigation, friend}) => {
  return (
    <TouchableOpacity>
      <View>
        <Image />
        <View>
            <Text>{friend.name}</Text>
            <Text>{friend.lastMessage[0]?.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ChatItem