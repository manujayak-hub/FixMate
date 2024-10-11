import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView,SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure
import { Video ,ResizeMode } from 'expo-av';
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";

// Define the types for the route params
type RootStackParamList = {
  STView: { tutorialId: string };
};

type STViewRouteProp = RouteProp<RootStackParamList, 'STView'>;

// Define the types for the tutorial data structure
interface TutorialData {
  imageUrl: string;
  title: string;
  tools:String;
  description: string;
  videoUrl?: string;
  category:String;
  timeDuration:String;
}

const STView: React.FC = () => {
  const [tutorial, setTutorial] = useState<TutorialData | null>(null);
  const route = useRoute<STViewRouteProp>(); // Get the route params
  const { tutorialId } = route.params; // Extract the tutorialId from route params

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'Tutorial', tutorialId); // Reference to the Firestore document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTutorial(docSnap.data() as TutorialData); // Set tutorial data with proper type assertion
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
      <Shop_Header/>
    <ScrollView contentContainerStyle={styles.scontainer}>
    <View style={styles.sscontainer}>
      <Text style={styles.title}>{tutorial.title}</Text>
      <Image
        source={{ uri: tutorial.imageUrl }} // Ensure `imageUrl` is a valid URL string
        style={styles.image}
      />

        <Text style={styles.txt}>Category:</Text>
        <Text style={styles.description}>{tutorial.category}</Text>
            
      <Text style={styles.txt}>How to do:</Text>
      <Text style={styles.description}>{tutorial.description}</Text>
      
      <Text style={styles.txt}>Recomended Tools:</Text>
      <Text style={styles.description}>{tutorial.tools}</Text>
      
      <Text style={styles.txt}>Watch this:</Text>
      {tutorial.videoUrl && (
        <Video
          source={{ uri: tutorial.videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
      )}

        <Text style={styles.txt}>Time Duartion:</Text>
        <Text style={styles.description}>{tutorial.timeDuration}</Text>
    </View>
    </ScrollView>
    <Navbar/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: '#fff3e6',
    flex: 1,
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
    alignSelf:'center',
  },
  duration: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  video: {
    marginTop: 20,
    width: '100%',
    height:200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    
  },
  txt: {
    fontWeight: '700',
    fontSize: 16,
    marginTop:20,
    color: '#FF6100',
  },
  scontainer: {
    flexGrow: 1,
    
    
  },
  sscontainer: {
    width: 367,
    
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    margin:15,
    padding:18,            
  },
});

export default STView;
