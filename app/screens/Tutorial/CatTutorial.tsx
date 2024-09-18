import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your navigation and route parameter types
type RootStackParamList = {
  TutorialDoc: { tutorialId: string };
  CatTutorial: { category: string }; // Add category route param here
};

type CatTutorialRouteProp = RouteProp<RootStackParamList, 'CatTutorial'>;
type CatTutorialNavigationProp = StackNavigationProp<RootStackParamList, 'CatTutorial'>;

interface Tutorial {
  id: string;
  title: string;
  imageUrl?: string;
  timeDuration?: string;
}

const CatTutorial: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const route = useRoute<CatTutorialRouteProp>(); // Get the passed category
  const navigation = useNavigation<CatTutorialNavigationProp>(); // For navigation
  const { category } = route.params; // Extract category from route parameters

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const q = query(
          collection(FIREBASE_DB, 'Tutorial'),
          where('category', '==', category) // Query based on the selected category
        );
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
        const tutorialsList: Tutorial[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Tutorial),
        }));
        setTutorials(tutorialsList);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [category]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6100" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutorials for {category}</Text>

      {/* Display message if no tutorials are available */}
      {tutorials.length === 0 ? (
        <Text style={styles.noTutorialText}>No tutorials available at the moment.</Text>
      ) : (
        <FlatList
          data={tutorials}
          keyExtractor={(item) => item.id}
          renderItem={({ item: tutorial }) => (
            <TouchableOpacity
              key={tutorial.id}
              style={styles.imageButton}
              onPress={() => {
                navigation.navigate('TutorialDoc', { tutorialId: tutorial.id });
                console.log('Image button pressed');
              }}
            >
              <View style={styles.imageContainer}>
                {tutorial.imageUrl ? (
                  <Image
                    source={{ uri: tutorial.imageUrl }}
                    style={styles.img1}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>No Image</Text>
                  </View>
                )}
                <Text style={styles.imageText}>{tutorial.title}</Text>
                <Text style={styles.imageText1}>Duration: {tutorial.timeDuration || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CatTutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff3e6'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6100',
    marginBottom: 20,
  },
  noTutorialText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  imageButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  imageContainer: {
    alignItems: 'center',
  },
  img1: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  imagePlaceholderText: {
    color: 'gray',
    fontSize: 16,
  },
  imageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  imageText1: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
});
