import React,{useState} from "react";
import {ScrollView,View,Text,Image, TouchableOpacity,StyleSheet, Modal} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";
import {  FIREBASE_DB,FIREBASE_AUTH } from "../../../Firebase_Config";
import { updateDoc,collection, query, where, getDocs,deleteDoc} from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';
import CustomAlert from "../../Components/CustomAlert";


const hero = require("../../../assets/hero.png");
const au = require("../../../assets/au.png");
const ayrs = require("../../../assets/ayrs.png");
const eysd = require("../../../assets/eysd.png");
const uos = require("../../../assets/uos.png");
const ds = require("../../../assets/deleteshop.png");
const apt = require("../../../assets/appointment.png");

const Shop_User_Home: React.FC = () => {
  const navigation: any = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [availability, setAvailability] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success' | undefined>(undefined);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const user = FIREBASE_AUTH.currentUser;

  const updateAvailability = async () => {
    const shopId = user.uid; // Use the user's UID as the shop ID
    
    try {
      // Query to find the document where userId matches the user's UID
      const q = query(collection(FIREBASE_DB, "repairShops"), where("userId", "==", shopId));
      
      // Fetch documents that match the query
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        alert("No shop found for user ID: " + shopId);
        return; // Exit if no documents found
      }
  
      // Assuming there's only one document for the userId
      querySnapshot.forEach(async (doc) => {
        const shopRef = doc.ref; // Get the document reference
        
        // Update the availability field
        await updateDoc(shopRef, {
          availability,
        });
  
        
        setAlertMessage("Availability updated successfully!");
        setAlertVisible(true);
        setAlertType('success');
        
      });
      
    } catch (error) {
      
      setAlertMessage("Error updating availability: " + error.message);
      setAlertVisible(true);
      setAlertType('error');
    }
  };

  const deleteShop = async () => {
    const shopId = user.uid; // Use the user's UID as the shop ID
  
    try {
      // Query to find the document where userId matches the user's UID
      const q = query(collection(FIREBASE_DB, "repairShops"), where("userId", "==", shopId));
  
      // Fetch documents that match the query
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        setAlertMessage("No shop found for user ID: " + shopId);
        setAlertVisible(true);
        setAlertType('error');
        return; // Exit if no documents found
      }
  
      // Assuming there's only one document for the userId
      querySnapshot.forEach(async (doc) => {
        const shopRef = doc.ref; // Get the document reference
  
        // Delete the document using deleteDoc
        await deleteDoc(shopRef);
  
        setAlertMessage("Repair shop deleted successfully!");
        setAlertVisible(true);
        setAlertType('success');
      });
  
    } catch (error) {
      setAlertMessage("Error deleting shop: " + error.message);
      setAlertVisible(true);
      setAlertType('error');
    }
  };

  const handleDeleteShop = () => {
    setConfirmDeleteVisible(true); // Show confirmation modal
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
            <Text style={styles.buttonText}>Add Your </Text>
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

          <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />

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
            onPress={() => navigation.navigate("StatusManage")}
          >
            <Image source={uos} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Update Order</Text>
            <Text style={styles.buttonText}>Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={handleDeleteShop}
          >
            <Image source={ds} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Delete</Text>
            <Text style={styles.buttonText}>Repair Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}

            onPress={() => navigation.navigate("Complaintmanage")}
          >
            <Image source={uos} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Manage Complaint</Text>
            {/* <Text style={styles.buttonText}>Status</Text> */}

            onPress={() => navigation.navigate("ShopAppointments")}
          >
            <Image source={apt} style={styles.buttonImage} />
            <Text style={styles.buttonText}>View</Text>
            <Text style={styles.buttonText}>Appointments</Text>

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
            <AntDesign
              name="closecircle"
              size={24}
              color="#F96D2B"
              style={{ position: 'absolute', right: 10, top: 10 }}
              onPress={() => setModalVisible(false)}
            />
            <Text style={styles.maintitle}>Select Your Availability</Text>

            {/* Radio Buttons for Availability */}
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAvailability(true)} // Set as true for available
            >
              <Text style={styles.radioText}>
                {availability ? "●" : "○"} Available
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAvailability(false)} // Set as false for not available
            >
              <Text style={styles.radioText}>
                {!availability ? "●" : "○"} Not Available
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.button2} onPress={updateAvailability}>
              <Text style={styles.buttonText2}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmDeleteVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AntDesign
              name="closecircle"
              size={24}
              color="#F96D2B"
              style={{ position: 'absolute', right: 10, top: 10 }}
              onPress={() => setConfirmDeleteVisible(false)}
            />
            <Text style={styles.modalTitle}>Are you sure you want to delete this repair shop?</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.button2, { backgroundColor: 'red' ,width:150}]} // Red for delete
                onPress={deleteShop} // Call deleteShop if confirmed
              >
                <Text style={styles.buttonText2}>Yes, Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => setConfirmDeleteVisible(false)} // Close modal if cancelled
              >
                <Text style={styles.buttonText2}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    color:"#F96D2B",
    padding:10
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    alignSelf:"flex-start",
    paddingStart:60,
  },
  radioText: {
    fontSize: 22,
    marginLeft: 10,
    color:"#F96D2B",
  },
  maintitle:{
    color:"#F96D2B",
    alignSelf:"center",
    fontSize:24,
    fontWeight:"bold",
    padding:10
  },
  button2: {
    backgroundColor: '#F96D2B', // Orange background color
    marginTop:10,
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center the text
    alignSelf:"center",
    width:100
  },
  buttonText2: {
    color: '#FFFFFF', // White text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold text
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default Shop_User_Home;
