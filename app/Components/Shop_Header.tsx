
import React from 'react'
import { StatusBar ,Image,View ,Text} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const shopdash = require('../../assets/shopdash.png')

const Shop_Header :React.FC = () => {
  return (
  
  <SafeAreaView >
    <View style={{padding:20 ,backgroundColor:'#F96D2B'}}>
    <Image style={{height:20,width:20,marginLeft:10}} source={shopdash} />
    <Text style={{fontSize:8, color:'#ffffff'}}>Shop Owner</Text>
    <Text style={{fontSize:8, color:'#ffffff'}}>DashBoard</Text>
    <StatusBar backgroundColor="#F96D2B" barStyle="light-content" />
    
      
    </View>
    
  </SafeAreaView>
  
  )
}


export default Shop_Header

