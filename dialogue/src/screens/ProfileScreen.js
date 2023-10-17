import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { UserRef, auth, db } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';


  const userAvatar = require("../../assets/profile.png")

  const ProfileScreen = () => {

  const navigation = useNavigation()
  const storage = getStorage()
  const [username, setUsername] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [adress, setAdress] = useState('');
  const [code, setCode] = useState('');
  const [bio, setBio] = useState('');

  const [isLoading, setIsLoading] = useState(false)
  const { setUser, user, setUserAvatarUrl } = useContext(AuthenticatedUserContext)
  const [userImageUrl, setUserImageUrl] = useState(null)


  //////////////////////ici la logique /////////////////////////////////////////

  const queryResult = query(UserRef, where('email', '==',user.email))

  async function DocFinder(queryResult){
    const querySnapshot = await getDocs(queryResult)
    querySnapshot.forEach((doc) => {
      if (userEmail === '') {
        const {email, username, firstname, phone, lastname, adress, code, profilePic, bio} = doc.data()
        setUsername(username)
        setUserEmail(email)
        setFirstname(firstname)
        setPhone(phone)
        setLastname(lastname)
        setAdress(adress)
        setCode(code)

        setUserAvatarUrl(profilePic)
        setUserImageUrl(profilePic)
        setBio(bio);
        //console.log(phone);
      }
    })
  }

  useEffect(() => {
    if (!user) return
      DocFinder(queryResult)
  },[])


  ////////////////////////////ici image picker /////////////////////////////////

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };


  const uploadImage = async (image) => {
    try {
      setIsLoading(true);

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          //console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });
    

      const filename = image.substring(image.lastIndexOf('/'));
      const imageRef = ref(storage, `ProfilePictures/${filename}`);

      uploadBytes(imageRef, blob).then(async () => {
        const downloadUrl = await getDownloadURL(imageRef);
        
        const querySnapshot = await getDocs(queryResult)
        querySnapshot.forEach(async (document)=>{
          await updateDoc(doc(db, 'Users', document.id),{
            profilePic: downloadUrl,
          }).then(()=> {
            setUserImageUrl(downloadUrl), setUserAvatarUrl(downloadUrl)
            setIsLoading(false)
          })
        })
      })
    } catch (error) {
      Alert.alert('error', error.message);
      setIsLoading(false);
    }
  }

////////////////////////////ici la bio /////////////////////////////////////////

const update = async () => {
  try {
    setIsLoading(true);

    const querySnapshot = await getDocs(queryResult);
   //console.log(querySnapshot);
    querySnapshot.forEach(async (document) => {
      //console.log(phone);
      await updateDoc(doc(db, 'Users', document.id), {
        bio: bio,
        phone: phone, // Update the 'bio' field with the new bio text
        firstname: firstname,
        lastname: lastname,
        adress: adress,
        code: code
      }).then(() => {
        setIsLoading(false);
        // Réinitialisez la valeur du texte bio après la sauvegarde réussie
        //setBio('');
      });
    });
  } catch (error) {
    Alert.alert('Error', error.message);
    setIsLoading(false);
  }
};


//////////////////////ici la deconnection //////////////////////////////////////

  const Deconnexion = ()=>{
    signOut(auth).then(()=>{
      setUser(null)
      navigation.navigate('Login')
    }).catch((error)=>{
      Alert.alert('Error', error.message)
    })
  };

  //console.log("userImageUrl =", userImageUrl)

  return (
    <KeyboardAwareScrollView>
        <View className="flex justify-end px-4 pt-4">
          <View className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
                  <TouchableOpacity onPress={pickImage} className="w-24 h-24 rounded-full">
                    {userImageUrl === null ? (
                      <Image source={userAvatar} className='w-24 h-24 rounded-full' />
                    ):isLoading ? (
                      <ActivityIndicator size='large' color='white'/>
                    ):(
                      <Image source={{ uri: userImageUrl }} className='w-24 h-24 rounded-full'/>
                    )}
                    
                  </TouchableOpacity>
                <Text className="pt-4 mb-1 text-xl font-medium text-gray-900 dark:text-white">{firstname} {lastname}</Text>
            <View className="flex mt-4 space-x-3 md:mt-6">
            
            </View>
          </View>
        </View>

        <View className="flex justify-end px-4 pt-4">
            <View className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">

                <TextInput 
                  className="pt-4 text-sm text-gray-500 dark:text-gray-400"
                  value={firstname}
                  onChangeText={(text) => setFirstname(text)}
                  placeholder={firstname ? firstname : "Enter your firstname..."}
                />

                <TextInput 
                  className="pt-4 text-sm text-gray-500 dark:text-gray-400"
                  value={lastname}
                  onChangeText={(text) => setLastname(text)}
                  placeholder={lastname ? lastname : "Enter your lastname..."}
                />

                <TextInput 
                  className="pt-4 text-sm text-gray-500 dark:text-gray-400"
                  value={adress}
                  onChangeText={(text) => setAdress(text)}
                  placeholder={adress ? adress : "Enter your adress..."}
                />
                
                <TextInput 
                  className="pt-4 text-sm text-gray-500 dark:text-gray-400"
                  value={phone}
                  keyboardType='numeric'
                  onChangeText={(text) => setPhone(text)}
                  placeholder={phone ? phone : "Enter your phone..."}
                />

                <Text className="pt-4 text-sm text-gray-500 dark:text-gray-400">Email: {userEmail}</Text>
                <Text className="pt-4 text-sm text-gray-500 dark:text-gray-400">Code de copro: {code}</Text>
            </View>
          </View>

      <View className="flex justify-end px-4 pt-4">
        <View className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
              <TextInput 
                className="h-24 p-5 text-sm text-gray-500 dark:text-gray-400"
                value={bio}
                onChangeText={(text) => setBio(text)}
                placeholder={bio ? bio : "Enter your bio..."}
                multiline
                numberOfLines={4}
              /> 


        </View>
      </View>

      <TouchableOpacity onPress={update} className="bg-blue-600 py-2 rounded-md mx-8 mt-5 mb-3">
              <Text className="text-center font-semibold text-white text-lg">
                Save
              </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={Deconnexion} className="bg-red-600 py-2 rounded-md mx-8 mt-5 mb-3">
              <Text className="text-center font-semibold text-white text-lg">
                Logout
              </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  )
}

export default ProfileScreen