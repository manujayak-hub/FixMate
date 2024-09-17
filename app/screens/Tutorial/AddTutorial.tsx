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
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { DocumentReference } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';

// Define types for your state variables
interface Tutorial {
  title: string;
  category: string;
  timeDuration: string;
  tools: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  uploadTime: string;
}

// Define your stack parameter list
type RootStackParamList = {
  TutorialList: undefined;
  // Add other routes if necessary
};

// Type for navigation prop
type AddTutorialNavigationProp = StackNavigationProp<RootStackParamList, 'TutorialList'>;

const AddTutorial = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isVideoSelected, setIsVideoSelected] = useState<boolean>(false);
  const [isImageSelected, setIsImageSelected] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [timeDuration, setTimeDuration] = useState<string>('');
  const [tools, setTools] = useState<string>('');
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

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setIsVideoSelected(true);
    } else {
      Alert.alert('Video selection canceled', 'Please select a video to upload.');
      setIsVideoSelected(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setIsImageSelected(true);
    } else {
      Alert.alert('Image selection canceled', 'Please select an image to upload.');
      setIsImageSelected(false);
    }
  };

  const uploadTutorial = async () => {
    if (!title) {
      Alert.alert('Missing Data', 'Please enter the tutorial title.');
      return;
    }
    if (!category) {
      Alert.alert('Missing Data', 'Please select a category.');
      return;
    }
    if (!timeDuration) {
      Alert.alert('Missing Data', 'Please enter the time duration.');
      return;
    }
    if (!tools) {
      Alert.alert('Missing Data', 'Please enter the recommended tools.');
      return;
    }
    if (!description) {
      Alert.alert('Missing Data', 'Please enter the tutorial description.');
      return;
    }
    if (!videoUri) {
      Alert.alert('Missing Data', 'Please select a video.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Missing Data', 'Please select an image.');
      return;
    }

    try {
      const videoResponse = await fetch(videoUri);
      const videoBlob = await videoResponse.blob();
      const videoRef = ref(FIREBASE_STORAGE, `tutorials/videos/${Date.now()}.mp4`);

      const imageResponse = await fetch(imageUri);
      const imageBlob = await imageResponse.blob();
      const imageRef = ref(FIREBASE_STORAGE, `tutorials/images/${Date.now()}.jpg`);

      // Start both uploads in parallel
      const videoUploadTask = uploadBytesResumable(videoRef, videoBlob);
      const imageUploadTask = uploadBytesResumable(imageRef, imageBlob);

      // Handle video upload
      const videoUploadPromise = new Promise<string>((resolve, reject) => {
        videoUploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Video upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Video upload failed:', error);
            Alert.alert('Video upload failed', error.message);
            reject(error);
          },
          async () => {
            const videoUrl = await getDownloadURL(videoUploadTask.snapshot.ref);
            console.log('Video file available at', videoUrl);
            resolve(videoUrl);
          }
        );
      });

      // Handle image upload
      const imageUploadPromise = new Promise<string>((resolve, reject) => {
        imageUploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Image upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Image upload failed:', error);
            Alert.alert('Image upload failed', error.message);
            reject(error);
          },
          async () => {
            const imageUrl = await getDownloadURL(imageUploadTask.snapshot.ref);
            console.log('Image file available at', imageUrl);
            resolve(imageUrl);
          }
        );
      });

      // Wait for both uploads to finish
      const [videoUrl, imageUrl] = await Promise.all([videoUploadPromise, imageUploadPromise]);

      // Save to Firestore
      try {
        await addDoc(collection(FIREBASE_DB, 'Tutorial'), {
          title,
          category,
          timeDuration,
          tools,
          description,
          videoUrl,
          imageUrl,
          uploadTime: new Date().toISOString(),
        });

        Alert.alert('Upload successful!', 'Tutorial has been saved to Firestore.');
        navigation.navigate('TutorialList');

        // Reset form
        setVideoUri(null);
        setImageUri(null);
        setIsVideoSelected(false);
        setIsImageSelected(false);
        setTitle('');
        setCategory('');
        setTimeDuration('');
        setTools('');
        setDescription('');
      } catch (error) {
        console.error('Firestore save failed:', error);
        Alert.alert('Save failed', error.message);
      }
    } catch (error) {
      console.error('Video or image conversion failed:', error);
      Alert.alert('Conversion failed', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Tutorial</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter Tutorial Title"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Home and Appliance Repair" value="Home and Appliance Repair" />
              <Picker.Item label="Automotive Repair" value="Automotive Repair" />
              <Picker.Item label="Electronic Repair" value="Electronic Repair" />
              <Picker.Item label="Furniture Repair" value="Furniture Repair" />
            </Picker>
          </View>
          
          <TextInput
            style={styles.input1}
            placeholder="Enter Tutorial Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TextInput
            style={styles.input}
            placeholder="Recommended Tools"
            value={tools}
            onChangeText={setTools}
          />

          <TouchableOpacity onPress={pickVideo}>
            <AntDesign name="pluscircleo" size={40} color="#FF6100" style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={styles.svideo}>Select Video</Text>
          {isVideoSelected ? (
            <Text style={styles.videoUri}>Selected Video URI: {videoUri}</Text>
          ) : (
            <Text style={styles.videoUri}>No video selected</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Time Duration"
            value={timeDuration}
            onChangeText={setTimeDuration}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={pickImage}>
            <AntDesign name="picture" size={40} color="#FF6100" style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={styles.svideo}>Select Image</Text>
          {isImageSelected ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.videoUri}>No image selected</Text>
          )}

          <TouchableOpacity onPress={uploadTutorial} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Submit Tutorial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTutorial;

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
  },
  form: {
    justifyContent: 'center',
  },
  input: {
    marginBottom: 15,
    width: '95%',
    height: 50,
    backgroundColor: '#FFFFFF',
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
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: 200,
    alignSelf: 'center',
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
});
