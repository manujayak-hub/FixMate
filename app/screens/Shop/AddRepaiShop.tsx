import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../Firebase_Config";
import { collection, addDoc } from "firebase/firestore";
import * as Location from "expo-location";
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";

const AddRepairShop: React.FC = () => {
  const [shopName, setShopName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("Select Category"); // Initial value for the picker
  const [Shop_Des, setShop_Des] = useState("");
  const [OwnerName, setOwnerName] = useState("");
  const [Rph, setRph] = useState("");
  const [shopTag, setShopTag] = useState("");
  const [ImageUrl, setImageUrl] = useState("");
  const [ownerLocationLongitude, setOwnerLocationLongitude] = useState(null);
  const [ownerLocationLatitude, setOwnerLocationLatitude] = useState(null);
  const navigation = useNavigation();

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setOwnerLocationLatitude(currentLocation.coords.latitude)
    setOwnerLocationLongitude(currentLocation.coords.longitude)
    Alert.alert("Done");

  };

  const handleSubmit = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user ) {
      try {
        const shopRef = collection(FIREBASE_DB, "repairShops");

        await addDoc(shopRef, {
          shopName,
          category,
          Shop_Des,
          OwnerName,
          Rph,
          shopTag,
          contact,
          ImageUrl,
          ownerLocationLongitude,
          ownerLocationLatitude,
          availability: false,
          userId: user.uid,
         
          
        });

        alert("Shop details added successfully!");
        navigation.goBack();
      } catch (error: any) {
        alert("Error adding shop details: " + error.message);
      }
    } else {
      alert("User not authenticated or location not available");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header />
      <ScrollView style={{ flex: 1, margin: 20 }}>
        <Text style={styles.label}>Owner Name</Text>
        <TextInput
          style={styles.input}
          value={OwnerName}
          onChangeText={setOwnerName}
          placeholder="Enter Owner's Name"
        />

        <Text style={styles.label}>Shop Name</Text>
        <TextInput
          style={styles.input}
          value={shopName}
          onChangeText={setShopName}
          placeholder="Enter Shop Name"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="Select Category" />
            <Picker.Item label="Auto Repair" value="Auto Repair" />
            <Picker.Item
              label="Electronics Repair"
              value="Electronics Repair"
            />
            <Picker.Item
              label="Home Appliances Repair"
              value="Home Appliances Repair"
            />
            <Picker.Item label="Mobile Repair" value="Mobile Repair" />
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={Shop_Des}
          onChangeText={setShop_Des}
          placeholder="Enter Shop Description"
          multiline
        />

        <Text style={styles.label}>Contact</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="Enter Contact Number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Rate Per Hour in Rupees</Text>
        <TextInput
          style={styles.input}
          value={Rph}
          onChangeText={setRph}
          placeholder="Rs.1000 "
        />

        <Text style={styles.label}>Shop Tag</Text>
        <TextInput
          style={styles.input}
          value={shopTag}
          onChangeText={setShopTag}
          placeholder="Enter Shop Tags (e.g., Fast Service)"
        />
        <Text style={styles.label}>Image URL</Text>

        <TouchableOpacity onPress={() => getLocation()}>
          <Text style={styles.label}>Add Location</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={ImageUrl}
          onChangeText={setImageUrl}
          placeholder="Enter Image URL"
          keyboardType="url"
        />

        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
      <Navbar />
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
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default AddRepairShop;
