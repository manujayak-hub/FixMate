import { View ,Text} from '@ant-design/react-native'

import React from 'react'
import Navbar from './Navigation'
import { SafeAreaView } from 'react-native-safe-area-context'



const Shop_User_Home :React.FC = () => {
  return (
  
  <SafeAreaView style={{flex:1}}>
    <View style={{margin:20}}>
        <Text>Hello machn</Text>
      
    </View>
    <Navbar/>
  </SafeAreaView>
  
  )
}

export default Shop_User_Home

