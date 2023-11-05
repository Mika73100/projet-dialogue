import { useNavigation } from "@react-navigation/native";
import { collection, query, getDocs, doc, updateDoc, where, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View, Linking } from 'react-native'; // Importez Linking
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { db } from '../../firebase/config';


const ListFriends = () => {

    const { user } = useContext(AuthenticatedUserContext);
    const [chaters, setChaters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        if (!user) return;

        async function fetchChat() {
            const chatersCollection = collection(db, 'Users');
            const q = query(chatersCollection, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);

            let chats = []
            querySnapshot.forEach((doc) => {
                chats = doc.data();
            });
            //console.log('facture',facture.code)
            try {
                const chatersCollection = collection(db, 'Chaters');
                const q = query(chatersCollection, where('document', '==', document.id));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((document) => {
                    const chatData = document.data();
                    const coproDocRef = doc(db, 'Copro', chatData.document_id);
                    const documentcopro = getDoc(coproDocRef);
                    //console.log(document.data();)

                    const docRef = doc(db, 'Document', chatData.document_id);

                    // Utilisez la référence pour obtenir le document
                    getDoc(docRef)
                        .then((doc) => {
                            if (doc.exists()) {

                                setFactures({
                                    filename: doc.data().filename,
                                    copro: coproData.copro,
                                    image: coproData.image
                                }
                                )
                            } else {
                                console.log('Aucun document trouvé avec cet ID.');
                            }
                        })
                        .catch((error) => {
                            console.error('Erreur lors de la récupération du document :', error);
                        });

                });

            } catch (error) {
                console.error('Erreur lors de la récupération des factures', error);
                setIsLoading(false);
            }
        }

        fetchFactures();
    }, [user]);

    useEffect(() => {
    }, [factures])

    //////////////////////////////ICI LA VUE//////////////////////////////////////

    return (
        <View className="flex-1 mx-5 mt-5">
            <View className="bg-blue-500 rounded-lg overflow-hidden">
                <Image source={{ uri: factures.image }} className="w-full h-48 object-cover" />
                <View className="p-4">
                    <Text className="text-white text-lg font-bold mb-2">{factures.copro}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(factures.filename);
                        }}
                        className="bg-blue-700 rounded-lg py-2 text-center"
                    >
                        <Text className="text-white tracking-widest text-center">Règlement de copropriété</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>


    );
};

export default ListFriends;


