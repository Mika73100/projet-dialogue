import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, query, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import * as DocumentPicker from 'expo-document-picker';
import { getDownloadURL, ref, uploadBytes, getStorage } from 'firebase/storage';

const DocumentScreen = () => {

    const [copro, setCopro] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const storage = getStorage();

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

    
    ////////////////////ici le code pour le pdf ////////////////////////////////


    const pickPdf = async (coproId) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: false, // Ne pas copier dans le répertoire de cache
            });

            if (!result.canceled) {
                setIsLoading(true);

                const blob = await fetch(result.assets[0].uri).then((response) => response.blob());

                const filename = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf('/'));
                const pdfRef = ref(storage, `PDFs/${filename}`);

                await uploadBytes(pdfRef, blob);

                const downloadUrl = await getDownloadURL(pdfRef);

                // Mise à jour de la copropriété avec le downloadUrl
                const docRef = await addDoc(collection(db, "Document"), {
                    filename: downloadUrl,
                });

                const coproDocRef = doc(db, 'Copro', coproId);
                const nouvellesDonnees = {
                // Ajoutez ici les champs que vous souhaitez mettre à jour
                document_id:docRef.id,
                // ...
                };
                try {
                await updateDoc(coproDocRef, nouvellesDonnees);
                console.log('Document "copro" mis à jour avec succès !');
                } catch (error) {
                console.error('Erreur lors de la mise à jour du document "copro" :', error);
                }
                //console.log(querySnapshot);
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
                                <Text style={{ color: 'white' }}>Ajouter PDF</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default DocumentScreen;
