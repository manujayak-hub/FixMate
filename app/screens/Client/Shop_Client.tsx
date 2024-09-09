import React, { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View,SafeAreaView } from "react-native";
import { FIREBASE_DB } from "../../../Firebase_Config";
import { collection, getDocs } from "firebase/firestore";
import ClientHeader from "../../Components/ClientHeader";
import useUserStore from '../../Store/userStore';


interface RepairShops {
  id: string;
  contact: string;
  location: string;
  shopName: string;
}

const Shop_Client = () => {
  const [repairShops, setRepairShops] = useState<RepairShops[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRepairshop = async () => {
      try {
        const fetchedShopDetails = await getDocs(
          collection(FIREBASE_DB, "repairShops")
        );
        const rdetails = fetchedShopDetails.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as RepairShops[];
        setRepairShops(rdetails);
      } catch (error) {
        console.error("Error fetching Repair shop details: ", error);
      }
    };

    fetchRepairshop();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {repairShops.map((shop) => (
            <View key={shop.id} style={styles.gridItem}>
              <Text style={styles.title}>{shop.shopName}</Text>
              <Text>{shop.location}</Text>
              <Text>{shop.contact}</Text>
            </View>
          ))}

<Text>Hello, {user?.name}</Text>
<Text>Email: {user?.email}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Shop_Client;

const styles = StyleSheet.create({
  gridContainer: {
    padding:10,
    margin:10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%", // Two items per row
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
});