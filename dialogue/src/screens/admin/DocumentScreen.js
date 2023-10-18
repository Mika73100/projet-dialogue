import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import * as DocumentPicker from 'expo-document-picker';

const CoproScreen = () => {
    const [copro, setCopro] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour récupérer les copropriétés
    const fetchCopro = async () => {
        try {
            const coproQuery = query(collection(db, 'Copro'));
            const querySnapshot = await getDocs(coproQuery);

            const coproData = [];

            querySnapshot.forEach((document) => {
                const copro = document.data();
                coproData.push({
                    id: document.id,
                    copro: copro.copro, // Remplacez par le champ approprié
                    // Autres champs de copropriété ici
                });
            });

            setCopro(coproData);
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    useEffect(() => {
        fetchCopro(); // Appel pour récupérer les copropriétés
    }, []);

    const pickPdf = async (coproId) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: false,
            });

            if (!result.canceled) {
                // Vous pouvez téléverser le PDF à la copropriété ici
                // Utilisez coproId pour associer le PDF à la copropriété
                setIsLoading(true);
                // Téléversement du PDF...
                setIsLoading(false);
            }
        } catch (error) {
            Alert.alert('Taille de PDF excessif', error.message);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Liste des Copropriétés
            </Text>

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
                        <Text>{item.copro}</Text>

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
                                <Text style={{ color: 'white' }}>Ajouter PDF </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default CoproScreen;
