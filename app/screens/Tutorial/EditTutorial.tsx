import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../Firebase_Config'; // Adjust according to your project structure
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { Video,ResizeMode } from 'expo-av';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';


// Define all route names and their params
type RootStackParamList = {
  EditTutorial: { tutorialId: string };
  TutorialDoc: { tutorialId: string };
  // Add other routes here if needed
};

// Define route props for EditTutorial
type EditTutorialRouteProp = RouteProp<RootStackParamList, 'EditTutorial'>;
type EditTutorialNavigationProp = StackNavigationProp<RootStackParamList, 'EditTutorial'>;

const EditTutorial: React.FC = () => {
  const [tutorialData, setTutorialData] = useState({
    title: '',
    description: '',
    timeDuration: '',
    imageUrl: '',
    videoUrl: '',
    tools:'',
    category:'',
  });
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [newVideoUri, setNewVideoUri] = useState<string | null>(null);
  const route = useRoute<EditTutorialRouteProp>(); // Get route parameters
  const navigation = useNavigation<EditTutorialNavigationProp>(); // Get navigation prop
  const { tutorialId } = route.params; // Get the tutorialId from the route params

  useEffect(() => {
    const fetchTutorialData = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'Tutorial', tutorialId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTutorialData(docSnap.data() as any); // Cast to 'any' to avoid type errors
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching tutorial data:', error);
      }
    };

    fetchTutorialData();
  }, [tutorialId]);

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
      setTutorialData({ ...tutorialData, imageUrl: result.assets[0].uri });
    } else {
      Alert.alert('Image selection canceled', 'Please select an image to upload.');
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewVideoUri(result.assets[0].uri);
      setTutorialData({ ...tutorialData, videoUrl: result.assets[0].uri });
    } else {
      Alert.alert('Video selection canceled', 'Please select a video to upload.');
    }
  };

  const handleUpdate = async () => {
    try {
      let updatedImageUrl = tutorialData.imageUrl;
      let updatedVideoUrl = tutorialData.videoUrl;

      // Upload new video if selected
      if (newVideoUri) {
        const videoResponse = await fetch(newVideoUri);
        const videoBlob = await videoResponse.blob();
        const videoRef = ref(FIREBASE_STORAGE, `tutorials/videos/${Date.now()}.mp4`);
        const videoUploadTask = uploadBytesResumable(videoRef, videoBlob);

        videoUploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Video upload is ${progress}% done`);
          },
          (error) => {
            console.error('Video upload failed:', error);
            Alert.alert('Error', 'Video upload failed');
          },
          async () => {
            updatedVideoUrl = await getDownloadURL(videoUploadTask.snapshot.ref);
          }
        );
      }

      // Upload new image if selected
      if (newImageUri) {
        const imageResponse = await fetch(newImageUri);
        const imageBlob = await imageResponse.blob();
        const imageRef = ref(FIREBASE_STORAGE, `tutorials/images/${Date.now()}.jpg`);
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
      const docRef = doc(FIREBASE_DB, 'Tutorial', tutorialId);
      await updateDoc(docRef, {
        title: tutorialData.title,
        description: tutorialData.description,
        timeDuration: tutorialData.timeDuration,
        tools:tutorialData.tools,
        category:tutorialData.category,
        imageUrl: updatedImageUrl,
        videoUrl: updatedVideoUrl,
      });

      Alert.alert('Success', 'Tutorial updated successfully');
      navigation.navigate('TutorialDoc', { tutorialId });
    } catch (error) {
      console.error('Error updating tutorial:', error);
      Alert.alert('Error', 'Could not update tutorial');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={tutorialData.title}
        onChangeText={(text) => setTutorialData({ ...tutorialData, title: text })}
      />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tutorialData.category}
              style={styles.picker}
              onValueChange={(text) => setTutorialData({ ...tutorialData, category: text })}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Home and Appliance Repair" value="Home and Appliance Repair" />
              <Picker.Item label="Automotive Repair" value="Automotive Repair" />
              <Picker.Item label="Electronic Repair" value="Electronic Repair" />
              <Picker.Item label="Furniture Repair" value="Furniture Repair" />
            </Picker>
          </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={tutorialData.description}
        numberOfLines={6}
        textAlignVertical="top"
        onChangeText={(text) => setTutorialData({ ...tutorialData, description: text })}
      />

      <Text style={styles.label}>Recommended Tools</Text>
      <TextInput
        style={styles.input}
        value={tutorialData.tools}
        onChangeText={(text) => setTutorialData({ ...tutorialData, tools: text })}
      />

      {/* Display Current or Newly Selected Image */}
      {tutorialData.imageUrl ? (
        <Image source={{ uri: tutorialData.imageUrl }} style={styles.imagePreview} />
      ) : (
        <Text>No image available for this tutorial</Text>
      )}

      {/* Option to pick a new image */}
      <TouchableOpacity onPress={pickImage}>
        <AntDesign name="picture" size={40} color="#FF6100" style={{ alignSelf: 'center' }} />
      </TouchableOpacity>
      <Text style={styles.svideo}>Select New Image</Text>

      {/* Display Current or Newly Selected Video */}
      {tutorialData.videoUrl ? (
        <Video
          source={{ uri: tutorialData.videoUrl }}
          useNativeControls
          style={styles.videoPreview}
          resizeMode={ResizeMode.CONTAIN}
        />
      ) : (
        <Text>No video available for this tutorial</Text>
      )}

      {/* Option to pick a new video */}
      <TouchableOpacity onPress={pickVideo}>
        <AntDesign name="pluscircleo" size={40} color="#FF6100" style={{ alignSelf: 'center' }} />
      </TouchableOpacity>
      <Text style={styles.svideo}>Select New Video</Text>

      <Text style={styles.label}>Time Duration</Text>
      <TextInput
        style={styles.input}
        value={tutorialData.timeDuration}
        keyboardType="numeric"
        onChangeText={(text) => setTutorialData({ ...tutorialData, timeDuration: text })}
      />

      <TouchableOpacity onPress={handleUpdate} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Update Tutorial</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
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
    paddingVertical: 15,
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
});

export default EditTutorial;
