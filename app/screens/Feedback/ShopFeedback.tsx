import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FIREBASE_DB } from '../../../Firebase_Config'; // Import Firebase config
import { collection, onSnapshot } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

// Define the type for a feedback item
interface Feedback {
  id: string;
  name: string;
  description: string;
  shopN:string;
  rating: number;
}

const ShopFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch feedback from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIREBASE_DB, 'shopfeedback'), (snapshot) => {
      const feedbackData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Feedback[];
      setFeedbackList(feedbackData);

      // Calculate total reviews and average rating
      const total = feedbackData.length;
      const avgRating = total > 0 
        ? feedbackData.reduce((sum, feedback) => sum + (feedback.rating || 0), 0) / total 
        : 0;

      setTotalReviews(total);
      setAverageRating(avgRating);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shop Reviews</Text>

      {/* Total Reviews and Average Rating */}
      <View style={styles.summaryContainer}>
        <Text style={styles.totalReviews}>Total Reviews: {totalReviews}</Text>
        <Text style={styles.averageRating}>Average Rating: {averageRating.toFixed(1)}</Text>
      </View>

      <Text style={styles.feedbackHeader}>Recent Feedbacks</Text>
      {/* List of Reviews */}
      <FlatList
        data={feedbackList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.feedbackCard}>
            <Text style={styles.name}>{item.shopN}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ShopFeedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  feedbackHeader: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  totalReviews: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  feedbackCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 5,
  },
});
