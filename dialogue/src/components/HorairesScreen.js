import { View, Text } from 'react-native'
import React from 'react'
//import jsonData from '../../context/jsonData.json';


const HorairesScreen = () => {
    // Créez un tableau de données
    const horaires = [
        { jour: 'Lundi', heure: '9:00 - 17:00' },
        { jour: 'Mardi', heure: '9:00 - 17:00' },
        { jour: 'Mercredi', heure: '9:00 - 17:00' },
        { jour: 'Jeudi', heure: '9:00 - 17:00' },
        { jour: 'Vendredi', heure: '9:00 - 17:00' },
    ];


    return (
        <View className="px-4 pt-4 p-2">
            <View className="flex justify-center items-center w-full p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Text className="px-4 pt-4 p-2">Horaires de votre agence :</Text>
                {horaires.map((horaire, index) => (
                    <Text key={index}>
                        {horaire.jour}: {horaire.heure}
                    </Text>
                ))}
                <Text className="px-4 pt-4 p-2">Sauf jour ferié</Text>
            </View>
        </View>
    );
};


export default HorairesScreen
