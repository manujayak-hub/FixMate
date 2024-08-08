import { View ,Text} from '@ant-design/react-native'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



const Shop_Header :React.FC = () => {
  return (
  
  <SafeAreaView >
    <View style={{padding:20 ,backgroundColor:'#F96D2B'}}>

    <StatusBar backgroundColor="#F96D2B" barStyle="light-content" />
        <Text>Hello machn</Text>
      
    </View>
    
  </SafeAreaView>
  
  )
}

export default Shop_Header

