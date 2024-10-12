import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure
import Navbar from "../../Components/NavigationFor_Business";
import Shop_Header from "../../Components/Shop_Header";




const ToolView: React.FC = () => {
  const route = useRoute();
  const { toolId } = route.params as { toolId: string };
  const [tool, setTool] = useState<any>(null); // Adjust to your Tool type if needed
 

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const toolDocRef = doc(FIREBASE_DB, 'Tools', toolId);
        const toolDoc = await getDoc(toolDocRef);

        if (toolDoc.exists()) {
          setTool({ id: toolDoc.id, ...toolDoc.data() });
        } else {
          Alert.alert('Error', 'Tool not found');
        }
      } catch (error) {
        console.error('Error fetching tool details:', error);
        Alert.alert('Error', 'Failed to load tool details');
      }
    };

    

    fetchTool();
    

    
  }, [toolId]);

  if (!tool) {
    return <Text>Loading...</Text>; // You can add a loading indicator here
  }

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Shop_Header/>
    <View style={styles.container}>
      <Image source={{ uri: tool.imageUrl }} style={styles.image} />
      <Text style={styles.txt}>Tool Name :</Text>
      <Text style={styles.title}>{tool.name}</Text>
      <Text style={styles.txt}>Tool Category :</Text>
      <Text style={styles.title}>{tool.category}</Text>
      <Text style={styles.txt}>Tool Price :</Text>
      <Text style={styles.title}>Rs {tool.price}</Text>
      <Text style={styles.txt}>Tool Description :</Text>
      <Text style={styles.title}>{tool.description}</Text>

      
    </View>
    <Navbar/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
   
    backgroundColor: '#fff3e6',
    
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 5,
    marginLeft:30,
  },
  price: {
    fontSize: 18,
    color: 'gray',
  },
  reviewsTitle: {
    fontWeight: '700',
    fontSize: 20,
    marginVertical: 10,
  },
  reviewsContainer: {
    width: '100%',
  },
  reviewCard: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
  },
  txt: {
    fontWeight: '700',
    fontSize: 16,
    marginTop:20,
    color: '#FF6100',
  },
  sscontainer: {
    width: 367,
    
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    margin:15,
    padding:18,            
  },
});

export default ToolView;
