import React, { useState,useEffect} from 'react';
import MapView, {  Marker } from 'react-native-maps';
import { StyleSheet, View, Button ,SafeAreaView,TouchableOpacity,Image} from 'react-native';
import { FIREBASE_DB } from "../../../Firebase_Config";
import { getDocs,collection } from 'firebase/firestore';
import Navigation from '../../Components/Navigation';

const zoomin = require("../../../assets/zoomin.png")
const zoomout = require("../../../assets/zoomout.png")
const locico = require('../../../assets/locationico.png')
interface RepairShops {
  id: string;
  contact: string;
  location: string;
  shopName: string;
  category: string; 
  ownerLocationLongitude: number;
  ownerLocationLatitude: number;
}



const Client_MapView = () => {

  const [repairShops, setRepairShops] = useState<RepairShops[]>([]);

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
      } catch (error) {
        console.error("Error fetching Repair shop details: ", error);
      }
    };

    fetchRepairShop();
  }, []);

  const [region, setRegion] = useState({
    latitude: 7.8731, // Latitude for the center of Sri Lanka
    longitude: 80.7718, // Longitude for the center of Sri Lanka
    latitudeDelta: 4.0, // Increased delta to zoom out and show whole Sri Lanka
    longitudeDelta: 4.0, // Increased delta to zoom out and show whole Sri Lanka
  });

  
  // Function to zoom in by reducing the latitude and longitude delta
  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  // Function to zoom out by increasing the latitude and longitude delta
  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <MapView
        initialRegion={region}
        region={region}
        style={styles.map}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {repairShops.map((shopmark) => (
          <Marker
          key={shopmark.id} 
          coordinate={{ latitude: shopmark.ownerLocationLatitude, longitude: shopmark.ownerLocationLongitude }} 
          title={shopmark.shopName}
          description={shopmark.category}
          image={locico}
        />
        ))}
        
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={zoomOut}>
          <Image source={zoomout} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomIn}>
          <Image source={zoomin} style={styles.image}/>
          </TouchableOpacity>
        
      </View>
    </View>
    <Navigation/>
    </SafeAreaView>
  );
};

export default Client_MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    right: 10, // Position to the right side
    top: '40%', // Centered vertically
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // White transparent box
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding inside the box
    justifyContent: 'center', // Align items in the center of the container
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginVertical: 10, // Space between the zoom in and zoom out buttons
  },
});

