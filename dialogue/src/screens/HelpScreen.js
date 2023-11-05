import axios from 'axios';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
//import HorairesScreen from '../components/HorairesScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';





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
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            behavior={'padding'}
        >
            <View className="min-h-full">
                <View className="min-h-full justify-end m-5">
                    {data.map((item, index) => (
                        <View key={index} className="bg-white p-10">
                            <Text style={{ fontWeight: 'bold', color: item.type === 'user' ? 'green' : 'red' }}>
                                {item.type === 'user' ? 'Vous :' : 'ChatGPT :'}
                            </Text>
                            <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.text}</Text>
                        </View>
                    ))}
                    
                    <TextInput
                        style={{ borderWidth: 1, borderColor: 'black', height: 40, marginBottom: 20, borderRadius: 10, paddingLeft: 10 }}
                        value={textInput}
                        onChangeText={(text) => setTextInput(text)}
                        placeholder="Posez-moi une question..."
                    />

                    <TouchableOpacity
                        style={{ backgroundColor: 'blue', height: 40, borderRadius: 10, marginBottom: 180, alignItems: 'center', justifyContent: 'center' }}
                        onPress={handleSend}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Let's Go</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default HelpScreen
