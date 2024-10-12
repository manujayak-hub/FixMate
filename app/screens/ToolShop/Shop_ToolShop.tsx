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


const toolshop = require("../../../assets/toolshop.png");

const addTool = require("../../../assets/addTool.png");
const viewTool = require("../../../assets/tools.png");


const Shop_ToolShop: React.FC = () => {
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
    <Text style={styles.title}>Tools Shop</Text>
      <Image  source={toolshop} style={styles.topImage} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("AddTools")}
          >
            <Image source={addTool} style={styles.buttonImage} />
            
            <Text style={styles.buttonText}>Add Tools</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ToolList")}
          >
            <Image source={viewTool} style={styles.buttonImage} />
            
            <Text style={styles.buttonText}>View Tools</Text>
          </TouchableOpacity>

          
        </View>
      </ScrollView>
    </View>

  

    <Navbar />
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topImage: {
    width: "100%",
    height: 350, // Adjust height as needed
    marginBottom: 20,
    marginTop:15,
    borderRadius:10,
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
    marginTop:30,
  },
  buttonImage: {
    width: 60,
    height: 60, // Adjust size as needed
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
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
  title: {
    fontWeight: '700',
    fontSize: 24,
    color: '#FF6100',
    left: 10,
    marginBottom: 10,
    textAlign:'center',
  },
});

export default Shop_ToolShop;
