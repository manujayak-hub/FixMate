
import React, { useEffect, useState } from 'react'
import { StatusBar ,Image,View ,Text,TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FIREBASE_AUTH} from '../../Firebase_Config';
import { FIREBASE_DB } from "../../Firebase_Config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation ,StackActions} from '@react-navigation/native';



const ClientHeader :React.FC = () => {

  const user = FIREBASE_AUTH.currentUser
  const navigate = useNavigation();
  const [username,setUsername] = useState('');

  useEffect(()=>{
   
    const getUserName = async () => {
        if(user){
            try {
                if(user){
                    const refdoc = doc(FIREBASE_DB,'users',user.uid)
                    const theDoc = await getDoc(refdoc)
            
                    if(theDoc.exists()){
                        const userd = theDoc.data()
                        setUsername(userd.name)
                    }
                    else{
                        console.log('No document')
                    }
                }
            } catch (error) {
                console.error('Error in fetching details',error)
            }
        }
    }

    getUserName()
  },[user])

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
    <Text style={{fontSize:8, color:'#ffffff'}}>{'Hello' +username }</Text>
    <Text style={{fontSize:8, color:'#ffffff'}}>{user.email}</Text>
    <StatusBar backgroundColor="#F96D2B" barStyle="light-content" />
    
   <TouchableOpacity onPress={logout} >
    <Text style={{fontSize:8, color:'#ffffff'}}>Logout</Text>
    </TouchableOpacity> 
    </View>
    
  </SafeAreaView>
  
  )
}


export default ClientHeader

