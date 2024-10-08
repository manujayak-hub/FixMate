import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { ref, deleteObject } from 'firebase/storage';
import { AntDesign } from '@expo/vector-icons';

// Define the structure for a tool
interface Tool {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
}

// Define the type for the navigation prop
type RootStackParamList = {
  EditTool: { toolId: string };
  STView: { toolId: string };
  ToolView: { toolId: string }; // Add this line
};

const ToolList: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const toolsCollection = collection(FIREBASE_DB, 'Tools');

    const unsubscribe = onSnapshot(
      toolsCollection,
      snapshot => {
        const toolsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Tool), // Type assertion to Tool structure
        }));
        setTools(toolsData);
      },
      error => {
        Alert.alert('Error', 'Failed to load tools.');
        console.error('Error fetching tools:', error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, imageUrl?: string) => {
    try {
      // Confirm deletion action
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this tool?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: async () => {
              try {
                if (imageUrl) {
                  const imageRef = ref(FIREBASE_STORAGE, imageUrl);
                  await deleteObject(imageRef); // Delete the image from storage
                }

                // Delete document from Firestore
                await deleteDoc(doc(FIREBASE_DB, 'Tools', id));
                Alert.alert('Success', 'Tool deleted successfully');
              } catch (error) {
                console.error('Error during deletion process:', error);
                Alert.alert('Error', 'An unexpected error occurred');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting tool:', error);
      Alert.alert('Error', 'Could not delete tool');
    }
  };

  const handleEdit = (id: string) => {
    navigation.navigate('EditTool', { toolId: id });
  };

  const handleView = (id: string) => {
    navigation.navigate('ToolView', { toolId: id }); // Navigate to ToolView
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tools.map(tool => (
        <TouchableOpacity key={tool.id} onPress={() => handleView(tool.id)}>
          <View style={styles.tutorialCard}>
            <Image source={{ uri: tool.imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{tool.name}</Text>
              <Text style={styles.duration}>Price: Rs {tool.price}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleEdit(tool.id)}
                >
                  <AntDesign name="edit" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDelete(tool.id, tool.imageUrl)}
                >
                  <AntDesign name="delete" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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

export default ToolList;
