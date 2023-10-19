import axios from 'axios';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        setData([...data, {type: 'user', 'text': textInput}, {type: 'bot', 'text': text}])
        setTextInput('');
    }

    return (
        <View style={styles.container}>
                <FlatList 
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.body}
                    renderItem={({item}) => (
                        <View style={{flexDirection: 'row', padding:10}}>
                                <Text style={{fontWeight: 'bold', color: item.type === 'user' ? 'green' : 'red'}}>
                                    {item.type === 'user' ? 'Vous :' : 'Bot :' }
                                </Text>
                                
                                <Text style={styles.bot}>
                                    {item.text}
                                </Text>
                        </View>
                    )}  
                />
                
                    <TextInput 
                        style={styles.input}
                        value={textInput}
                        onChangeText={text => setTextInput(text)}
                        placeholder='Pose moi une question'
                    />
                    
                    <TouchableOpacity
                    style={styles.button}
                    onPress={handleSend}
                    >
                        <Text style={styles.buttonText}>Let's Go</Text>
                    </TouchableOpacity>
                    
        </View>
    )
}

export default HelpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        width: '90%',
        height: 60,
        marginBottom: 10,
        borderRadius: 10
    },
    button: {
        backgroundColor: 'yellow',
        height:60,
        borderRadius:10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
    },
    buttonText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'blue'
    }
    
})