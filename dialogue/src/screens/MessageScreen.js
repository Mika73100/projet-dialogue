import { View, TouchableOpacity, Image, TextInput, Text, ImageBackground } from 'react-native'
import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Timestamp, addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { db } from '../../firebase/config';
import { AuthenticatedUserContext } from '../../context/AuthticationContext';

//même famille d'import que react-navigation 
import { useNavigation, useRoute } from '@react-navigation/native';


////////////////J'importe la photoprofile dans le cas ou l'user n à pas de photo.
const userAvatar = require('../../assets/profile.png')
const backImage = require("../../assets/fond-message.jpg");

const MessageScreen = () => {

  //je crée une const qui va récupérer les DATA recu par la page précédenter apres le click.
  const route = useRoute();
  const navigation = useNavigation();


  //je redéclare mes variables
  const { friendName, friendAvatar, firstFirstname } = route.params;
  const { user } = useContext(AuthenticatedUserContext);
  const [message, setMessage] = useState('');


  //ici je split l'email pour ne récuperer que le nom du debut.
  const sender = user.email.split('@')[0];
  const [allMessages, setAllMessages] = useState([])
  const flatListRef = useRef(null)


  //ici je crée une const dans le but d'accéder a la table chats
  const chatRef = collection(db, 'Chats')
  const queryResult1 = query(chatRef, where('chatters', '==', `${sender}xx${friendName}`))
  const queryResult2 = query(chatRef, where('chatters', '==', `${friendName}xx${sender}`))


  //ici j'utilise la fonction pour voir le nom de la personne avec qui je tchat:
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={30} color="white" />
          </TouchableOpacity>
          {friendAvatar === undefined ? (
            <Image source={userAvatar} style={{ height: 40, width: 40, borderRadius: 20 }} />
          ) : (
            <Image source={{ uri: friendAvatar }}
              style={{ height: 40, width: 40, borderRadius: 20 }}
            />
          )}
          <Text className="text-lg tracking-wide text-white">
            {friendName}
          </Text>
          <Text className="text-lg tracking-wide text-white">
            {firstFirstname}
          </Text>
        </View>
      )
    })
  });

  const HandleSubmit = async () => {
    //ici j'appel mon objets querySnapshot qui recupere les fonctionnalité de firebase 
    //pour aller recuperer avec getdocs les resultats de queryResult1
    const querySnapshot1 = await getDocs(queryResult1)
    const querySnapshot2 = await getDocs(queryResult2)

    //si querySnapshot1 ou querySnapshot2 n'est pas vide
    if (!querySnapshot1.empty || !querySnapshot2) {
      querySnapshot1.forEach((document) => {
        updateDoc(doc(db, 'Chats', document.id), {
          conversation: [
            ...document.data().conversation,
            {
              message: message,
              timestamp: Timestamp.now(),
              sende: sender
            }
          ]
        })
      })


      //ici c'est l'autre user qui démarre la conversation: 
      querySnapshot2.forEach((document) => {
        updateDoc(doc(db, 'Chats', document.id), {
          conversation: [
            ...document.data().conversation,
            {
              message: message,
              timestamp: Timestamp.now(),
              sende: sender
            }
          ]
        })
      })

      //cela signifie qu'une conversation existe déjà
    } else {
      await addDoc(chatRef, {
        chatters: `${sender}xx${friendName}`,
        conversation: [
          {
            message: message,
            timestamp: Timestamp.now(),
            sender: sender,
          }
        ]
      });
    }
  }


  //////////////////////////////ICI LA VUE//////////////////////////////////////

  return (
    <KeyboardAwareScrollView>
      <ImageBackground source={backImage} className="min-h-full">
        <View className="min-h-full justify-end relative">

          <View className="bg-blue-800 p-10">
            <View className="flex-row mb-20 bg-blue-800 ">
              <TextInput
                placeholder="Ecrire ici ..."
                multiline={true}
                keyboardType="default"
                value={message}
                onChangeText={setMessage}
                className="bg-white rounded-lg text-base tracking-widest w-[90%] py-2"
              />
              <TouchableOpacity onPress={HandleSubmit}>
                <MaterialCommunityIcons name="send-circle" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  )
}

export default MessageScreen






