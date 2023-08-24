import { View } from 'react-native'
import React from 'react'

const backImage = require("../../assets/immeuble-paris.jpg");

const Images = () => {
  return (
    <View>
      <Image source={backImage} className="object-cover h-80 w-full" />
    </View>
  )
}

export default Images




