import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Linking } from 'react-native'; // Importez Linking
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { db } from '../../firebase/config';


const FactureScreenUser = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [factures, setFactures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (!user) return;

    async function fetchFactures() {
      try {
        const facturesCollection = collection(db, 'Facture');
        const q = query(facturesCollection, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        const facturesData = [];

        querySnapshot.forEach((doc) => {
          const facture = doc.data();
          //console.log(facture.createdAt)
          facturesData.push({
            date: facture.createdAt,
            id: facture.id,
            filename: facture.filename,
            downloadURL: facture.downloadURL // Ajoutez le champ downloadURL
          });
        });

        setFactures(facturesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des factures', error);
        setIsLoading(false);
      }
    }

    fetchFactures();
  }, []);



  ///////////////////////////////ICI DATE EN FRANCAIS//////////////////////////


  const formatDateTimeFrench  = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    const formatter = new Intl.DateTimeFormat('fr-FR');
    return formatter.format(date);
  }


  //////////////////////////////ICI LA VUE//////////////////////////////////////


  return (
    <View style={{ flex: 1, padding: 20 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : factures.length > 0 ? (
        <FlatList
          data={factures}
          keyExtractor={( item,key) => key}
          renderItem={({ item }) => (

            <View className="flex-1 items-center justify-center">
              <Text>{formatDateTimeFrench(item.date)}
                  <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(item.filename); // Ouvrir le lien URL lorsque l'utilisateur appuie dessus
                      }}
                    >
                  <Text style={{ color: 'blue', textDecorationLine: 'underline' }}> Télécharger PDF</Text>
                </TouchableOpacity>
              </Text>
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
