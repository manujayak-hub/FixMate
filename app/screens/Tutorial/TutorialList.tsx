import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, SafeAreaView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../../../Firebase_Config';
import { ref, deleteObject } from 'firebase/storage';
import { AntDesign } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";

const searchicon = require("../../../assets/searchicon.png");

// Define the structure for a tutorial
interface Tutorial {
  id: string;
  title: string;
  timeDuration: string;
  imageUrl: string;
  videoUrl?: string;
  category: string; // Add category to the tutorial interface
}

// Define the type for the navigation prop
type RootStackParamList = {
  EditTutorial: { tutorialId: string };
  STView: { tutorialId: string };
};

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
  'Computers',
]; 

const TutorialList: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for the search query
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // State for the selected category
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const tutorialsCollection = collection(FIREBASE_DB, 'Tutorial');
    const q = query(tutorialsCollection, where('userId', '==', userId)); // Filter by logged-in user's ID

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const tutorialsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Tutorial), // Type assertion to Tutorial structure
        }));
        setTutorials(tutorialsData);
        setFilteredTutorials(tutorialsData); // Initialize filtered tutorials
      },
      error => {
        Alert.alert('Error', 'Failed to load tutorials');
        console.error('Error fetching tutorials:', error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    // Filter tutorials based on category and search query
    let filtered = tutorials;
    
    if (selectedCategory !== 'All') {
      filtered = tutorials.filter(tutorial => tutorial.category === selectedCategory);
    }

    if (searchQuery !== '') {
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTutorials(filtered);
  }, [searchQuery, tutorials, selectedCategory]);

  const handleDelete = async (id: string, videoUrl?: string, imageUrl?: string) => {
    try {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this tutorial?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: async () => {
              try {
                if (videoUrl) {
                  const videoRef = ref(FIREBASE_STORAGE, videoUrl);
                  await deleteObject(videoRef);
                }
                if (imageUrl) {
                  const imageRef = ref(FIREBASE_STORAGE, imageUrl);
                  await deleteObject(imageRef);
                }
                await deleteDoc(doc(FIREBASE_DB, 'Tutorial', id));
                Alert.alert('Success', 'Tutorial deleted successfully');
              } catch (error) {
                console.error('Error during deletion process:', error);
                Alert.alert('Error', 'An unexpected error occurred');
              }
            },
          },
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

  const handleView = (id: string) => {
    navigation.navigate('STView', { tutorialId: id });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header />

      

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search tutorials by title"
          value={searchQuery}
          onChangeText={setSearchQuery}
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

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
     
        {filteredTutorials.map(tutorial => (
          <TouchableOpacity key={tutorial.id} onPress={() => handleView(tutorial.id)}>
            <View style={styles.tutorialCard}>
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
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EEEEEE',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#EEEEEE',
  },
  searchBar: {
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    paddingRight: 40,
  },
  tutorialCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    marginTop:10,
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
  duration: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    marginRight: 20,
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
  searchContainer: {
    position: "relative",
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
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
    height: 50,
    marginTop:20,
     flexWrap: 'wrap',
    
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

export default TutorialList;
