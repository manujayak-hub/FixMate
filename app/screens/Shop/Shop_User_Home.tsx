import React,{useState} from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";
import useUserStore from '../../Store/userStore'
import {  FIREBASE_DB } from "../../../Firebase_Config";
import { updateDoc,doc} from "firebase/firestore";


const hero = require("../../../assets/hero.png");
const au = require("../../../assets/au.png");
const ayrs = require("../../../assets/ayrs.png");
const eysd = require("../../../assets/eysd.png");
const uos = require("../../../assets/uos.png");

const Shop_User_Home: React.FC = () => {
  const navigation: any = useNavigation();
  const { user } = useUserStore(); // Get the user from Zustand store
  const [modalVisible, setModalVisible] = useState(false);
  const [availability, setAvailability] = useState("Available");

  const updateAvailability = async () => {
    if (!user) {
      alert("User not logged in.");
      return;
    }

    const shopId = user.uid; // Use the user's UID as the shop ID

    try {
      const shopRef = doc(FIREBASE_DB, "repairShops", shopId);
      await updateDoc(shopRef, {
        availability,
      });
      alert("Availability updated successfully!");
      setModalVisible(false);
    } catch (error) {
      alert("Error updating availability: " + error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <Shop_Header />
    <View style={{ flex: 1, margin: 20 }}>
      <Image source={hero} style={styles.topImage} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("AddRepairShop")}
          >
            <Image source={ayrs} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Add Your</Text>
            <Text style={styles.buttonText}>Repair Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("EditShopDetails")}
          >
            <Image source={eysd} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Edit Your</Text>
            <Text style={styles.buttonText}>Shop Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => setModalVisible(true)} // Show modal on press
          >
            <Image source={au} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Availability</Text>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("Complaintmanage")}
          >
            <Image source={uos} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Update Order</Text>
            <Text style={styles.buttonText}>Status</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>

    {/* Availability Modal */}
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Availability</Text>

          {/* Radio Buttons for Availability */}
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setAvailability("Available")}
          >
            <Text style={styles.radioText}>
              {availability === "Available" ? "●" : "○"} Available
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setAvailability("Not Available")}
          >
            <Text style={styles.radioText}>
              {availability === "Not Available" ? "●" : "○"} Not Available
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <Button title="Update" onPress={updateAvailability} />
          <Button
            title="Cancel"
            onPress={() => setModalVisible(false)}
            color="red"
          />
        </View>
      </View>
    </Modal>

    <Navbar />
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topImage: {
    width: "100%",
    height: 320, // Adjust height as needed
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%", // Two items per row
    aspectRatio: 1, // Makes the button square
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  buttonImage: {
    width: 60,
    height: 60, // Adjust size as needed
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F96D2B",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
});

export default Shop_User_Home;
