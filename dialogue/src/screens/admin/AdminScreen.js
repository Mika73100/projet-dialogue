import { TouchableOpacity, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ButtonGroup from '../../components/ButtonGroup'
import React from 'react'


const AdminScreen = () => {


    const navigation = useNavigation();

    
  return (
    <>
      {/* // <View className='items-center object-cover h-screen'> */}
         {/* <TouchableOpacity className='items-center tracking-widest text-center bg-blue-600 shadow rounded-lg w-[80%] text-base py-2 mx-5 mb-5 mt-5'>
      //     {/* <View onPress={() => navigation.navigate('DocumentScreen') }>
      //       <Ionicons name="ios-document-outline" size={24} color="white">
      //         <Text className='font-semibold text-white text-center'>Documents</Text>
      //       </Ionicons>
      //     </View>
      //   </TouchableOpacity>

      //   <TouchableOpacity className='items-center tracking-widest text-center bg-blue-600 shadow rounded-lg w-[80%] text-base py-2 mx-5 mb-5'>
      //     <View onPress={() => navigation.navigate('DocumentScreen') }>
      //       <Ionicons name="logo-euro" size={24} color="white">
      //         <Text className='font-semibold text-white text-center'>Factures</Text>
      //       </Ionicons>
      //     </View>
      //   </TouchableOpacity>

      //   <TouchableOpacity className='items-center tracking-widest text-center bg-blue-600 shadow rounded-lg w-[80%] text-base py-2 mx-5 mb-5'>
      //     <View onPress={() => navigation.navigate('DocumentScreen') }>
      //       <Ionicons name="add" size={24} color="white">
      //         <Text className='font-semibold text-white text-center'>Add copro</Text>
      //       </Ionicons>
      //     </View> */} 
          <ButtonGroup />
        {/* </TouchableOpacity> */}

      {/* </View> */}
      </>
  )
}

export default AdminScreen