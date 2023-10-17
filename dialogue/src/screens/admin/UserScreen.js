// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList } from 'react-native';
// import { collection, query, getDocs } from 'firebase/firestore';
// import { db } from '../../../firebase/config';

// const UserScreen = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         // Fonction pour récupérer les utilisateurs depuis Firestore
//         const fetchUsers = async () => {
//             try {
//                 // Créez une requête pour récupérer tous les utilisateurs dans la collection "Users"
//                 const userQuery = query(collection(db, 'Users'));

//                 // Exécutez la requête et obtenez un snapshot des documents
//                 const querySnapshot = await getDocs(userQuery);

//                 const userData = [];

//                 // Parcourez chaque document du snapshot
//                 querySnapshot.forEach((document) => {
//                     // Obtenez les données de l'utilisateur depuis le document
//                     const user = document.data();

//                     // Ajoutez les données de l'utilisateur à un tableau
//                     userData.push({
//                         id: document.id, // ID du document
//                         firstname: user.firstname, // Prénom de l'utilisateur
//                         lastname: user.lastname, // Nom de l'utilisateur
//                         // Ajoutez d'autres champs utilisateur ici
//                     });
//                 });

//                 // Mettez à jour l'état avec les données des utilisateurs
//                 setUsers(userData);
//             } catch (error) {
//                 console.error('Erreur lors de la récupération des utilisateurs :', error);
//             }
//         };

//         // Appelez la fonction pour récupérer les utilisateurs au chargement du composant
//         fetchUsers();
//     }, []);

//     return (
//         <View>
//             <Text>Liste des Utilisateurs :</Text>
//             <FlatList
//                 data={users}
//                 keyExtractor={(item) => item.id} // Utilisez l'ID comme clé unique
//                 renderItem={({ item }) => (
//                     <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
//                         <Text>{item.firstname} {item.lastname}</Text>
//                         {/* Ajoutez d'autres champs utilisateur ici */}
//                     </View>
//                 )}
//             />
//         </View>
//     );
// };

// export default UserScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';


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
                    password: user.password,
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
        if(email === '' || password === '' || copro === ''){
            Alert.alert("Erreur", "Remplissez tous les champs")
        }
        else {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (res) => {
                    await addDoc(collection(db, "Users"), {
                        userId: res.user.uid,
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

    const deleteUser = async (userId) => {
        try {
            const userDocRef = doc(db, 'Users', userId);
            await deleteDoc(userDocRef);
            console.log('Utilisateur supprimé avec succès.');
            fetchUsers(); // Actualisez la liste des utilisateurs
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
    };

    // const updateUser = async (userId, updatedUserData) => {
    //     try {
    //         const userDocRef = doc(db, 'Users', userId);
    //         await updateDoc(userDocRef, updatedUserData);
    //         console.log('Utilisateur mis à jour avec succès.');
    //         fetchUsers(); // Actualisez la liste des utilisateurs
    //     } catch (error) {
    //         console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    //     }
    // };

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
                placeholder="N° de corpo"
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
                            {/* <TouchableOpacity
                                onPress={() => updateUser(item.id, { email: 'nouveau@email.com', password: 'nouveaumdp' })}
                                style={{
                                    backgroundColor: 'green',
                                    padding: 5,
                                    borderRadius: 3,
                                    marginRight: 5,
                                }}
                            >
                                <Text style={{ color: 'white' }}>Modifier</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity
                                onPress={() => deleteUser(item.id)}
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


