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


  const formatDateTimeFrench = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    const formatter = new Intl.DateTimeFormat('fr-FR');
    return formatter.format(date);
  }


  //////////////////////////////ICI LA VUE//////////////////////////////////////


  return (
    <View className="flex-1 tracking-widest text-center rounded-lg">
      {isLoading ? (
        <ActivityIndicator />
      ) : factures.length > 0 ? (
        <FlatList
          className="flex-1 tracking-widest text-center rounded-lg"
          data={factures}
          keyExtractor={(item, key) => key}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(item.filename); // Ouvrir le lien URL lorsque l'utilisateur appuie dessus
              }}
            >
              <View className="flex-1 items-center justify-center mt-5 tracking-widest text-center text-white bg-blue-500 rounded-lg mx-5">
                <Text> Facture du : {formatDateTimeFrench(item.date)}</Text>
                <Text className="flex-1 mt-5 tracking-widest text-center rounded-lg mx-5"> Télécharger PDF</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>Aucune facture disponible pour cet utilisateur.</Text>
      )}
    </View>
  );
};

export default FactureScreenUser;
