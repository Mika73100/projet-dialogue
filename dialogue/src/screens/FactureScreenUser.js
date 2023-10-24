import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { AuthenticatedUserContext } from '../../context/AuthticationContext';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { db } from '../../firebase/config';

const FactureScreenUser = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [factures, setFactures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    //console.log(user.uid)
    if (!user) return;

    async function fetchFactures() {
      try {
        const facturesCollection = collection(db, 'Facture');
        const q = query(facturesCollection, where('userId', '==', 'xybbow7wnK0vi09ZDEHy'));
        //console.log(q);
        const querySnapshot = await getDocs(q);
        //console.log(querySnapshot.id)
        const facturesData = [];

        querySnapshot.forEach((doc) => {
          //console.log(doc.data())
          const facture = doc.data();

          const fetchImage = async () => {
            const storage = getStorage();
            const imageRef = ref(storage, facture.filename); // Remplacez par le chemin de votre fichier
            console.log(imageRef)
            try {
              const url = await getDownloadURL('https://firebasestorage.googleapis.com/v0/b/dialogue-react-native.appspot.com/o/PDFs%2FBrassart%2520-%2520Infographiste%2520Metteur%2520en%2520Page.pdf?alt=media&token=13ce5667-ae00-4bda-a411-66e3e43472f0&_gl=1*olgh8g*_ga*MTQ1NTMwMzkyLjE2ODU1MjU2ODM.*_ga_CW55HF8NVT*MTY5ODE0NzIwMS4xNjEuMS4xNjk4MTU0ODAzLjUyLjAuMA..');
              
              //setImageUrl(url);
            } catch (error) {
              console.error("Erreur lors du chargement de l'image :", error);
            }
          };
          
          fetchImage();

          
          console.log(facture.filename);
          facturesData.push({
            id: facture.userId,
            filename: facture.filename
            

            // Ajoutez ici d'autres informations de facture
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
  }, [user]);

  //////////////////////////////ICI LA VUE//////////////////////////////////////

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Factures de { user.user}</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : factures.length > 0 ? (
        <FlatList
          data={factures}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginTop: 10 }}>
            {/* <Image 
            className='w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8'
            source={{
              uri:'https://firebasestorage.googleapis.com/v0/b/dialogue-react-native.appspot.com/o/PDFs%2FBrassart%2520-%2520Infographiste%2520Metteur%2520en%2520Page.pdf?alt=media&token=13ce5667-ae00-4bda-a411-66e3e43472f0&_gl=1*olgh8g*_ga*MTQ1NTMwMzkyLjE2ODU1MjU2ODM.*_ga_CW55HF8NVT*MTY5ODE0NzIwMS4xNjEuMS4xNjk4MTU0ODAzLjUyLjAuMA..'
            }}></Image> */}
            
              <Text>{item.id}</Text>
              <Text>{item.filename}</Text>
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
