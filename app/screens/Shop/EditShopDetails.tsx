import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../Firebase_Config';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import Shop_Header from '../../Components/Shop_Header';
import * as Location from 'expo-location';
import Navigation from '../../Components/NavigationFor_Business';

const categories = [
  { value: "Electronics", label: "Electronic Repair Shop" },
  { value: "Appliances", label: "Home appliances Repair Shop" },
  { value: "Cloathing", label: "Cloathing and Textile Making Shop" },
  { value: "GardenEquipment", label: "Home & Garden Tools Repair Shop" },
  { value: "MusicalInstruments", label: "Musical instruments repair shop" },
  { value: "JwelleryWatches", label: "Jewelry and watches Repair shop" },
  { value: "Automotive", label: "Automotive Repair Shop" },
  { value: "Furniture", label: "Furniture Repair Shop" },
  { value: "Computers", label: "Computer Repair Shop" },
  { value: "Other", label: "Any Other Repair Shop" },
];

const EditShopDetails: React.FC = () => {
  const [shopData, setShopData] = useState<any>(null);
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('Select Category');
  const [Shop_Des, setShop_Des] = useState('');
  const [OwnerName, setOwnerName] = useState('');
  const [contact, setContact] = useState('');
  const [Rph, setRph] = useState('');
  const [shopTag, setShopTag] = useState('');
  const [ImageUrl, setImageUrl] = useState('');
  const [ownerLocationLongitude, setOwnerLocationLongitude] = useState(null);
  const [ownerLocationLatitude, setOwnerLocationLatitude] = useState(null);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (user) {
        const q = query(collection(FIREBASE_DB, 'repairShops'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const shop = querySnapshot.docs[0].data();
          setShopData(shop);
          setShopName(shop.shopName);
          setCategory(shop.category);
          setShop_Des(shop.Shop_Des);
          setOwnerName(shop.OwnerName);
          setContact(shop.contact);
          setRph(shop.Rph);
          setShopTag(shop.shopTag);
          setImageUrl(shop.ImageUrl);
          setOwnerLocationLongitude(shop.ownerLocationLongitude);
          setOwnerLocationLatitude(shop.ownerLocationLatitude);
        }
      }
    };
    fetchShopDetails();
  }, [user]);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setOwnerLocationLatitude(currentLocation.coords.latitude);
    setOwnerLocationLongitude(currentLocation.coords.longitude);
    Alert.alert("Location fetched successfully");
  };

  const handleUpdate = async () => {
    if (user && shopData) {
      const q = query(collection(FIREBASE_DB, 'repairShops'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { 
        shopName, 
        category, 
        Shop_Des, 
        OwnerName, 
        contact, 
        Rph, 
        shopTag, 
        ImageUrl, 
        ownerLocationLongitude, 
        ownerLocationLatitude 
      });
      alert('Shop details updated successfully!');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header />
      <ScrollView style={{ flex: 1, margin: 20 }}>
        <Text style={styles.label}>Owner Name</Text>
        <TextInput style={styles.input} value={OwnerName} onChangeText={setOwnerName} placeholder="Enter Owner's Name" />

        <Text style={styles.label}>Shop Name</Text>
        <TextInput style={styles.input} value={shopName} onChangeText={setShopName} placeholder="Enter Shop Name" />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="Select Category" />
            {categories.map((cat) => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} value={Shop_Des} onChangeText={setShop_Des} placeholder="Enter Shop Description" multiline />

        <Text style={styles.label}>Contact</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="Enter Contact Number" keyboardType="phone-pad" />

        <Text style={styles.label}>Rate Per Hour in Rupees</Text>
        <TextInput style={styles.input} value={Rph} onChangeText={setRph} placeholder="Rs.1000" />

        <Text style={styles.label}>Shop Tag</Text>
        <TextInput style={styles.input} value={shopTag} onChangeText={setShopTag} placeholder="Enter Shop Tags (e.g., Fast Service)" />

        <TouchableOpacity onPress={getLocation}>
          <Text style={styles.label}>Add Location</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Image URL</Text>
        <TextInput style={styles.input} value={ImageUrl} onChangeText={setImageUrl} placeholder="Enter Image URL" keyboardType="url" />

        <Button title="Update Details" onPress={handleUpdate} />
      </ScrollView>
      <Navigation></Navigation>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default EditShopDetails;
