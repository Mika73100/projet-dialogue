import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import ButtonGroup from '../../components/ButtonGroup'

const CoproScreen = () => {
    const navigation = useNavigation();
    const [copro, setCopro] = useState([]);
    const [coproName, setCoproName] = useState('');
    const [coproCode, setCoproCode] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const fetchCopro = async () => {
        try {
            const coproQuery = query(collection(db, 'Copro'));
            const querySnapshot = await getDocs(coproQuery);

            const coproData = [];

            querySnapshot.forEach((document) => {
                const copro = document.data();
                coproData.push({
                    id: document.id,
                    name: copro.copro,
                    code: copro.code,
                });
            });

            setCopro(coproData);
        } catch (error) {
            console.error('Erreur lors de la récupération des copropriétés :', error);
        }
    };

    useEffect(() => {
        // Chargez la liste des copropriétés au chargement de la page
        fetchCopro();
    }, []);

    const addCopro = () => {
        if (coproName === '' || coproCode === '') {
            Alert.alert("Erreur", "Remplissez tous les champs");
        } else {
            addDoc(collection(db, "Copro"), {
                copro: coproName,
                code: coproCode,
                image: imageUri, // Ajoutez l'URI de l'image
            })
            .then(() => {
                console.log('Copropriété ajoutée avec succès.');
                setCoproName('');
                setCoproCode('');
                setImageUri(null); // Réinitialisez l'image
                fetchCopro(); // Actualisez la liste des copropriétés
            })
            .catch((error) => console.log(error.message));
        }
    }

    const deleteCopro = async (coproId) => {
        try {
            const coproDocRef = doc(db, 'Copro', coproId);
            // Supprimez le document de Firestore
            await deleteDoc(coproDocRef);

            console.log('Copropriété supprimée avec succès.');
            fetchCopro(); // Actualisez la liste des copropriétés
        } catch (error) {
            console.error('Erreur lors de la suppression de la copropriété :', error);
        }
    };

    return (
      
        <View style={{ flex: 1, padding: 20 }}>
          <ButtonGroup />
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Liste des Copropriétés
            </Text>

            <TextInput
                placeholder="Nom de la copropriété"
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 5,
                    marginBottom: 10,
                }}
                value={coproName}
                onChangeText={setCoproName}
            />

            <TextInput
                placeholder="Code de la copropriété"
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 5,
                    marginBottom: 10,
                }}
                value={coproCode}
                onChangeText={setCoproCode}
            />

            {imageUri && (
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginBottom: 10 }} />
            )}

            <TouchableOpacity
                onPress={pickImage}
                style={{
                    backgroundColor: 'green',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    margin: 10,
                }}
            >
                <Text style={{ color: 'white' }}>Choisir une image</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={addCopro}
                style={{
                    backgroundColor: 'blue',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    margin: 10,
                }}
            >
                <Text style={{ color: 'white' }}>Ajouter une Copropriété</Text>
            </TouchableOpacity>

            <FlatList
                data={copro}
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
                        <Text>{item.name} (Code: {item.code})</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    deleteCopro(item.id); // Appeler votre fonction deleteCopro pour supprimer de Firestore
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

export default CoproScreen;
