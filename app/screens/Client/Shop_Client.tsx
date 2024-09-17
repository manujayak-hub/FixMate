import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { FIREBASE_DB } from "../../../Firebase_Config";
import { collection, getDocs } from "firebase/firestore";
import ClientHeader from "../../Components/ClientHeader";
import { TextInput } from "react-native-paper";
import { getDistance } from "geolib";
import * as Location from "expo-location";
import Navigation from "../../Components/Navigation";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Import NativeStackNavigationProp

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
  ownerLocationLongitude: number;
  ownerLocationLatitude: number;
}

// Define navigation parameters
export type RootStackParamList = {
  ShopDetails: { shop: RepairShops };
};

// Navigation prop type
type ShopClientScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopDetails"
>;

const categories = ["All", "Electronics", "Automobile", "Home Appliances"];

const Shop_Client = () => {
  const [repairShops, setRepairShops] = useState<RepairShops[]>([]);
  const [filteredShops, setFilteredShops] = useState<RepairShops[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [mylogitude, setmylogitude] = useState<number | null>(null);
  const [mylatitude, setmylatitude] = useState<number | null>(null);
  const navigation = useNavigation<ShopClientScreenNavigationProp>(); // Use the navigation prop type here
  const { width } = Dimensions.get("window");

  useEffect(() => {
    const fetchRepairShop = async () => {
      try {
        const fetchedShopDetails = await getDocs(
          collection(FIREBASE_DB, "repairShops")
        );
        const rdetails = fetchedShopDetails.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RepairShops[];
        setRepairShops(rdetails);
        setFilteredShops(rdetails);
      } catch (error) {
        console.error("Error fetching Repair shop details: ", error);
      }
    };

    fetchRepairShop();

    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setmylatitude(currentLocation.coords.latitude);
      setmylogitude(currentLocation.coords.longitude);
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredShops(repairShops);
    } else {
      setFilteredShops(
        repairShops.filter((shop) => shop.category === selectedCategory)
      );
    }
  }, [selectedCategory, repairShops]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader />
      <TextInput placeholder="Search Your Favorite Repair Shop" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text>Shops</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {filteredShops.map((shop) => {
            const distance =
              mylatitude && mylogitude
                ? getDistance(
                    { latitude: mylatitude, longitude: mylogitude },
                    {
                      latitude: shop.ownerLocationLatitude,
                      longitude: shop.ownerLocationLongitude,
                    }
                  )
                : null;

            return (
              <TouchableOpacity
                style={styles.card}
                key={shop.id}
                onPress={() => navigation.navigate("ShopDetails", { shop })} // Pass the shop data here
              >
                <Text style={styles.title}>{shop.shopName}</Text>
                <Text>{shop.category}</Text>
                <Text>{shop.Shop_Des}</Text>
                <Text>{shop.OwnerName}</Text>
                <Text>{shop.Rph}</Text>
                <Text>{shop.shopTag}</Text>
                {distance !== null ? (
                  <Text>{(distance / 1000).toFixed(2)} KM</Text>
                ) : (
                  <Text>Location not available</Text>
                )}
                <Image source={{ uri: shop.ImageUrl }} style={styles.image} />

                <View style={styles.infoContainer}>
                  <Text style={styles.shopName}>{shop.shopName}</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.price}>{shop.Rph} Per Hr</Text>
                    <View style={styles.ratingContainer}>
                      <Text>⭐</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <Navigation />
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
    paddingHorizontal: 5,
    height: 90,
  },
  categoryButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    height: 40,
    justifyContent: "center",
  },
  selectedCategory: {
    backgroundColor: "#F96D2B",
  },
  categoryText: {
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "48%", // Adjust width to fit two columns with spacing
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 10,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F96D2B",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    color: "#444",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    marginRight: 5,
    color: "#444",
  },
});