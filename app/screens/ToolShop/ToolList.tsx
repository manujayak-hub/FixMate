import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { ref, deleteObject } from 'firebase/storage';
import { AntDesign } from '@expo/vector-icons';
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";

const searchicon = require("../../../assets/searchicon.png");

// Define the structure for a tool
interface Tool {
  id: string;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
  userId: string;
}

// Define the type for the navigation prop
type RootStackParamList = {
  EditTool: { toolId: string };
  STView: { toolId: string };
  ToolView: { toolId: string };
};

const ToolList: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // State for selected category
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const categories = [
    'All',
  'Electronic Repair',
  'Home and Appliance Repair',
  'Cloathing',
  'Garden Equipment',
  'Musical Instruments',
  'Jwellery and Watches',
  'Automotive Repair',
  'Furniture Repair',
  'Computers',];

  useEffect(() => {
    // Get the current logged-in user ID from Firebase Auth
    const userId = FIREBASE_AUTH.currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    // Query Firestore to get tools that match the logged-in user ID
    const toolsCollection = collection(FIREBASE_DB, 'Tools');
    const toolsQuery = query(toolsCollection, where('userId', '==', userId));

    const unsubscribe = onSnapshot(
      toolsQuery,
      snapshot => {
        const toolsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Tool),
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

  // Filter tools by selected category and search term
  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (id: string, imageUrl?: string) => {
    try {
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
                  // Validate the URL format
                  const isValidUrl = (url: string) => {
                    return url.startsWith('https://') || url.startsWith('gs://');
                  };
                  if (isValidUrl(imageUrl)) {
                    const imageRef = ref(FIREBASE_STORAGE, imageUrl);
                    await deleteObject(imageRef); // Delete the image from storage
                  } else {
                    
                  }
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
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header />
     
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tools..."
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
        />
        <Image source={searchicon} style={styles.searchIcon} />
      </View>

      <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {filteredTools.map(tool => (
          <TouchableOpacity key={tool.id} onPress={() => handleView(tool.id)}>
            <View style={styles.toolCard}>
              <Image source={{ uri: tool.imageUrl }} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{tool.name}</Text>
                <Text style={styles.price}>Price: Rs {tool.price}</Text>
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

      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#EEEEEE',
  },
  searchContainer: {
    position: "relative",
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
  },
  searchInput: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    paddingRight: 40, 
  },
  toolCard: {
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
    marginRight: 10,
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
  price: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    marginRight: 40,
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
  searchIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  categoryContainer: {
    marginVertical: 10,
    marginLeft: 20,
    
    marginTop:20,
    backgroundColor: '#EEEEEE',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
    marginRight: 10,
    height:40,
  },
  selectedCategoryButton: {
    backgroundColor: '#FF6100',
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ToolList;
