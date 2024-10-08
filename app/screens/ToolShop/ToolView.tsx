import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Adjust import according to your file structure

interface Review {
  id: string;
  content: string;
  rating: number;
}

const ToolView: React.FC = () => {
  const route = useRoute();
  const { toolId } = route.params as { toolId: string };
  const [tool, setTool] = useState<any>(null); // Adjust to your Tool type if needed
  const [reviews, setReviews] = useState<Review[]>([]); // State to hold reviews

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

    const fetchReviews = () => {
      const reviewsCollection = collection(FIREBASE_DB, 'Reviews');
      const reviewsQuery = query(reviewsCollection, where('toolId', '==', toolId)); // Assuming reviews have a 'toolId' field

      const unsubscribe = onSnapshot(
        reviewsQuery,
        snapshot => {
          const reviewsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Review), // Type assertion to Review structure
          }));
          setReviews(reviewsData);
        },
        error => {
          console.error('Error fetching reviews:', error);
        }
      );

      return unsubscribe; // Return the unsubscribe function
    };

    fetchTool();
    const unsubscribeReviews = fetchReviews();

    // Cleanup function to unsubscribe from reviews listener
    return () => unsubscribeReviews();
  }, [toolId]);

  if (!tool) {
    return <Text>Loading...</Text>; // You can add a loading indicator here
  }

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewText}>Comment: {item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: tool.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{tool.name}</Text>
      <Text style={styles.price}>Price: Rs {tool.price}</Text>

      <Text style={styles.reviewsTitle}>Reviews:</Text>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.reviewsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
    marginVertical: 10,
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
});

export default ToolView;
