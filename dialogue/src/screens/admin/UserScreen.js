import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser as deleteAuthUser } from 'firebase/auth';
import { auth, db } from '../../../firebase/config'; // Assurez-vous d'importer correctement votre configuration Firebase


const UserScreen = () => {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [copro, setCopro] = useState('');

    const fetchUsers = async () => {
        try {
            const userQuery = query(collection(db, 'Users'));
            const querySnapshot = await getDocs(userQuery);

            const userData = [];

            querySnapshot.forEach((document) => {
                const user = document.data();
                userData.push({
                    id: document.id,
                    email: user.email,
                    copro: user.copro,
                });
            });

            setUsers(userData);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
        }
    };

    useEffect(() => {
        // Chargez la liste des utilisateurs au chargement de la page
        fetchUsers();
    }, []);

    const createUser = () => {
        if (email === '' || password === '' || copro === '') {
            Alert.alert("Erreur", "Remplissez tous les champs");
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (res) => {
                    // Créez un document dans Firestore
                    await addDoc(collection(db, "Users"), {
                        email: res.user.email,
                        copro: copro,
                    });
                    console.log('Utilisateur créé avec succès.');
                    setEmail(''); // Réinitialisez les champs email et password
                    setPassword('');
                    setCopro('');
                    fetchUsers(); // Actualisez la liste des utilisateurs
                })
                .catch((error) => console.log(error.message));
        }
    }

    const deleteUser = async (userId, userEmail) => {
        try {
            const userDocRef = doc(db, 'Users', userId);
            // Supprimez le document de Firestore
            await deleteDoc(userDocRef);

            // Supprimez l'utilisateur de l'authentification Firebase
            const user = auth.currentUser;
            if (user && user.email === userEmail) {
                await deleteAuthUser(user);
            }

            console.log('Utilisateur supprimé avec succès.');
            fetchUsers(); // Actualisez la liste des utilisateurs
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Liste des Utilisateurs
            </Text>

            <TextInput
                placeholder="Email"
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 5,
                    marginBottom: 10,
                }}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Mot de passe"
                secureTextEntry={true}
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 5,
                    marginBottom: 10,
                }}
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                placeholder="N° de copro"
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 5,
                    marginBottom: 10,
                }}
                maxLength={5}
                value={copro}
                onChangeText={setCopro}
            />

            <TouchableOpacity
                onPress={createUser}
                style={{
                    backgroundColor: 'blue',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'white' }}>Créer un Utilisateur</Text>
            </TouchableOpacity>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: 'gray',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text>{item.email}</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    deleteUser(item.id, item.email); // Appeler votre fonction deleteUser pour supprimer de Firestore et Firebase Auth
                                }}
                                style={{
                                    backgroundColor: 'red',
                                    padding: 5,
                                    borderRadius: 3,
                                }}
                            >
                                <Text style={{ color: 'white' }}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default UserScreen;
