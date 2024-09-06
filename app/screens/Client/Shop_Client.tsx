import { StyleSheet, Text, View } from 'react-native'
import React ,{useEffect,useState}from 'react'
import { FIREBASE_DB } from '../../../Firebase_config'
import { collection,doc,getDocs } from 'firebase/firestore'

interface RepairShops{
    id: String;
    contact: String;
    location: String;
    shopName: String;
}

const Shop_Client = () => {

    const [repairShops,setRepairShops] =useState<RepairShops[]>([]);

    useEffect(() =>{
        const fetchRepairshop =async() => {
           try {
            const fetchedShopDetails = await getDocs(collection(FIREBASE_DB,'repairShops'));
            const rdetails = fetchedShopDetails.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as RepairShops[];
            setRepairShops(rdetails);
           } catch (error) {
            console.error('Error fetching Repair shop details: ',error)
           }
        }

        fetchRepairshop();
    },[])
  return (
    <View>
      <Text>Shop_Client</Text>
    </View>
  )
}

export default Shop_Client

const styles = StyleSheet.create({})