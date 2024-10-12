import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy, limit, QuerySnapshot, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { StackNavigationProp } from '@react-navigation/stack';
import ClientHeader from '../../Components/ClientHeader';
import Navigation from "../../Components/Navigation";
import Cart from "../../Components/Cart"

// Import images
const rect = require("../../../assets/rect56.png");
const searchicon = require("../../../assets/searchicon.png");

const automotiveico = require("../../../assets/automotiveico.png");
const applianceico = require("../../../assets/applianceico.png");
const clothingico = require("../../../assets/cloathingico.png");
const computerico = require("../../../assets/computerico.png");
const electronicico = require("../../../assets/electronicico.png");
const furnitureico = require("../../../assets/furnitureico.png");
const homegardenico = require("../../../assets/homegardenico.png");
const jewelryico = require("../../../assets/jwelleryico.png");
const musicalico = require("../../../assets/musicalico.png");

// Define type for navigation
type RootStackParamList = {
  TutorialList: { category: string };
  CatTutorial: { category: string };
  TutorialDoc: { tutorialId: string };
  URToolShop: { toolId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'TutorialList'>;

// Define type for tool object
interface Shop {
  id: string;
  name: string;
  imageUrl?: string;
  timeDuration?: string;
  price?: string; // Added price field
  category?: string; // Added category field for filtering
}

const categories = [
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

const categoryImages: { [key: string]: any } = {
  'Electronic Repair': electronicico,
  'Home and Appliance Repair': applianceico,
  'Cloathing': clothingico,
  'Garden Equipment':homegardenico,
  'Automotive Repair': automotiveico,
  
  'Furniture Repair': furnitureico,
  
  'Musical Instruments':musicalico,
  'Jwellery and Watches':jewelryico,
  'Computers':computerico,
};

const UserToolShop: React.FC = () => {
  const [tools, setTools] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search input
  const [filteredTools, setFilteredTools] = useState<Shop[]>([]); // State for filtered tools
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const toolsCollection = collection(FIREBASE_DB, 'Tools');

    // Setup real-time listener to fetch only the last 10 added tools
    const tutorialsQuery = query(toolsCollection, orderBy('uploadTime', 'desc'), limit(10));

    const unsubscribe = onSnapshot(
      tutorialsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const toolsData = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })) as Shop[]; // Cast the result to the Shop type
        setTools(toolsData);
        setLoading(false); // Stop loading when data is fetched
        setFilteredTools(toolsData); // Initialize filtered tools with all tools
      },
      (error) => {
        
        setLoading(false); // Stop loading on error
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Filter tools based on search query (case-insensitive)
  useEffect(() => {
    if (searchQuery) {
      const filtered = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTools(filtered);
    } else {
      setFilteredTools(tools);
    }
  }, [searchQuery, tools]);

  // Function to filter tools by category
  const filterByCategory = (category: string) => {
    const filtered = tools.filter(tool => tool.category === category);
    setFilteredTools(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6100" />
        <Text style={styles.loadingText}>Loading tools...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClientHeader />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tools by name"
          value={searchQuery}
          onChangeText={setSearchQuery} // Update search query
        />
        <Image source={searchicon} style={styles.searchIcon} />
      </View>

      <View style={styles.topics}>
        <Image style={styles.rect} source={rect}></Image>
        <Text >Category</Text>
        <Cart/>
      </View>

      <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => {
              setSelectedCategory(category);
              filterByCategory(category); // Filter tools by the selected category
            }}
          >
            <Image
              source={categoryImages[category]}
              style={styles.categoryIcon}
            />
          
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      <View style={styles.topics}>
        <Image style={styles.rect} source={rect}></Image>
        <Text>Tools</Text>
        
      </View>

      <ScrollView contentContainerStyle={styles.layout}>

        {filteredTools.length === 0 ? (
          <Text style={styles.noTutorialText}>No Tools available at the moment.</Text>
        ) : (
          <View style={styles.gridContainer}>
            {filteredTools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={styles.toolCard}
                onPress={() => navigation.navigate('URToolShop', { toolId: tool.id })}
              >
                <View style={styles.cardContainer}>
                  {tool.imageUrl ? (
                    <Image source={{ uri: tool.imageUrl }} style={styles.img1} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imagePlaceholderText}>No Image</Text>
                    </View>
                  )}
                  <Text style={styles.imageText}>{tool.name}</Text>
                  <Text style={styles.imagePrice}>Price: Rs. {tool.price || 'N/A'}</Text>
                  
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
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
  categoryText: {
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    marginBottom: 10,
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
    marginTop: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%', // Adjust to fit two cards per row
    marginBottom: 20,
  },
  cardContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    overflow: 'hidden',
    padding: 10,
  },
  img1: {
    borderRadius: 10,
    width: '100%',
    height: 150,
  },
  imageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  imagePrice: {
    fontSize: 16,
    color: '#FF6100',
    marginTop: 5,
  },
  imageText1: {
    fontSize: 14,
    color: '#707070',
    marginTop: 5,
  },
  categoryScroll: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    minHeight: 20,
  },
  categoryButton: {
    borderRadius: 10,
    marginRight: 5,
    height: 70, 
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    width: 60, 
    height: 60, 
    marginBottom: 5,
  },
  selectedCategory: {
    backgroundColor: "#Ffffff",
  },
  searchContainer: {
    position: "relative", // Parent container needs relative positioning
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
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
  searchIcon: {
    position: "absolute",
    top: 15, // Adjust vertically within the TextInput
    right: 15, // Align to the right of the TextInput
    width: 20,
    height: 20,
    resizeMode: "contain",
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
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  imagePlaceholderText: {
    fontSize: 18,
    color: '#808080',
  },
});

export default UserToolShop;
