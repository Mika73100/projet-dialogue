import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { db } from '../../firebase/config';



/////////////// j'importe la photo /////////////
const userAvatar = require("../../assets/profile.png");
const message = require('../../assets/message.png')
const facture = require('../../assets/Facture.png')
const immeublecorpo = require('../../assets/immeublecorpo.png')


const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, userAvatarUrl, setUserAvatarUrl } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);


  //////////////////ici je recupere la copro/////////////////////
  const [copro, setCopro] = useState([]);
  const [code, setCode] = useState('');



  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          {!userAvatarUrl ? (
            <Image source={userAvatar} style={{ height: 40, width: 40, borderRadius: 20 }} />
          ) : (
            <Image source={{ uri: userAvatarUrl }} style={{ height: 40, width: 40, borderRadius: 20 }} />
          )}
        </TouchableOpacity>
      ),

      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      )
    });
  }, [navigation, userAvatarUrl]);

  useEffect(() => {
    if (!user) return;

    async function DocFinder(queryResult) {
      const querySnapshot = await getDocs(queryResult);
      querySnapshot.forEach((doc) => {
        const { profilePic, isadmin } = doc.data();
        setUserAvatarUrl(profilePic);

        if (isadmin) {
          setIsAdmin(true);
        }

        setIsLoading(false);
      });
    }

    const UserRef = collection(db, "Users");
    const queryResult = query(UserRef, where('email', '==', user.email));
    DocFinder(queryResult);
  }, [user, setUserAvatarUrl]);



  ////////////////////////////////ici la modification///////////////////////////



  const fetchCopro = async () => {
    try {
      const coproQuery = query(collection(db, 'Copro'));
      const querySnapshot = await getDocs(coproQuery);

      const coproData = [];

      querySnapshot.forEach((document) => {
        const copro = document.data();

        coproData.push({
          id: document.id,
          copro: copro, // Remplacez par le champ approprié
          code: code, // Utilisez le code de l'utilisateur ici
          // Autres champs de copropriété ici
        });
      });

      setCopro(coproData);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const CoproRef = collection(db, "Copro");
  const queResult = query(CoproRef, where('code', '==', user.email));
  useEffect(() => {
    fetchCopro(queResult); // Appel pour récupérer les copropriétés
  }, []);



  ///////////////////////////////////////////////////////////////////////////////



  return (
    <View style={{ flex: 1 }}>

      <TouchableOpacity onPress={() => navigation.navigate('ListFriends', {})}
        className="bg-orange-200 h-40 rounded-md mx-8 mt-10">
        <ImageBackground source={message} style="w-full h-full bg-red-400 text-gray-500">
          <Text className="text-center font-semibold text-white text-lg h-full">

          </Text>
        </ImageBackground>
      </TouchableOpacity>

      {isAdmin ? (

        <View>
        </View>
        
      ) :

        <View>
          <TouchableOpacity onPress={() => navigation.navigate('FactureScreenUser')}
            className="bg-amber-400 h-40 rounded-md mx-8 mt-10">
            <ImageBackground source={facture} style="w-full h-full bg-red-400 text-gray-500">
              <Text className="text-center font-semibold text-white text-lg h-full">
              </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('DocumentCopro')}
            className="bg-indigo-600 h-40 rounded-md mx-8 mt-10">
            <ImageBackground source={immeublecorpo} style="w-full h-full bg-red-400 text-gray-500">
              <Text className="text-center font-semibold text-white text-lg h-full">
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>}




      {
        /////////////////////////////////////////////////////////////////////////////
      }




      <View className='flex flex-row-reverse absolute bottom-[10%] right-[7%]'>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('HelpScreen')} className='bg-orange-500 h-16 w-16 rounded-full items-center justify-center'>
            <Ionicons name="help" size={25} color="white" /><Text className='text-white'>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isAdmin ? (
        <View className='flex flex-row-reverse absolute bottom-[10%] left-[7%]'>
          <TouchableOpacity onPress={() => navigation.navigate('AdminScreen')} style={{ backgroundColor: 'blue', height: 60, width: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="md-home-outline" size={25} color="white" />
            <Text style={{ color: 'white' }}>Admin</Text>
          </TouchableOpacity>
        </View>
      ) :

        <View className='flex flex-row-reverse absolute bottom-[10%] left-[7%]'>
          <TouchableOpacity onPress={() => navigation.navigate('FactureScreenUser')} style={{ backgroundColor: 'blue', height: 60, width: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="document-text-outline" size={25} color="white" />
            <Text style={{ color: 'white' }}>Facture</Text>
          </TouchableOpacity>
        </View>}
    </View>
  );
}

export default HomeScreen;















