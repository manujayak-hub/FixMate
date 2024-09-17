
import React from 'react'
import { StatusBar ,Image,View ,Text,TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FIREBASE_AUTH} from '../../Firebase_Config';
import { useNavigation ,StackActions} from '@react-navigation/native';

const shopdash = require('../../assets/shopdash.png')

const Shop_Header :React.FC = () => {

  const user = FIREBASE_AUTH.currentUser
  const navigate = useNavigation()

  const logout = ()=>(
    FIREBASE_AUTH.signOut()
    .then(()=>{
      navigate.dispatch(StackActions.replace('Login'))
    })
    .catch((error) => {
      console.error('Error during sign out: ', error)
    })
  )
  
  return (
  
  <SafeAreaView >
    <View style={{padding:20 ,backgroundColor:'#F96D2B'}}>
    <Image style={{height:20,width:20,marginLeft:10}} source={shopdash} />
    <Text style={{fontSize:8, color:'#ffffff'}}>Shop Owner</Text>
    <Text style={{fontSize:8, color:'#ffffff'}}>DashBoard</Text>
    <Text style={{fontSize:8, color:'#ffffff'}}>{user.email}</Text>
    <StatusBar backgroundColor="#F96D2B" barStyle="light-content" />
    
   <TouchableOpacity onPress={logout} >
    <Text style={{fontSize:8, color:'#ffffff'}}>Logout</Text>
    </TouchableOpacity> 
    </View>
    
  </SafeAreaView>
  
  )
}


export default Shop_Header

