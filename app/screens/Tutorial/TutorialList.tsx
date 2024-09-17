import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { ref, deleteObject } from 'firebase/storage';
import { AntDesign } from '@expo/vector-icons';

// Define types for tutorial data
interface Tutorial {
  id: string;
  imageUrl: string;
  title: string;
  videoUrl: string;
  timeDuration: string;
}

const TutorialList: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const tutorialsCollection = collection(FIREBASE_DB, 'Tutorial');

    const unsubscribe = onSnapshot(
      tutorialsCollection,
      snapshot => {
        const tutorialsData: Tutorial[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Tutorial, 'id'>) // Type assertion to omit the 'id' from the data
        }));
        setTutorials(tutorialsData);
      },
      error => {
        Alert.alert('Error', 'Failed to load tutorials');
        console.error('Error fetching tutorials:', error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, videoUrl: string, imageUrl: string) => {
    try {
      // Confirm deletion action
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this tutorial?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: async () => {
            try {
              // Log the paths being used
              console.log('Video URL:', videoUrl);
              console.log('Image URL:', imageUrl);
    
              // Create references to storage objects
              const videoRef = ref(FIREBASE_STORAGE, videoUrl);
              const imageRef = ref(FIREBASE_STORAGE, imageUrl);
  
              // Delete video from Firebase Storage
              try {
                await deleteObject(videoRef);
                console.log('Video deleted successfully');
              } catch (error) {
                console.error('Error deleting video:', error);
                Alert.alert('Error', 'Could not delete video');
              }
  
              // Delete image from Firebase Storage
              try {
                await deleteObject(imageRef);
                console.log('Image deleted successfully');
              } catch (error) {
                console.error('Error deleting image:', error);
                Alert.alert('Error', 'Could not delete image');
              }
  
              // Delete document from Firestore
              try {
                await deleteDoc(doc(FIREBASE_DB, 'Tutorial', id));
                console.log('Document deleted successfully');
                Alert.alert('Success', 'Tutorial deleted successfully');
              } catch (error) {
                console.error('Error deleting document:', error);
                Alert.alert('Error', 'Could not delete document');
              }
            } catch (error) {
              console.error('Error during deletion process:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            }
          } },
        ]
      );
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      Alert.alert('Error', 'Could not delete tutorial');
    }
  };
  
  const handleEdit = (id: string) => {
    navigation.navigate('EditTutorial', { tutorialId: id });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tutorials.map(tutorial => (
        <View key={tutorial.id} style={styles.tutorialCard}>
          <Image source={{ uri: tutorial.imageUrl }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{tutorial.title}</Text>
            <Text style={styles.duration}>Duration: {tutorial.timeDuration}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleEdit(tutorial.id)}
              >
                <AntDesign name="edit" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(tutorial.id, tutorial.videoUrl, tutorial.imageUrl)}
              >
                <AntDesign name="delete" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#EEEEEE',
  },
  tutorialCard: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: '#000000',
  },
  duration: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6100',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default TutorialList;
