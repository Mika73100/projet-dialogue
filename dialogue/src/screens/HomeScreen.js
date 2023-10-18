import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { db } from '../../firebase/config';

const userAvatar = require("../../assets/profile.png");

const HomeScreen = () => {
  const navigation = useNavigation();

  //Ici, je récupère des informations via le context API
  const { user, userAvatrUrl, setUserAvatarUrl } = useContext(AuthenticatedUserContext);

  const [isLoading, setIsLoading] = useState(true);
  
  //je crée le state de mon admin pour l'utiliser dans la visibilité de mon button.
  const [isAdmin, setIsAdmin] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          {!userAvatrUrl ? (
            <Image source={userAvatar} style={{ height: 40, width: 40, borderRadius: 20 }} />
          ) : (
            <Image source={{ uri: userAvatrUrl }} style={{ height: 40, width: 40, borderRadius: 20 }} />
          )}
        </TouchableOpacity>
      ),

      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      )
    });
  }, [navigation, userAvatrUrl]);

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

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' color='red' />
        </View>
      ) : (
        <FlatList
          // Ajoutez ici les données à afficher dans votre FlatList
        />
      )}

      <View className='flex flex-row-reverse absolute bottom-[10%] right-[7%]'>
        <View>
          <TouchableOpacity onPress={()=> navigation.navigate('HelpScreen')} className='bg-orange-500 h-16 w-16 rounded-full items-center justify-center'>
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
        <TouchableOpacity onPress={() => navigation.navigate('Facture')} style={{ backgroundColor: 'blue', height: 60, width: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="document-text-outline" size={25} color="white" />
            <Text style={{ color: 'white' }}>Facture</Text>
          </TouchableOpacity>
        </View>}
    </View>
  );
}


export default HomeScreen;
