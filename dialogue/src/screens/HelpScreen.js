import axios from 'axios';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HorairesScreen from '../components/HorairesScreen';




const HelpScreen = () => {

    const [data, setData] = useState([]);
    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
    const [textInput, setTextInput] = useState('');

    const handleSend = async () => {
        const prompt = textInput
        const response = await axios.post(apiUrl, {
            prompt: prompt,
            max_tokens: 1024,
            temperature: 0.5
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        })
        const text = response.data.choices[0].text;
        setData([...data, { type: 'user', 'text': textInput }, { type: 'bot', 'text': text }])
        setTextInput('');
    }

    return (
        <View className="flex h-full items-center justify-center">
            <View className="bg-white p-4 mb-50 w-full h-full max-w-screen-md">
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View className="flex flex-row p-2">
                            <Text className={`font-bold text-${item.type === 'user' ? 'green' : 'red'}`}>
                                {item.type === 'user' ? 'Vous :' : 'Bot :'}
                            </Text>

                            <Text className="text-base items-center justify-center ml-2">{item.text}</Text>
                        </View>
                    )}
                />

                <TextInput
                    className="border border-black w-full h-12 mb-4 rounded-lg p-2"
                    value={textInput}
                    onChangeText={(text) => setTextInput(text)}
                    placeholder="Posez-moi une question..."
                />

                <TouchableOpacity
                    className="bg-blue-600 h-12 rounded-lg items-center justify-center mb-20"
                    onPress={handleSend}
                >
                    <Text className="text-white font-bold text-base">Let's Go</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HelpScreen
