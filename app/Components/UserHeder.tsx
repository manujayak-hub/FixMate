
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StatusBar ,Image,View ,Text, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const shopdash = require('../../assets/shopdash.png')

const Shop_Header :React.FC = () => {

  const navigation:any = useNavigation();
  return (
  
    <SafeAreaView>
    <View style={{ padding: 20, backgroundColor: '#F96D2B', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, color: '#ffffff' }}>Profile</Text>
      <TouchableOpacity onPress={() => navigation.  navigate('EditProfile')}> 
        <Icon name="account-edit" color="#ffffff" size={25} /> 
      </TouchableOpacity>
    </View>
    <StatusBar backgroundColor="#F96D2B" barStyle="light-content" />
  </SafeAreaView>
  
  )
}


export default Shop_Header

