import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {

  const navigation = useNavigation()
  const [username, setUsername] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userImageUrl, setImageUrl] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const { setUser, user, setUserAvatarUrl } = useContext(AuthenticatedUserContext)

  const UserRef = collection(db, 'Users')
  const queryResult = query(UserRef, where('email', '==',user.email))

  async function DocFinder(queryResult){
    const querySnapshot = await getDocs(queryResult)
    querySnapshot.forEach((doc) => {
      if (userEmail === '') {
        const {email, username} = doc.data()
        setUsername(username)
        setUserEmail(email)
      }
    })
  }

  useEffect(() => {
    if (!user) return
      DocFinder(queryResult)
  },[])

  //console.log('username =', username, 'et email -', userEmail);

  const Deconnexion = ()=>{
    signOut(auth).then(()=>{
      setUser(null)
      navigation.navigate('Login')
    }).catch((error)=>{
      Alert.alert('Error', error.message)
    })
  }

  return (
      <>
        <View className="flex justify-end px-4 pt-4">
          <View className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <Image className="w-24 h-24 mb-3 rounded-full shadow-lg bg-slate-500" alt="Bonnie image"/>
                <Text className="pt-4 mb-1 text-xl font-medium text-gray-900 dark:text-white">{username}</Text>
                <Text className="pt-4 text-sm text-gray-500 dark:text-gray-400">Visual Designer</Text>
            <View className="flex mt-4 space-x-3 md:mt-6">
            
            </View>
          </View>
        </View>

        <View className="flex justify-end px-4 pt-4">
          <View className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <Text className="pt-4 text-sm text-gray-500 dark:text-gray-400">Adresse</Text>
                <Text className="pt-4 text-sm text-gray-500 dark:text-gray-400">telephone</Text>
                <Text className="pt-4 text-sm text-gray-500 dark:text-gray-400">{userEmail}</Text>
                <Text className="pt-4 text-sm text-gray-500 dark:text-gray-400">lot numero</Text>
            <View className="flex mt-4 space-x-3 md:mt-6">
            
            </View>
          </View>
        </View>

      <View className="flex justify-end px-4 pt-4">
        <View className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
              <Text className="h-24 rounded-full shadow-lg bg-slate-500">Coucou</Text>
        </View>
      </View>
      <TouchableOpacity onPress={Deconnexion} className="bg-red-600 py-2 rounded-md mx-8 mt-6 mb-3">
              <Text className="text-center font-semibold text-white text-lg">
                logaout
              </Text>
      </TouchableOpacity>
    </>
  )
}

export default ProfileScreen