import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy, limit, QuerySnapshot, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { StackNavigationProp } from '@react-navigation/stack';

// Define type for navigation
type RootStackParamList = {
  TutorialList: { category: string };
  CatTutorial: { category: string };
  TutorialDoc: { tutorialId: string };
  URToolShop: { toolId: string }; // Add this for the tool details screen
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'TutorialList'>;

// Define type for tool object
interface Shop {
  id: string;
  title: string;
  imageUrl?: string;
  timeDuration?: string;
  price?: string; // Added price field
}

const UserToolShop: React.FC = () => {
  const [tools, setTools] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();

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
      },
      (error) => {
        Alert.alert('Error', 'Failed to load tools');
        console.error('Error fetching tools:', error);
        setLoading(false); // Stop loading on error
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6100" />
        <Text style={styles.loadingText}>Loading tools...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.layout}>
      <Text style={styles.categoryText}>Tools Shop</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subView}
      >
        {/* Category Buttons */}
        <TouchableOpacity
          style={styles.rectangle1}
          onPress={() => navigation.navigate('TutorialList', { category: 'Home and Appliance Repair' })}
        >
          <Text style={styles.homeApplianceText}>Home and Appliance</Text>
          <Text style={styles.homeApplianceText1}>Repair</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangle1}
          onPress={() => navigation.navigate('CatTutorial', { category: 'Automotive Repair' })}
        >
          <Text style={styles.homeApplianceText}>Automotive Repair</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangle1}
          onPress={() => navigation.navigate('CatTutorial', { category: 'Electronic Repair' })}
        >
          <Text style={styles.homeApplianceText}>Electronic Repair</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangle1}
          onPress={() => navigation.navigate('CatTutorial', { category: 'Furniture Repair' })}
        >
          <Text style={styles.homeApplianceText}>Furniture Repair</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.diyText}>Recently Added Tools</Text>
      {tools.length === 0 ? (
        <Text style={styles.noTutorialText}>No Tools available at the moment.</Text>
      ) : (
        <View style={styles.gridContainer}>
          {tools.map((tool) => (
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
                <Text style={styles.imageText}>{tool.title}</Text>
                <Text style={styles.imagePrice}>Price: {tool.price || 'N/A'}</Text>
                <Text style={styles.imageText1}>Duration: {tool.timeDuration || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
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
    fontWeight: '600',
    color: '#FF6100',
  },
  imageText1: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
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
  rectangle1: {
    width: 224,
    height: 74,
    backgroundColor: 'rgba(255, 97, 0, 0.7)',
    borderRadius: 15,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeApplianceText1: {
    fontWeight: '700',
    fontSize: 14,
    color: '#000000',
  },
  homeApplianceText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
  subView: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UserToolShop;
