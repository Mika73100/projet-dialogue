import React, { useState } from 'react';
import { ImageBackground, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

const backImage = require("../../assets/immeuble-paris.jpg");

const LoginScreen = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const HandleLogin = () =>{
    if (email == "" || password === '') {
      Alert.alert('error', 'Remplissez tous les champs')
    }else{
      signInWithEmailAndPassword(auth, email, password).then(
        console.log("Connexion avec succes")
      );
    }
  }

  return (
    <KeyboardAwareScrollView>
        <ImageBackground source={backImage} className="object-cover h-screen w-full">
      <View className="flex-1 items-center justify-center">
          <Text className="text-yellow-400 text-3xl font-semibold text-center py-3 mt-3"> Connexion </Text>
          <TextInput
            className='mt-10 tracking-widest text-center bg-gray-100 opacity-90 rounded-lg w-[80%] text-base py-2 px-1 mx-5 mb-5'
            placeholder='Entrer votre email'
            autoCapitalize='none'
            value={email}
            keyboardType='email-address'
            textContentType='emailAddress'
            onChangeText={setEmail}
          />
          
          <TextInput
            className='tracking-widest text-center bg-gray-100 opacity-90 rounded-lg w-[80%] text-base py-2 px-1 mx-5 mb-5'
            placeholder='Entrer mot de passe'
            autoCapitalize='none'
            value={password}
            secureTextEntry={true}
            autoCorrect={false}
            textContentType='password'
            onChangeText={setPassword}
          />

          <View>
              <TouchableOpacity onPress={HandleLogin} className='mt-10 text-center bg-yellow-400 opacity-90 rounded-lg py-3 px-10'>
                <Text className='text-white'>Connexion</Text>
              </TouchableOpacity>
          </View>

          <View className='mt-5 text-400 text-2xl font-semibold text-center'>
            <Text className='text-center font-light tracking-wider'>Nouveau ici ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register') }>
                <Text className='font-semibold text-center'>Inscription</Text>
              </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  )
}

export default LoginScreen