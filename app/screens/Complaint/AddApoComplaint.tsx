import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image  } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../Firebase_Config';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { styles } from '../Complaint/ComplainStyles';
import { Picker } from '@react-native-picker/picker';
import { onAuthStateChanged } from 'firebase/auth';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../Booking/MyAppointments';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type AddComplaintScreenProps = NativeStackScreenProps<RootStackParamList, 'addcomplaint'>;
const generateComplaintId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Random 4-digit number
};

const AddComplaint: React.FC = ({ route }: AddComplaintScreenProps) => {
  const { appointment } = route.params; 
  const [complaintId, setComplaintId] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState('Product Issue');
  const [userId, setUserId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Generate complaint ID when the component loads
  useEffect(() => {
    setComplaintId(generateComplaintId());
  }, []);

  // Listen for authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setUserId(user.uid); // Save the userId from authenticated user
        
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || '');
          setEmail(userData.email || '');
          setMobile(userData.mobile || '');
        }
      } else {
        showModal('Error', 'User is not logged in.');
      }
    });

    return () => unsubscribe();
  }, []);

  const validateFields = () => {
    if (!name || !email || !mobile || !description) {
      showModal('All field required:', 'Please fill out all fields.');
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showModal('Invalid email:', 'Please enter a valid email address.');
      return false;
    }
    const mobilePattern = /^\d{10}$/; // Adjust as necessary
    if (!mobilePattern.test(mobile)) {
      showModal('Invalid mobile number', 'Please enter a valid mobile number (10 digits).');
      return false;
    }
    return true;
  };

  const showModal = (title: string, message: string) => {
    setModalMessage(`${title}: ${message}`);
    setModalVisible(true);
  };

  const submitComplaint = async () => {
    if (validateFields() && userId) {
      try {
        await addDoc(collection(FIREBASE_DB, 'complaints'), {
          shopN:appointment.shopName,
          complaintId,
          userId,
          name,
          email,
          mobile,
          description,
          issueType,
          image: imageUri || null,
          status: 'In Progress',
          createdAt: new Date().toISOString(),
        });
        showModal('Success', `Complaint Submitted with ID: ${complaintId} to ${appointment.shopName}.`);
        resetForm();
      } catch (error) {
        showModal('Error', 'Something went wrong while submitting your complaint.');
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMobile('');
    setDescription('');
    setIssueType('Product Issue');
    setComplaintId(generateComplaintId());
    setImageUri(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  

    if (!result.canceled) {

      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Add your complaint...</Text>
          <Text style={styles.label}>Add Complaint for : {appointment.shopName}</Text>
          <Text style={styles.label}>Complaint ID: {complaintId}</Text>
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Email Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Mobile Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
          />
          <Text style={styles.label}>Select Issue Type:</Text>
          <Picker
            selectedValue={issueType}
            style={styles.picker}
            onValueChange={(itemValue) => setIssueType(itemValue)}
          >
            <Picker.Item label="Product Issue" value="Product Issue" />
            <Picker.Item label="Service Issue" value="Service Issue" />
          </Picker>

          <Text style={styles.label}>Upload Image (optional):</Text>
          <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
          )}


          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.input, { height: 150 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={submitComplaint}>
            <Text style={styles.buttonText}>Add Complaint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Alerts */}
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddComplaint;



