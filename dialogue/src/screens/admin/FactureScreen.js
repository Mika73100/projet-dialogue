import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { db, UserRef } from '../../../firebase/config';
import * as DocumentPicker from 'expo-document-picker';
import { getDownloadURL, ref, uploadBytes, getStorage } from 'firebase/storage';
import { AuthenticatedUserContext } from '../../../context/AuthticationContext';


const FactureScreen = () => {
    
    const [users, setUsers] = useState([]);
    const storage = getStorage();
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { setUser, user, setUserAvatarUrl } = useContext(AuthenticatedUserContext);
    const [userImageUrl, setUserImageUrl] = useState(null);

    const queryResult = query(UserRef, where('email', '==', user.email));

    async function DocFinder(queryResult) {
        try {
            const querySnapshot = await getDocs(queryResult);
            querySnapshot.forEach((doc) => {
                if (!user.email) {
                    const { email, docfile } = doc.data();
                    setUser({ ...user, email });
                    setUserAvatarUrl(docfile);
                    setUserImageUrl(docfile);
                }
            });
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    }

    useEffect(() => {
        if (!user) return;
        DocFinder(queryResult);
    }, []);

    const pickPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: false, // Ne pas copier dans le répertoire de cache
              });

            if (!result.canceled) {
                setSelectedUserId(result.assets[0].uri);
                uploadPdf(selectedUserId, result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Taille de PDF excessif', error.message);
        }
    };

    const uploadPdf = async (userId, pdfFile) => {
        try {
            setIsLoading(true);

            const blob = await fetch(pdfFile).then((response) => response.blob());

            const filename = pdfFile.substring(pdfFile.lastIndexOf('/'));
            const pdfRef = ref(storage, `PDFs/${filename}`);

            await uploadBytes(pdfRef, blob);

            const downloadUrl = await getDownloadURL(pdfRef);

            const querySnapshot = await getDocs(queryResult);
            querySnapshot.forEach(async (document) => {
                try {
                    await updateDoc(doc(db, 'Users', document.id), {
                        facture: downloadUrl,
                    });
                } catch (error) {
                    Alert.alert('Erreur', error.message);
                }
            });

            setIsLoading(false);
            setSelectedUserId(null);
            fetchUsers();
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

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
                    // Autres champs d'utilisateur ici
                });
            });

            setUsers(userData);
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Liste des Utilisateurs
            </Text>

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
                                onPress={() => pickPdf(item.id)}
                                style={{
                                    backgroundColor: 'blue',
                                    padding: 5,
                                    borderRadius: 3,
                                    marginRight: 5,
                                }}
                            >
                                <Text style={{ color: 'white' }}>Ajouter PDF</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default FactureScreen;
