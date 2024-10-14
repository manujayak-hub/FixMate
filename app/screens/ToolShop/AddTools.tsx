import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  TextInput, 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../Firebase_Config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';  // Import getAuth to get the user's ID
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";


// Define your stack parameter list
type RootStackParamList = {
  ToolList: undefined;
};

// Type for navigation prop
type AddTutorialNavigationProp = StackNavigationProp<RootStackParamList, 'ToolList'>;

const AddTools = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isImageSelected, setIsImageSelected] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const navigation = useNavigation<AddTutorialNavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setIsImageSelected(true);
    } else {
      Alert.alert('Image selection canceled', 'Please select an image to upload.');
      setIsImageSelected(false);
    }
  };

  const uploadTool = async () => {
    if (!name || !category || !price || !description || !imageUri) {
      Alert.alert('Missing Data', 'Please fill all fields.');
      return;
    }
  
    try {
      const auth = getAuth(); 
      const userId = auth.currentUser?.uid; 
  
      if (!userId) {
        Alert.alert('Error', 'User not logged in. Please log in to upload a tool.');
        return;
      }
  
      const imageResponse = await fetch(imageUri);
      const imageBlob = await imageResponse.blob();
  
      const imageRef = ref(FIREBASE_STORAGE, `tools/images/${Date.now()}.jpg`);
      const imageUploadTask = uploadBytesResumable(imageRef, imageBlob);
  
      imageUploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Image upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Image upload failed:', error);
          if (error.code === 'storage/unauthorized') {
            Alert.alert('Permission Denied', 'You do not have permission to upload this file.');
          } else {
            Alert.alert('Upload Failed', 'An error occurred while uploading the file.');
          }
        },
        async () => {
          const imageUrl = await getDownloadURL(imageUploadTask.snapshot.ref);
  
          // Save to Firestore
          await addDoc(collection(FIREBASE_DB, 'Tools'), {
            name,
            category,
            price,
            description,
            imageUrl,
            userId, 
            uploadTime: new Date().toISOString(),
          });
  
          Alert.alert('Upload successful!', 'Tool has been added successfully.');
          navigation.navigate('ToolList');
  
          // Reset form
          setImageUri(null);
          setIsImageSelected(false);
          setName('');
          setCategory('');
          setPrice('');
          setDescription('');
        }
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message);
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header/>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.scontainer}>
        <Text style={styles.title}>Add Tool for Shop</Text>
        <View style={styles.form}>
        <Text style={styles.label}>Tool Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Tool Name"
            value={name}
            onChangeText={setName}
          />

        <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
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
            placeholder="Enter Tool Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          
          <Text style={styles.label}>Tool Description</Text>
          <TextInput
            style={styles.input1}
            placeholder="Enter Tool Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="center"
          />

          <Text style={styles.label}>Tool Image</Text>
          <TouchableOpacity onPress={pickImage}>
            <AntDesign name="picture" size={40} color="#FF6100" style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={styles.svideo}>Select Image</Text>
          {isImageSelected ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.videoUri}>No image selected</Text>
          )}

          <TouchableOpacity onPress={uploadTool} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Add Tool</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
      <Navbar/>
    </SafeAreaView>
  );
};





export default AddTools;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#EEEEEE',
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
    color: '#FF6100',
    left: 10,
    marginBottom: 20,
    textAlign:'center',
    marginTop:10,
  },
  form: {
    justifyContent: 'center',
    
  },
  input: {
    marginBottom: 15,
    width: '95%',
    height: 50,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#FF6100',
    borderRadius: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
    
  },
  input1: {
    marginBottom: 15,
    width: '95%',
    height: 150,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6100',
    borderRadius: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  pickerContainer: {
    width: '95%',
    borderWidth: 1,
    borderColor: '#FF6100',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  videoUri: {
    marginVertical: 10,
    fontSize: 16,
    color: 'gray',
  },
  svideo: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: '#FF6100',
  },
  uploadButton: {
    backgroundColor: '#FF6100',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    
    
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  scontainer: {
    width: 367,
    height:'100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  
    padding:10,            // Equivalent to `z-index: 0`
    // `isolation` isn't a direct property in React Native, but it doesn't impact layout here
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold',
    marginLeft:7,
  },
});
