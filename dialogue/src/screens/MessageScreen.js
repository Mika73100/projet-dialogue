import { FlatList, View, TouchableOpacity, Image, TextInput, Text, ScrollView } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Timestamp, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { db } from '../../firebase/config';
import { AuthenticatedUserContext } from '../../context/AuthticationContext';

//même famille d'import que react-navigation 
import { useNavigation, useRoute } from '@react-navigation/native';
import MessageItem from '../components/MessageItem';


////////////////J'importe la photoprofile dans le cas ou l'user n à pas de photo.
const userAvatar = require('../../assets/profile.png')


const MessageScreen = () => {

  //je crée une const qui va récupérer les DATA recu par la page précédente après le click.
  const route = useRoute();
  const navigation = useNavigation();


  //je redéclare mes variables
  const { friendName, friendAvatar, firstFirstname } = route.params;
  const { user } = useContext(AuthenticatedUserContext);
  const [message, setMessage] = useState('');


  //ici je split l'email pour ne récuperer que le nom du debut.
  const sender = user.email.split('@')[0];
  //je crée une variable qui prendra en compte tous les messages et qui démarre en tableau a l'état initial vide.
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

  useEffect(() => {

    //ici je cherche a aller chercher mes messages avec getDocs qui fait partie de firebase.
    const fetchMessages = async () => {
      const querySnapshot1 = await getDocs(queryResult1)
      const querySnapshot2 = await getDocs(queryResult2)

      //ici je demande si querySnapshot1 n'est pas vide ( pareil pour le 2)
      if (!querySnapshot1.empty || !querySnapshot2.empty) {
        //je crée la variable messages et je boucle avec map sur conversation puis je la stock dans messages.
        let messages = querySnapshot1.docs.map((doc) => doc.data().conversation)
        messages = messages.concat(
          querySnapshot2.docs.map((doc) => doc.data().conversation)
        )
        //ici j'utilise la fonction sort qui permet de trié un tableau, ici j'utilise le champs timestamp en seconds pour le faire.
        messages = messages.sort((message1, message2) => message1.timestamp?.seconds - message2.timestamp?.seconds)
        //ici j'utilise setAllMessages pour set mes messages par ordres.
        setAllMessages(messages)
      }
    };

    //ici je suis surveillé en permanance soit par queryResult1 qui est un utilisateur,
    //ou bien queryResult2 qui es un second utilisateur.... firebase utilise onSnapshot pour aller chercher 
    // le message qui à été envoyer et va le stocker dans setAllMessages.
    const unsub1 = onSnapshot(queryResult1, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data().conversation)
      setAllMessages(messages)
    })

    const unsub2 = onSnapshot(queryResult2, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data().conversation)
      setAllMessages(messages)
    })

    //j'utilise ma fonction:
    fetchMessages()
    return () => {
      unsub1()
      unsub2()
    }
    //ici je demande a mon useEffect de lancer la function qu'une seule fois.
  }, []);

  //console.log('tous les messages ', JSON.stringify(allMessages, null, 2))


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
    setMessage("")
  }


  //////////////////////////////ICI LA VUE//////////////////////////////////////

  return (
    <View className=" flex-1 m-5 bg rounded-lg">
      {allMessages[0] !== undefined && (
        <View className="flex-1 rounded-lg">
          <FlatList
            className='rounded-lg'
            data={allMessages[0]}
            ref={flatListRef}
            //graçe a cette ligne je vais demander au text input de scrowler jusqu'au dernier message.
            onContentSizeChange={() => flatListRef?.current?.scrollToEnd({ animated: true })}
            initialNumToRender={10}
            keyExtractor={(item) => item.timestamp}
            renderItem={({ item }) => (
              <MessageItem item={item} sender={sender} />
            )}
          />
        </View>
      )}
      <View className=" flex-row align-center m-5 bg-white rounded-lg">
        <TextInput
          className='bg-white'
          placeholder=" Écrire ici..."
          multiline={true}
          keyboardType="default"
          value={message}
          onChangeText={setMessage}
          style={{ flex: 1, backgroundColor: 'white', borderRadius: 8, fontSize: 16 }}
        />
        <TouchableOpacity onPress={HandleSubmit} style={{ width: 80, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="send-circle" size={40} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen