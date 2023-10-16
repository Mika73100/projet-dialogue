import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ButtonGroup = () => {

    const navigation = useNavigation();
    const [selection, setSelection] = useState(1);

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.btnGroup}>
                <TouchableOpacity
                    style={[styles.btn, selection === 1 ? { backgroundColor: "#6B7280" } : null]}
                    onPress={() => {
                        setSelection(1);
                        navigation.navigate('UserScreen');
                    }}
                    >
                    <Text style={[styles.btnText, selection === 1 ? { color: "white" } : null]}>Users</Text>
                </TouchableOpacity>


                <TouchableOpacity style={[styles.btn, selection === 2 ? { backgroundColor: "#6B7280" } : null]}
                    onPress={() => 
                        {setSelection(2);
                        navigation.navigate('FactureScreen')
                    }}>
                    <Text style={[styles.btnText, selection === 2 ? { color: "white" } : null]}>Factures</Text>
                </TouchableOpacity>


                <TouchableOpacity style={[styles.btn, selection === 3 ? { backgroundColor: "#6B7280" } : null]} 
                    onPress={() =>
                        {setSelection(3);
                        navigation.navigate('DocumentScreen')
                    }}>
                    <Text style={[styles.btnText, selection === 3 ? { color: "white" } : null]}>Documents</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnGroup: {
        flexDirection: 'row',
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: '#6B7280'
    },
    btn: {
        flex: 1,
        borderRightWidth: 0.25,
        borderLeftWidth: 0.25,
        borderColor: '#6B7280'
    },
    btnText: {
        textAlign: 'center',
        paddingVertical: 16,
        fontSize: 14
    }
});

module.exports = ButtonGroup;