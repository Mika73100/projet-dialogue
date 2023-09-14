import { TextInput, ScrollView, View, Button, Text } from 'react-native'
import React, { useState } from 'react'

// Importez OPENAI_API_KEY depuis vos variables d'environnement
import {OPENAI_API_KEY} from "@env"
import axios from 'axios';

function HelpScreen() {
    const [question, setQuestion] = useState('');
    const [reponse, setReponse] = useState('');
    const [loading, setLoading] = useState(false);

    const genererReponse = async () => {
        if (!question) {
            console.log('erreur dans la question')
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                'https://api.openai.com/v1/engines/davinci/completions',
                {
                    prompt: "Quelle est la capitale de la France ?",
                    max_tokens: 50, // Limitez la longueur de la réponse si nécessaire
                },
                {
                    headers: {
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                }
            );
            console.log('Réponse de l\'API:', response.data);
            setReponse(response.data.answers[0]);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.error('Trop de requêtes. Attendez avant de réessayer.');
                // Attendez un certain temps avant de réessayer (par exemple, 30 secondes)
                setTimeout(genererReponse, 30000);
            } else {
                console.error('Erreur lors de la génération de la réponse:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Posez votre question"
                value={question}
                onChangeText={(text) => setQuestion(text)}
                style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />
            <Button title="Générer réponse" onPress={genererReponse} />
            {loading && <Text>Chargement en cours...</Text>}
            {reponse && (
                <ScrollView>
                    <Text>Réponse :</Text>
                    <Text>{reponse}</Text>
                </ScrollView>
            )}
        </View>
    );
}


export default HelpScreen

