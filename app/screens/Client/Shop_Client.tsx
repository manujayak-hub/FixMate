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
  TextInput
} from "react-native";
import { FIREBASE_DB } from "../../../Firebase_Config";
import { collection, getDocs } from "firebase/firestore";
import ClientHeader from "../../Components/ClientHeader";
import { getDistance } from "geolib";
import * as Location from "expo-location";
import Navigation from "../../Components/Navigation";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
const rect = require('../../../assets/rect56.png')
const serachicon = require('../../../assets/searchicon.png')

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

const categories = ["All", "Electronics", "Automobile", "Home Appliances"];

const Shop_Client = () => {
  const [repairShops, setRepairShops] = useState<RepairShops[]>([]);
  const [filteredShops, setFilteredShops] = useState<RepairShops[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [mylogitude, setmylogitude] = useState(null);
  const [mylatitude, setmylatitude] = useState(null);
  
  const navigation = useNavigation();
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
      <View style={styles.searchiconview}>
  <TextInput
    style={styles.search}
    placeholder="Search Your Favorite Repair Shop"
    underlineColorAndroid="transparent"
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
              <Text style={styles.categoryText}>{category}</Text>
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
            // Ensure that location data is available before calculating distance
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
                : null; // If location is null, set distance as null

            return (
              <TouchableOpacity
                style={styles.card}
                key={shop.id}
                //onPress={() => navigation.navigate('ShopDetails', { shop })} // <-- Navigate to details page
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    minHeight: 40,
  },
  categoryButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    height: 40,
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
    width: 180, // Adjust to your desired width
    marginBottom: 20,
  },
  image: {
    padding:10,
    margin:10,
    marginBottom:-2,
    width: "90%",
    height: 100, 
    resizeMode: "cover",
    borderRadius:10
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
  rect:{
    margin:10,
    maxWidth:20
  },
  topics:{
    flexDirection:'row',
    alignItems:'center',
    fontWeight:'bold'
  },
  searchiconview: {
    position: 'relative', // Parent container needs relative positioning
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
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 40, // Padding on the right to avoid overlap with the icon
  },
  
  searchIcon: {
    position: 'absolute',
    top: 15, // Adjust vertically within the TextInput
    right: 15, // Align to the right of the TextInput
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  
});
