import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../firebase/config';
import { getDocs, where, collection, query } from 'firebase/firestore';


const gadget = require('../../assets/inspec.png')
const userAvatar = require('../../assets/profile.png')


const SearchScreen = () => {
  const navigation = useNavigation();

  const [searchFriend, setSearchFriend] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [found, setFound] = useState(false)
  const [searchFriendName, setSearchFriendName] = useState([])


  //je travail avec firebase et donc il est possible que certain element mettes du temps a me parvenir 
  //alors je travail avec une fonction async
  const HandleSearch = async () => {
    if (searchFriend === '') {
      // Si la barre de recherche est vide, réinitialise les données et affiche une alerte.
      setSearchFriendName([]);
      Alert.alert("Veuillez entrer un nom d'utilisateur");
    } else {
      setIsLoading(true);

      const UserRef = collection(db, 'Users');
      const AdminRef = collection(db, 'Admin');

      // Création des requêtes pour rechercher dans les collections "Users" et "Admins".
      const userQuery = query(
        UserRef,
        where('lastname', '>=', searchFriend.trim()),
        where('lastname', '<=', searchFriend.trim() + '\uf8ff')
      );

      const adminQuery = query(
        AdminRef,
        where('lastname', '>=', searchFriend.trim()),
        where('lastname', '<=', searchFriend.trim() + '\uf8ff')
      );

      try {
        // Exécution des deux requêtes de manière asynchrone avec Promise.all.
        const [userSnapshot] = await Promise.all([
          getDocs(userQuery),
          getDocs(adminQuery)
        ]);

        let friends = [];

        // Traitement des résultats de la collection "Users".
        if (!userSnapshot.empty) {
          userSnapshot.forEach((document) => {
            const { profilePic, lastname, firstname, email } = document.data();
            friends.push({ profilePic, lastname, firstname, email });
          });
        }

        // Met à jour les données d'affichage avec les résultats.
        setSearchFriendName(friends);
        setFound(friends.length > 0);
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
      }

      setIsLoading(false);
    }
  };


  //console.log("list des utilisateurs", searchFriendName)

  return (
    <View className='bg-gray-200 flex-1'>
      <View className='flex-row items-center m-3 mb-10'>
        <TextInput
          className='tracking-widest bg-gray-100 rounded-lg text-base py-2 px-1 mx-2 w-[85%]'
          onSubmitEditing={HandleSearch}
          placeholder="Rechercher un nom d'utilisateur"
          autoCapitalize='characters'
          keyboardType='default'
          value={searchFriend}
          onChangeText={setSearchFriend}
          textContentType='name'
        />
        <TouchableOpacity
          className='bg-orange-500 w-10 h-11 rounded-lg items-center justify-center'
          onPress={HandleSearch} >
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {
        isLoading ? (
          <ActivityIndicator size={'large'} color='grey' />
        ) : found ? (
          <View>
            <FlatList
              data={searchFriendName}
              key={(item) => item.username}
              // Utilisation de VirtualizedList pour améliorer les performances
              // en limitant le rendu d'éléments à l'écran
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              renderItem={({ item }) => (
                //ici dans le touchableOpacity j'envoie la navigation dans une autre page qui s'appel message.
                //apres la virgule j'expédit en mêmte temps du changement de page mes donnée dans la page cliqué.
                <TouchableOpacity onPress={() => navigation.navigate('Message', {
                  friendName: item.lastname,
                  friendAvatar: item.profilePic,
                  friendEmail: item.email,
                  firstName: item.firstname
                })}>
                  <View className='flex-row items-center space-x-6 bg-white border border-gray-200 p-5 rounded-lg mx-2 mb-5'>
                    {item.profilePic !== undefined ? (
                      <Image
                        source={{ uri: item.profilePic }}
                        className='h-12 w-12 rounded-full'
                      />
                    ) : (
                      //mais si l'utilisateur n'a pas de photo de profile:
                      <Image
                        source={{ userAvatar }}
                        className='h-12 w-12 rounded-full'
                      />
                    )}
                    <View><Text className='text-lg tracking-widest text-gray-500'>{item.lastname} </Text>
                      <View><Text className='text-lg tracking-widest text-gray-500'>{item.firstname} </Text></View>
                      <View><Text className='text-lg tracking-widest text-gray-500'>{item.email}</Text></View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <View className='items-center mx-5'>
            <Text className='text-2xl font-bold text-gray-500'>Aucun utilisateur trouvé !</Text>
            <Image source={gadget} className='h-30 w-25' />

          </View>
        )
      }
    </View>
  )
}



export default SearchScreen