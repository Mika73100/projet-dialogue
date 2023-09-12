import { View, Text } from 'react-native'
import React from 'react'


const open = [
  { jour: 'Lundi', heure: '9:00 - 18:00' },
  { jour: 'Mardi', heure: '9:00 - 18:00' },
  { jour: 'Jeudi', heure: '9:00 - 18:00' },
  { jour: 'Vendredi', heure: '9:00 - 18:00' },
];


const HelpScreen = () => {
  return open.map((horaire, index) => (
  
    <View className="px-4 pt-4">
      <View className="flex justify-center items-center w-full p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Text className="text-sm" key={index}>
              {horaire.jour}: {horaire.heure}
            </Text>
      </View>
    </View>
  ));
};

export default HelpScreen