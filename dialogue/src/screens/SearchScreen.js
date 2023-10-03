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
  const HandleSearch = async() => {
    //si la barre de recherche est vide alors
    if (searchFriend === '') {
      //setSearchFriendName avec un tableau vide
      setSearchFriendName([])
      //Dans ce cas affiche une alerte avec un message.
      Alert.alert("Veuillez entrer un nom d'utilisateur")
    } else {
      setIsLoading(true);

      const UserRef = collection(db, 'Users')

      const queryResult = query(
        UserRef,
        where('lastname', '>=', searchFriend.trim()), 
        where('lastname', '<=', searchFriend.trim() + '\uf8ff'),
        )


      const querySnapshot = await getDocs(queryResult)
      //Si query Result n'est pas vide
      if (!querySnapshot.empty) {
        //alors = fiends tableau vide
        let friends = []
        //et a partir du docment je récupère les informations avec une boucle foreach
        querySnapshot.forEach((document)=> {
          const { profilePic, lastname, email} = document.data()
          //je push les elements recolté dans le tableau friends
          friends.push({profilePic, lastname, email})
        })
        //dans ce cas je recupère les élements et les stock dans la variable friends crée plus haut.
        setSearchFriendName(friends)
        //je met true puisque nous avons des élement.
        setFound(true)
      } else {
        setFound(false)
      }
      setIsLoading(false)
    }
  }

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
          <ActivityIndicator size={'large'} color='grey'/>
        ): found ?(
          <View>
            <FlatList 
              data={searchFriendName}
              key={(item)=>item.username}
              // Utilisation de VirtualizedList pour améliorer les performances
              // en limitant le rendu d'éléments à l'écran
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              renderItem={({item})=>(
                //ici dans le touchableOpacity j'envoie la navigation dans une autre page qui s'appel message.
                //apres la virgule j'expédit en mêmte temps du changement de page mes donnée dans la page cliqué.
                <TouchableOpacity onPress={() => navigation.navigate('Message',{
                  friendName: item.lastname,
                  friendAvatar: item.profilePic,
                  friendEmail: item.email
                })}>
                              <View className='flex-row items-center space-x-6 bg-gray-100 p-5 rounded-lg mx-2'>
                                  {item.profilePic !== undefined ? (
                                    <Image 
                                    source={{ uri: item.profilePic }}
                                    className='h-12 w-12 rounded-full'
                                    />
                                  ):(
                                    //mais si l'utilisateur n'a pas de photo de profile:
                                    <Image 
                                    source={{userAvatar}}
                                    className='h-12 w-12 rounded-full'
                                    />
                                  )}
                                  <Text className='text-lg tracking-widest text-gray-500'>{item.lastname}</Text>
                                  <Text className='text-lg tracking-widest text-gray-500'>{item.email}</Text>
                              </View>
                </TouchableOpacity>
              )}
            />
          </View>
        ):(
          <View className='items-center mx-5'>
            <Image source={gadget} className='h-auto w-auto lb-3' />
            <Text className='text-2xl font-bold text-gray-500'>Aucun utilisateur trouvé !</Text>
          </View>
        )
      }
    </View>
  )
}



export default SearchScreen