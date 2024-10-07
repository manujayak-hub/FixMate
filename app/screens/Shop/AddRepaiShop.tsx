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
import CustomAlert from "../../Components/CustomAlert";


const categories = [
  { value: "Electronics", label: "Electronic Repair Shop" },
  { value: "Appliances", label: "Home appliances Repair Shop" },
  { value: "Cloathing", label: "Cloathing and Textile Making Shop" },
  { value: "GardenEquipment", label: "Home & Garden Tools Repair Shop" },
  { value: "MusicalInstruments", label: "Musical instruments repair shop" },
  { value: "JwelleryWatches", label: "Jewelry and watches Repair shop" },
  { value: "Automotive", label: "Automative Repair Shop" },
  { value: "Furniture", label: "Furniture Repair Shop" },
  { value: "Computers", label: "Computer Repair Shop" },
  { value: "Other", label: "Any Other Repair Shop" },
];
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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success' | undefined>(undefined);
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
  
    if (!OwnerName) {
      setAlertMessage("Owner Name is required.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    if (!shopName) {
      setAlertMessage("Shop Name is required.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    if (category === "Select Category") {
      setAlertMessage("Please select a category.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    if (!Shop_Des) {
      setAlertMessage("Shop Description is required.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    if (!contact) {
      setAlertMessage("Contact Number is required.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    const contactRegex = /^[0-9]{10,15}$/; // Adjust according to the required length
    if (!contactRegex.test(contact)) {
      setAlertMessage("Contact Number must be a valid phone number.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    if (!Rph) {
      setAlertMessage("Rate Per Hour is required.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    const rateRegex = /^[0-9]*\.?[0-9]+$/; // Allows decimals
    if (!rateRegex.test(Rph) || parseFloat(Rph) <= 0) {
      setAlertMessage("Rate Per Hour must be a valid positive number.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    if (!ImageUrl) {
      setAlertMessage("Image URL is required.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/; // Basic URL validation
    if (!urlRegex.test(ImageUrl)) {
      setAlertMessage("Image URL must be a valid URL.");
      setAlertVisible(true);
      setAlertType('error');
      return;
    }
  
    if (user) {
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
  
        setAlertMessage('Shop details added successfully!');
        setAlertVisible(true);
        setAlertType('success');  // Set alertType to 'success'
        
      } catch (error: any) {
        setAlertMessage("Error adding shop details: " + error.message);
        setAlertVisible(true);
        setAlertType('error');  // Set alertType to 'error' on failure
      }
    } else {
      setAlertMessage('User not authenticated.');
      setAlertVisible(true);
      setAlertType('error');  // Set alertType to 'error' if user is not authenticated
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header />
      <Text style={styles.maintitle}>Create Your Repair Shop</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, margin: 20 }} >
        <Text style={styles.label}>Owner Name *</Text>
        <TextInput
          style={styles.input}
          value={OwnerName}
          onChangeText={setOwnerName}
          placeholder="Enter Owner's Name"
        />

        <Text style={styles.label}>Shop Name *</Text>
        <TextInput
          style={styles.input}
          value={shopName}
          onChangeText={setShopName}
          placeholder="Enter Shop Name"
        />

        <Text style={styles.label}>Category *</Text>
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


        <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={Shop_Des}
          onChangeText={setShop_Des}
          placeholder="Enter Shop Description"
          multiline
        />

        <Text style={styles.label}>Contact *</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="Enter Contact Number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Rate Per Hour in Rupees *</Text>
        <TextInput
          style={styles.input}
          value={Rph}
          onChangeText={setRph}
          placeholder="Rs.1000 "
        />

        <Text style={styles.label}>Shop Tag *</Text>
        <TextInput
          style={styles.input}
          value={shopTag}
          onChangeText={setShopTag}
          placeholder="Enter Shop Tags (e.g., Fast Service)"
        />
       
       <Text style={styles.label}>Add Location *</Text>

        <TouchableOpacity style={styles.locationbutton} onPress={() => getLocation()}>
          <Text style={styles.buttonText}>Get Location</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Image URL *</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={ImageUrl}
          onChangeText={setImageUrl}
          placeholder="Enter Image URL"
          keyboardType="url"
        />
<TouchableOpacity style={styles.button} onPress={handleSubmit}>
      <Text style={styles.buttonText}>Create Shop</Text>
    </TouchableOpacity>
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
  locationbutton: {
    backgroundColor: '#F96D2B', // Orange background color
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 10, // Rounded corners
    alignItems: 'center', // Center the text
    alignSelf:"center",
    width:200,
    height:50
  },
  button: {
    backgroundColor: '#F96D2B', // Orange background color
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center the text
    alignSelf:"center",
    width:300
  },
  buttonText: {
    color: '#FFFFFF', // White text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold text
  },
  maintitle:{
    color:"#F96D2B",
    alignSelf:"center",
    fontSize:28,
    fontWeight:"bold",
    padding:10
  }
});

export default AddRepairShop;
