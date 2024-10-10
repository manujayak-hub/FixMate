import React, { useState, useEffect } from 'react';
import { SafeAreaView, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy, limit, where, QuerySnapshot, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { StackNavigationProp } from '@react-navigation/stack';
import ClientHeader from '../../Components/ClientHeader';
import Navigation from "../../Components/Navigation";

// Import images
const rect = require("../../../assets/rect56.png");
const searchicon = require("../../../assets/searchicon.png");
const allico = require("../../../assets/Allico.png");
const automotiveico = require("../../../assets/automotiveico.png");
const applianceico = require("../../../assets/applianceico.png");
const clothingico = require("../../../assets/cloathingico.png");
const computerico = require("../../../assets/computerico.png");
const electronicico = require("../../../assets/electronicico.png");
const furnitureico = require("../../../assets/furnitureico.png");
const homegardenico = require("../../../assets/homegardenico.png");
const jewelryico = require("../../../assets/jwelleryico.png");
const musicalico = require("../../../assets/musicalico.png");
const otherico = require("../../../assets/otherico.png");

// Define type for navigation
type RootStackParamList = {

  
  UserTutorialDoc: { tutorialId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'UserTutorialDoc'>;





// Define type for tutorial object
interface Tutorial {
  id: string;
  title: string;
  imageUrl?: string;
  timeDuration?: string;
  category: string;
}

const categories = [
  'All',
  'Electronic Repair',
  'Home and Appliance Repair',
  'Cloathing',

  'Garden Equipment',
  'Musical Instruments',
  'Jwellery and Watches',

  'GardenEquipment',
  'MusicalInstruments',
  'JwelleryWatches',

  'Automotive Repair',
  'Furniture Repair',
  'Computers',
];

const categoryImages: { [key: string]: any } = {
  'All': allico,
  'Electronic Repair': electronicico,
  'Home and Appliance Repair': applianceico,
  'Automotive Repair': automotiveico,
  'Cloathing': clothingico,
  'Furniture Repair': furnitureico,
  'GardenEquipment': homegardenico,
  'MusicalInstruments': musicalico,
  'JwelleryWatches': jewelryico,
  'Computers': computerico,
};

const UserTutorial: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    loadTutorials(); // Fetch all tutorials initially
  }, []);

  // Fetches tutorials from Firestore based on selected category or 'All'
  const loadTutorials = (category: string | null = 'All') => {
    setLoading(true); // Start loading before fetching data
  
    const tutorialsCollection = collection(FIREBASE_DB, 'Tutorial');
    let tutorialsQuery;
  
    if (category === 'All') {
      // Query to get the first 10 tutorials if 'All' is selected
      tutorialsQuery = query(tutorialsCollection, limit(10));
    } else {
      // Query to get tutorials of the selected category without ordering
      tutorialsQuery = query(tutorialsCollection, where('category', '==', category), limit(10));
    }
  
    // Setup real-time listener
    const unsubscribe = onSnapshot(
      tutorialsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const tutorialsData = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tutorial[]; // Cast the result to the Tutorial type
        setTutorials(tutorialsData);
        setFilteredTutorials(tutorialsData); // Initialize filtered tutorials with all tutorials
        setLoading(false); // Stop loading when data is fetched
      },
      (error) => {

        

        Alert.alert('Error', 'Failed to load tutorials');
        console.error('Error fetching tutorials:', error);

        setLoading(false); // Stop loading on error
      }
    );
  
    // Cleanup listener on unmount
    return () => unsubscribe();
  };

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);

    if (category === 'All') {
      loadTutorials('All'); // Fetch the first 10 tutorials when 'All' is selected
    } else {
      loadTutorials(category); // Fetch tutorials based on the selected category
    }
  };

  // Filter tutorials by both category and search query
  const filterBySearch = (text: string) => {
    setSearchQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filtered = tutorials.filter(tutorial => {
      const matchesCategory = selectedCategory ? tutorial.category === selectedCategory : true;
      const matchesSearch = tutorial.title.toLowerCase().includes(lowercasedQuery);
      return matchesCategory && matchesSearch;
    });
    setFilteredTutorials(filtered);
  };

 
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Tutorials"
          value={searchQuery}
          onChangeText={filterBySearch} // Call the search function on text change
        />
        <Image source={searchicon} style={styles.searchIcon} />
      </View>
      <ScrollView contentContainerStyle={styles.layoutd}>

        <View style={styles.topics}>
          <Image style={styles.rect} source={rect}></Image>
          <Text>Category</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
              onPress={() => filterByCategory(category)} // Filter tutorials by the selected category
            >
              <Image source={categoryImages[category]} style={styles.categoryIcon} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.topics}>
          <Image style={styles.rect} source={rect}></Image>
          <Text>DIY Tutorials</Text>
        </View>

        {filteredTutorials.length === 0 ? (
          <Text style={styles.noTutorialText}>No tutorials available at the moment.</Text>
        ) : (
          filteredTutorials.map((tutorial) => (
            <TouchableOpacity
              key={tutorial.id}
              style={styles.imageButton}
              onPress={() => navigation.navigate('UserTutorialDoc', { tutorialId: tutorial.id })}
            >
              <View>
                {tutorial.imageUrl ? (
                  <Image source={{ uri: tutorial.imageUrl }} style={styles.img1} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>No Image</Text>
                  </View>
                )}
                <Text style={styles.imageText}>{tutorial.title}</Text>
                <Text style={styles.imageText1}>
                  Duration: {tutorial.timeDuration || 'N/A'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  layoutd: {
    flexDirection: 'column',
    padding: 10,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FF6100',
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    borderRadius: 10,
    marginRight: 5,
    height: 70, 
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategory: {
    backgroundColor: "#Ffffff",
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  categoryText: {
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  diyText: {
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    marginBottom: 10,
  },
  noTutorialText: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
    marginTop: 100,
  },
  imageButton: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  img1: {
    borderRadius: 20,
    width: '100%',
    height: 200,
  },
  imageText: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 10,
    left: 10,
    padding: 5,
    borderRadius: 5,
  },
  imageText1: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    bottom: 10,
    left: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  imagePlaceholderText: {
    fontSize: 18,
    color: '#808080',
  },
  searchInput: {
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    paddingRight: 40, 
  },
  topics: {
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "bold",
  },
  rect: {
    margin: 10,
    maxWidth: 20,
  },
  searchContainer: {
    position: "relative", // Parent container needs relative positioning
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
  },
  searchIcon: {
    position: "absolute",
    top: 15, // Adjust vertically within the TextInput
    right: 15, // Align to the right of the TextInput
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});

export default UserTutorial;
