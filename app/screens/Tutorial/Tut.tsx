import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy, limit,QuerySnapshot, DocumentData, DocumentSnapshot  } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


// Define type for navigation
type RootStackParamList = {
  TutorialList: { category: string };
  CatTutorial: { category: string };
  TutorialDoc: { tutorialId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'TutorialList'>;

// Define type for tutorial object
interface Tutorial {
  id: string;
  title: string;
  imageUrl?: string;
  timeDuration?: string;
}

const Tut: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const tutorialsCollection = collection(FIREBASE_DB, 'Tutorial');
  
    // Setup real-time listener
    const tutorialsQuery = query(tutorialsCollection, orderBy('uploadTime', 'desc'), limit(7));
  
    const unsubscribe = onSnapshot(
      tutorialsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const tutorialsData = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tutorial[]; // Cast the result to the Tutorial type
        setTutorials(tutorialsData);
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
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6100" />
        <Text style={styles.loadingText}>Loading tutorials...</Text>
      </View>
    );
  }

  return (
    <ScrollView  contentContainerStyle={styles.layoutd}>
      <Text style={styles.categoryText}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subView}
      >
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

      <Text style={styles.diyText}>DIY Tutorials</Text>
      {tutorials.length === 0 ? (
        <Text style={styles.noTutorialText}>No tutorials available at the moment.</Text>
      ) : (
        tutorials.map((tutorial) => (
          <TouchableOpacity
            key={tutorial.id}
            style={styles.imageButton}
            onPress={() => navigation.navigate('TutorialDoc', { tutorialId: tutorial.id })}
          >
            <View >
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
  );
};

const styles = StyleSheet.create({
  layoutd: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#fff3e6',
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
  homeApplianceText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
  homeApplianceText1: {
    fontWeight: '700',
    fontSize: 14,
    color: '#000000',
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
  subView: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  diyText: {
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    marginBottom: 10,
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
  noTutorialText: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Tut;
