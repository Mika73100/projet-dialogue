import { View, Text } from 'react-native'
import React from 'react'

//même famille d'import que react-navigation 
import { useRoute } from '@react-navigation/native';


const MessageScreen = () => {

  //je crée une const qui va récupérer les DATA recu par la page précédenter apres le click.
  const route = useRoute();
  //je redéclare mes variables
  const {friendName, friendAvatar, friendEmail} = route.params;
  //console.log("nom: ", friendName);

  return (
    <View>
      <Text>MessageScreen</Text>
    </View>
  )
}

export default MessageScreen