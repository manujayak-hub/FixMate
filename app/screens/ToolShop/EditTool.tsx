import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert,SafeAreaView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../Firebase_Config'; // Adjust according to your project structure
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { Video,ResizeMode } from 'expo-av';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";



// Define all route names and their params
type RootStackParamList = {
    EditTool: { toolId: string };
    ToolList: undefined;
  // Add other routes here if needed
};

// Define route props for EditTutorial
type EditToolRouteProp = RouteProp<RootStackParamList, 'EditTool'>;
type EditToolNavigationProp = StackNavigationProp<RootStackParamList, 'EditTool'>;

const EditTool: React.FC = () => {
  const [toolData, setToolData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category:'',
  });
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [newVideoUri, setNewVideoUri] = useState<string | null>(null);
  const route = useRoute<EditToolRouteProp>(); // Get route parameters
  const navigation = useNavigation<EditToolNavigationProp>(); // Get navigation prop
  const { toolId } = route.params; // Get the tutorialId from the route params

  useEffect(() => {
    const fetchTutorialData = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'Tools', toolId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setToolData(docSnap.data() as any); // Cast to 'any' to avoid type errors
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching tutorial data:', error);
      }
    };

    fetchTutorialData();
  }, [toolId]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need media library permissions to proceed.');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewImageUri(result.assets[0].uri);
      setToolData({ ...toolData, imageUrl: result.assets[0].uri });
    } else {
      Alert.alert('Image selection canceled', 'Please select an image to upload.');
    }
  };

 

  const handleUpdate = async () => {
    try {
      let updatedImageUrl = toolData.imageUrl;


      // Upload new image if selected
      if (newImageUri) {
        const imageResponse = await fetch(newImageUri);
        const imageBlob = await imageResponse.blob();
        const imageRef = ref(FIREBASE_STORAGE, `tools/images/${Date.now()}.jpg`);
        const imageUploadTask = uploadBytesResumable(imageRef, imageBlob);

        imageUploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Image upload is ${progress}% done`);
          },
          (error) => {
            console.error('Image upload failed:', error);
            Alert.alert('Error', 'Image upload failed');
          },
          async () => {
            updatedImageUrl = await getDownloadURL(imageUploadTask.snapshot.ref);
          }
        );
      }

      // Update the Firestore document
      const docRef = doc(FIREBASE_DB, 'Tools', toolId);
      await updateDoc(docRef, {
        name: toolData.name,
        description: toolData.description,
        price: toolData.price,
        category:toolData.category,
        imageUrl: updatedImageUrl,
    
      });

      Alert.alert('Success', 'Tool updated successfully');
      navigation.navigate('ToolList');
    } catch (error) {
      console.error('Error updating tool:', error);
      Alert.alert('Error', 'Could not update tool');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header/>
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.scontainer}>
    <Text style={styles.title}>Edit Tool</Text>
      <Text style={styles.label}>Tool Name</Text>
      <TextInput
        style={styles.input}
        value={toolData.name}
        onChangeText={(text) => setToolData({ ...toolData, name: text })}
      />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
            <Picker
              selectedValue={toolData.category}
              style={styles.picker}
              onValueChange={(text) => setToolData({ ...toolData, category: text })}
            >
              <Picker.Item label="Category" value="" />
              <Picker.Item label="Electronic Repair" value="Electronic Repair" />
              <Picker.Item label="Garden Equipment" value="Garden Equipment" />
              <Picker.Item label="Musical Instruments" value="Musical Instruments" />
              <Picker.Item label="Jwellery and Watches" value="Jwellery and Watches" />
              <Picker.Item label="Automotive Repair" value="Automotive Repair" />
              <Picker.Item label="Furniture Repair" value="Furniture Repair" />
              <Picker.Item label="Computers" value="Computers" />
            </Picker>
          </View>

    <Text style={styles.label}>Tool Price</Text>
      <TextInput
        style={styles.input}
        value={toolData.price}
        onChangeText={(text) => setToolData({ ...toolData, price: text })}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={toolData.description}
        numberOfLines={6}
        textAlignVertical="top"
        onChangeText={(text) => setToolData({ ...toolData, description: text })}
      />

      

      {/* Display Current or Newly Selected Image */}
      {toolData.imageUrl ? (
        <Image source={{ uri: toolData.imageUrl }} style={styles.imagePreview} />
      ) : (
        <Text>No image available for this tutorial</Text>
      )}

      {/* Option to pick a new image */}
      <TouchableOpacity onPress={pickImage}>
        <AntDesign name="picture" size={40} color="#FF6100" style={{ alignSelf: 'center' }} />
      </TouchableOpacity>
      <Text style={styles.svideo}>Select New Image</Text>

      
      <TouchableOpacity onPress={handleUpdate} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Update Tool</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
    <Navbar/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#EEEEEE',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  svideo: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: '#FF6100',
  },
  uploadButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    
    
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
    
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  videoPreview: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  pickerContainer: {
    width: '99%',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  scontainer: {
    width: 367,
    height:'100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding:10,          
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

export default EditTool;
