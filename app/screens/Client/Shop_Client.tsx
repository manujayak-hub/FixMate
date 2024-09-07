import { StyleSheet, Text, ScrollView } from 'react-native'
import React ,{useEffect,useState}from 'react'
import { FIREBASE_DB } from '../../../Firebase_Config'
import { collection,doc,getDocs } from 'firebase/firestore'
import { Card } from 'antd-mobile'

interface RepairShops{
    id: string;
    contact: string;
    location: string;
    shopName: string;
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
    <ScrollView showsVerticalScrollIndicator={false}>
      {repairShops.map((shop) => (
        <Card key={shop.id}>
            <Text>{shop.shopName}</Text>

        </Card>
      ))}

    </ScrollView>
  )
}

export default Shop_Client

const styles = StyleSheet.create({})