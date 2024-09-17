import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { Video } from 'expo-av';

const TutorialDoc = () => {
  const [tutorial, setTutorial] = useState(null);
  const route = useRoute();
  const { tutorialId } = route.params; // Get the tutorialId from the route params

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'Tutorial', tutorialId); // Fetch document by ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTutorial(docSnap.data());
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
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: tutorial.imageUrl }} // Ensure `imageUrl` is a valid URL string
        style={styles.image}
      />
      <Text style={styles.title}>{tutorial.title}</Text>
      <Text style={styles.duration}>Duration: {tutorial.timeDuration}</Text>
      <Text style={styles.description}>{tutorial.description}</Text>
      
      {tutorial.videoUrl && (
        <Video
          source={{ uri: tutorial.videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  duration: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default TutorialDoc;
