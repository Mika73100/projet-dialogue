import { useNavigation } from "@react-navigation/native";
import { collection, query, getDocs, doc, addDoc, updateDoc, where, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, Linking } from 'react-native'; // Importez Linking
import { AuthenticatedUserContext } from '../../context/AuthticationContext';



import { db } from '../../firebase/config';

const DocumentCopro = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [factures, setFactures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) return;

    async function fetchFactures() {
      try {
        const facturesCollection = collection(db, 'Copro');
        const q = query(facturesCollection, where('code', '==', user.code));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((document) => {
          const coproData = document.data();
          const coproDocRef = doc(db, 'Copro', coproData.document_id);
          const documentcopro = getDoc(coproDocRef);
          console.log(documentcopro)

          const docRef = doc(db, 'Document', coproData.document_id);

          // Utilisez la référence pour obtenir le document
          getDoc(docRef)
            .then((doc) => {
              if (doc.exists()) {
                //console.log('Document trouvé :', doc.data());
                setFactures({
                  filename:doc.data().filename,
                  copro:coproData.copro,
                  image:coproData.image
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

        // setFactures(facturesData);
        // setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des factures', error);
        setIsLoading(false);
      }
    }

    fetchFactures();
  }, [user]);

  useEffect(() => {
    console.log(factures.copro)
  }, [factures])

  //////////////////////////////ICI LA VUE//////////////////////////////////////

  return (
    <View style={{ flex: 1, padding: 20 }}>
                <View>
                    <Text>{factures.copro}</Text>
                  </View>
                
                  <Image source={{ uri: factures.image }} className='w-24 h-24 rounded-full'/>

                  <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(factures.filename); // Ouvrir le lien URL lorsque l'utilisateur appuie dessus
                      }}
                    >
                  <Text style={{ color: 'blue', textDecorationLine: 'underline' }}> Télécharger PDF</Text>
                </TouchableOpacity>
    </View>
  );
};

export default DocumentCopro;
