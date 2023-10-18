import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { db } from '../../firebase/config';


const FactureScreenUser = () => {

  const { user } = useContext(AuthenticatedUserContext);
  //const { user, userAvatrUrl, setUserAvatarUrl } = useContext(AuthenticatedUserContext);
  const [facture, setFacture] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) return;

    async function DocFinder(queryResult) {
      const querySnapshot = await getDocs(queryResult);
      querySnapshot.forEach((doc) => {
        const { profilePic, facture } = doc.data();
        setUserAvatarUrl(profilePic);

        if (facture) {
          setFacture(true);
        }

        setIsLoading(false);
      });
    }
    
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Facture de {user ? user.facture : 'l\'utilisateur'}</Text>
      {facture.length > 0 ? (
        <FlatList
          data={facture}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginTop: 10 }}>
              <Text>Montant : {item.Facture} €</Text>
              <Text>Description : {item.description}</Text>
              {/* Ajoutez ici d'autres informations de facture */}
            </View>
          )}
        />
      ) : (
        <Text>Aucune facture disponible pour cet utilisateur.</Text>
      )}
    </View>
  );
};

export default FactureScreenUser;
