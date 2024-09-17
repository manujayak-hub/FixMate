import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView ,SafeAreaView} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { Video ,ResizeMode} from 'expo-av';
import { RouteProp } from '@react-navigation/native';

// Define types for the route params
type RootStackParamList = {
  TutorialDoc: { tutorialId: string };
};

type TutorialDocRouteProp = RouteProp<RootStackParamList, 'TutorialDoc'>;

// Define type for tutorial data
interface TutorialData {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  tools:String;
}

const TutorialDoc: React.FC = () => {
  const [tutorial, setTutorial] = useState<TutorialData | null>(null);
  const route = useRoute<TutorialDocRouteProp>(); // Get route parameters
  const { tutorialId } = route.params; // Get the tutorialId from the route params

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'Tutorial', tutorialId); // Fetch document by ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTutorial(docSnap.data() as TutorialData); // Type assertion for tutorial data
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error);
      }
    };

    fetchTutorial();
  }, [tutorialId]);

  if (!tutorial) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView >
      <Text style={styles.title}>{tutorial.title}</Text>
      <Image
        source={{ uri: tutorial.imageUrl }} // Ensure `imageUrl` is a valid URL string
        style={styles.image}
      />
      
      <Text style={styles.txt}>How to do:</Text>
      <Text style={styles.description}>{tutorial.description}</Text>

      <Text style={styles.txt}>Tools Needed:</Text>
      <Text style={styles.tools}>{tutorial.tools}</Text>
      

      <Text style={styles.txt}>Watch this:</Text>
      {tutorial.videoUrl && (
        <Video
          source={{ uri: tutorial.videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN} // Use ResizeMode enum if necessary
          isLooping
        />
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff3e6',
    flex: 1
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tools:{
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  video: {
    marginTop:20,
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,        
    overflow: 'hidden',
  },

  txt: {
    fontWeight: '700',
    fontSize: 16,
    color: '#FF6100',
  },
});

export default TutorialDoc;
