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
  TextInput,
} from "react-native";
import { FIREBASE_DB } from "../../../Firebase_Config";
import { collection, getDocs } from "firebase/firestore";
import ClientHeader from "../../Components/ClientHeader";
import { getDistance } from "geolib";
import * as Location from "expo-location";
import Navigation from "../../Components/Navigation";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Import NativeStackNavigationProp

const rect = require("../../../assets/rect56.png");
const serachicon = require("../../../assets/searchicon.png");
const allico = require("../../../assets/Allico.png");
const automotiveico = require("../../../assets/automotiveico.png");
const applianceico = require("../../../assets/applianceico.png");
const cloathingico = require("../../../assets/cloathingico.png");
const computerico = require("../../../assets/computerico.png");
const electronicico = require("../../../assets/electronicico.png");
const furnitureico = require("../../../assets/furnitureico.png");
const homegardenico = require("../../../assets/homegardenico.png");
const jwelleryico = require("../../../assets/jwelleryico.png");
const musicaliico = require("../../../assets/musicalico.png");
const otherico = require("../../../assets/otherico.png");

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
  availability: boolean;
}

// Define navigation parameters
export type RootStackParamList = {
  ShopDetails: { shop: RepairShops };
  Appointment: { shop: RepairShops };
};

// Navigation prop type
type ShopClientScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopDetails"
>;
const categories = [
  "All",
  "Electronics",
  "Appliances",
  "Cloathing",
  "GardenEquipment",
  "MusicalInstruments",
  "JwelleryWatches",
  "Automotive",
  "Furniture",
  "Computers",
  "Other",
];

const categoryImages: { [key: string]: any } = {
  All: allico,
  Electronics: electronicico,
  Appliances: applianceico,
  Cloathing: cloathingico,
  GardenEquipment: homegardenico,
  MusicalInstruments: musicaliico,
  JwelleryWatches: jwelleryico,
  Automotive: automotiveico,
  Furniture: furnitureico,
  Computers: computerico,
  Other: otherico,
};

const Shop_Client = () => {
  const [repairShops, setRepairShops] = useState<RepairShops[]>([]);
  const [filteredShops, setFilteredShops] = useState<RepairShops[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [mylogitude, setmylogitude] = useState(null);
  const [mylatitude, setmylatitude] = useState(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); 

  const { width } = Dimensions.get("window");
  const navigation = useNavigation<ShopClientScreenNavigationProp>(); // Use the navigation prop type here

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
    // Filter based on selected category
    const categoryFilteredShops = selectedCategory === "All"
      ? repairShops
      : repairShops.filter((shop) => shop.category === selectedCategory);

    // Further filter based on search term
    const finalFilteredShops = categoryFilteredShops.filter((shop) =>
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredShops(finalFilteredShops);
  }, [selectedCategory, repairShops, searchTerm]); // Add searchTerm to dependencies

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader />
      <View style={styles.searchiconview}>
        <TextInput
          style={styles.search}
          placeholder="Search Your Favorite Repair Shop"
          underlineColorAndroid="transparent"
          value={searchTerm} // Bind search term state
          onChangeText={(text) => setSearchTerm(text)}
        />
        <Image source={serachicon} style={styles.searchIcon} />
      </View>

      <View style={styles.topics}>
        <Image style={styles.rect} source={rect}></Image>
        <Text>Category</Text>
      </View>
      <View>
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
              <Image
                source={categoryImages[category]}
                style={styles.categoryIcon}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.topics}>
        <Image style={styles.rect} source={rect}></Image>
        <Text>Shops</Text>
        
      </View>

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
              },
              1
            )
          : null;

      return (
        <TouchableOpacity
          style={styles.card}
          key={shop.id}
          onPress={() => navigation.navigate("ShopDetails", { shop })}
        >
          <Image source={{ uri: shop.ImageUrl }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.shopName}>{shop.shopName}</Text>
            {distance !== null ? (
              <Text>{distance / 1000} KM</Text>
            ) : (
              <Text>Location not available</Text>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.price}>{shop.Rph} Per Hr</Text>
              <View style={styles.ratingContainer}>
                <Text>⭐</Text>
              </View>
            </View>
            {/* Availability Indicator */}
            <View style={styles.availabilityContainer}>
              <View
                style={[
                  styles.availabilityDot,
                  shop.availability ? styles.available : styles.notAvailable,
                ]}
              />
              <Text style={styles.availabilityText}>
                {shop.availability ? "Available" : "Not Available"}
              </Text>
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
    textAlign: "center", // Center the text horizontally
    width: "100%",
  },
  categoryScroll: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    minHeight: 20,
  },
  categoryButton: {
    borderRadius: 10,
    marginRight: 5,
    height: 70, // Reduced the height of the button
    width: 70, // You can define width for consistency
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    width: 60, // Reduced size for category icons
    height: 60, // Adjusted height
    marginBottom: 5,
  },
  selectedCategory: {
    backgroundColor: "#Ffffff",
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
    width: 180, // Adjust to your desired width
    marginBottom: 20,
  },
  image: {
    padding: 10,
    margin: 10,
    marginBottom: -2,
    width: "90%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F96D2B", // The orange color in the text
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

  rect: {
    margin: 10,
    maxWidth: 20,
    backgroundColor:"#F96D2B"
  },
  topics: {
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "bold",
  },
  searchiconview: {
    position: "relative", // Parent container needs relative positioning
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
  },

  search: {
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    paddingRight: 40, // Padding on the right to avoid overlap with the icon
  },

  searchIcon: {
    position: "absolute",
    top: 15, // Adjust vertically within the TextInput
    right: 15, // Align to the right of the TextInput
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  locationico: {
    width: 20,
    height: 20,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5, // Makes the dot circular
    marginRight: 5, // Space between dot and text
  },
  available: {
    backgroundColor: "green", // Green for available
  },
  notAvailable: {
    backgroundColor: "grey", // Grey for not available
  },
  availabilityText: {
    fontSize: 14,
    color: "#444",
  },
});
