import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { AuthenticatedUserContext } from '../../context/AuthticationContext'; // Assurez-vous de corriger la faute de frappe
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ListFriends = () => {
    const { user } = useContext(AuthenticatedUserContext);
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchChats() {
            try {
                const chatsCollection = collection(db, 'Chats');
                const q = query(chatsCollection, where('chatters', 'array-contains', user.email));
                const querySnapshot = await getDocs(q);

                const chatsData = [];

                querySnapshot.forEach((doc) => {
                    const chat = doc.data();
                    chatsData.push({
                        id: doc.id,
                        chatters: chat.chatters,
                    });
                });

                setChats(chatsData);
                setIsLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des conversations', error);
                setIsLoading(false);
            }
        }

        fetchChats();
    }, [user]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {isLoading ? (
                <ActivityIndicator />
            ) : chats.length > 0 ? (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                // Vous pouvez ici naviguer vers la conversation ou effectuer une autre action
                                // Utilisez item.id ou item.chatters pour récupérer des informations sur la conversation
                            }}
                        >
                            <Text>{item.id}</Text> {/* Affichez des informations sur la conversation ici */}
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text>Aucune conversation disponible pour cet utilisateur.</Text>
            )}
        </View>
    );
};

export default ListFriends;
