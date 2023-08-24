import React, { useState } from 'react';
import { ImageBackground, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

const backImage = require("../../assets/immeuble-paris-nuit.jpg");

const RegisterScreen = () => {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confimPassword, setConfirmPassword] = useState('');
    
    const HandleRegister = () => {
        if(email === '' || password === '' || confimPassword ==='' ){
            Alert.alert("error", "Remplissez tous les champs")
        }
        else if (password !== confimPassword) {
            Alert.alert('Error', 'les mots de passes ne sont pas identiques')
        }
        else {
            createUserWithEmailAndPassword(auth, email, password).then(
                console.log('Utilisateur crée avec succes')
            );
        }
    }

    return (
        <KeyboardAwareScrollView>
            <ImageBackground source={backImage} className="object-cover h-screen w-full">
                <View className="flex-1 items-center justify-center">
                    <Text className="text-yellow-400 text-3xl font-semibold text-center py-3 mt-3"> Inscription </Text>
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

                    <TextInput
                        className='tracking-widest text-center bg-gray-100 opacity-90 rounded-lg w-[80%] text-base py-2 px-1 mx-5 mb-5'
                        placeholder='Confirmation de mot de passe'
                        autoCapitalize='none'
                        value={confimPassword}
                        secureTextEntry={true}
                        autoCorrect={false}
                        textContentType='password'
                        onChangeText={setConfirmPassword}
                    />
                    

                    <View>
                        <TouchableOpacity onPress={HandleRegister} className='mt-10 text-center bg-yellow-400 opacity-90 rounded-lg py-3 px-10'>
                            <Text className='text-white'>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='mt-5 text-400 text-2xl font-semibold text-center'>
                        <Text className='font-light tracking-wider text-white text-center'>Déjà inscrit ?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login') }>
                            <Text className='font-semibold text-white text-center'>Connexion</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    )
}

export default RegisterScreen