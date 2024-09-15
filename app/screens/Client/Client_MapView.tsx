import React, { useState,useEffect} from 'react';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { StyleSheet, View, Button } from 'react-native';
import { FIREBASE_DB } from "../../../Firebase_Config";
import { getDocs,collection } from 'firebase/firestore';

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
    latitude: 7.8731, // Latitude for Sri Lanka
    longitude: 80.7718, // Longitude for Sri Lanka
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
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
        />
        ))}
        <Marker
          coordinate={{ latitude: 6.9271, longitude: 79.8612 }} // Example marker for Colombo, Sri Lanka
          title="Colombo"
          description="Capital city of Sri Lanka"
        />
        <Marker
          coordinate={{ latitude: 7.2906, longitude: 80.6337 }} // Example marker for Kandy
          title="Kandy"
          description="Famous city in the hill country"
        />
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Zoom In" onPress={zoomIn} />
        <Button title="Zoom Out" onPress={zoomOut} />
      </View>
    </View>
  );
};

export default Client_MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%', 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});
