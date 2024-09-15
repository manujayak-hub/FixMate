import React, { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, SafeAreaView, TouchableOpacity } from "react-native";
import { FIREBASE_DB } from "../../../Firebase_Config";
import { collection, getDocs } from "firebase/firestore";
import ClientHeader from "../../Components/ClientHeader";
import useUserStore from '../../Store/userStore';
import { TextInput } from "react-native-paper";

interface RepairShops {
  id: string;
  contact: string;
  shopName: string;
  category: string; 
  Shop_Des: string;
  OwnerName: string;
  Rph: string;
  shopTag: string;
  ImageUrl: string;
  ownerLocationLongitude:number
  ownerLocationLatitude:number
         
          
          
}

const categories = ['All', 'Electronics', 'Automobile', 'Home Appliances']; 

const Shop_Client = () => {
  const [repairShops, setRepairShops] = useState<RepairShops[]>([]);
  const [filteredShops, setFilteredShops] = useState<RepairShops[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRepairShop = async () => {
      try {
        const fetchedShopDetails = await getDocs(
          collection(FIREBASE_DB, "repairShops")
        );
        const rdetails = fetchedShopDetails.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as RepairShops[];
        setRepairShops(rdetails);
        setFilteredShops(rdetails);
      } catch (error) {
        console.error("Error fetching Repair shop details: ", error);
      }
    };

    fetchRepairShop();


    if (selectedCategory === 'All') {
      setFilteredShops(repairShops);
    } else {
      setFilteredShops(repairShops.filter(shop => shop.category === selectedCategory));
    }
  }, [selectedCategory, repairShops]);

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader/>
      <TextInput placeholder="Search Your Favorite Repair Shop" />

    
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text>Shops</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {filteredShops.map((shop) => (
            <View key={shop.id} style={styles.gridItem}>
              <Text style={styles.title}>{shop.shopName}</Text>
              
              <Text>{shop.category}</Text>
              <Text>{shop.Shop_Des}</Text>
              <Text>{shop.OwnerName}</Text>
              <Text>{shop.Rph}</Text>
              <Text>{shop.shopTag}</Text>
              <Text>{shop.ImageUrl}</Text>
              
          
          
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Shop_Client;

const styles = StyleSheet.create({
  gridContainer: {
    padding: 10,
    margin: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%", 
    backgroundColor: "#f8f8f8",
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryScroll: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  categoryButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#F96D2B',
  },
  categoryText: {
    color: '#000',
  },
});
